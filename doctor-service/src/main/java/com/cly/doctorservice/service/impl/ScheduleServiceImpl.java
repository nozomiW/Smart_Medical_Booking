package com.cly.doctorservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.entity.Schedule;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.mapper.ScheduleMapper;
import com.cly.doctorservice.mapper.ScheduleRuleMapper;
import com.cly.doctorservice.mq.constant.MQConstant;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.ScheduleService;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private static final String DEDUCT_LUA =
            "local val = redis.call('GET', KEYS[1])\n" +
            "if val == false then return -1 end\n" +
            "local num = tonumber(val)\n" +
            "if num <= 0 then return 0 end\n" +
            "redis.call('SET', KEYS[1], num - 1)\n" +
            "return num - 1";

    private static final DefaultRedisScript<Long> DEDUCT_SCRIPT =
            new DefaultRedisScript<>(DEDUCT_LUA, Long.class);

    private ScheduleRuleMapper scheduleRuleMapper;
    private ScheduleMapper scheduleMapper;
    private StringRedisTemplate stringRedisTemplate;
    private RocketMQTemplate rocketMQTemplate;

    @Autowired
    public void setScheduleRuleMapper(ScheduleRuleMapper scheduleRuleMapper) {
        this.scheduleRuleMapper = scheduleRuleMapper;
    }

    @Autowired
    public void setScheduleMapper(ScheduleMapper scheduleMapper) {
        this.scheduleMapper = scheduleMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Autowired
    public void setRocketMQTemplate(RocketMQTemplate rocketMQTemplate) {
        this.rocketMQTemplate = rocketMQTemplate;
    }

    @Override
    public Result insertScheduleRule(ScheduleRule rule) {
        int rows = scheduleRuleMapper.insert(rule);
        return rows > 0 ? Result.SUCCESS : Result.FALSE;
    }

    @Override
    public Result insertSchedule(Long docId, int weeks) {
        List<ScheduleRule> rules = scheduleRuleMapper.selectList(
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<ScheduleRule>()
                        .eq(ScheduleRule::getDocId, docId));

        if (rules.isEmpty()) return Result.FALSE;

        LocalDate today = LocalDate.now();
        LocalDate end = today.plusWeeks(weeks);

        List<Schedule> toInsert = new ArrayList<>();
        for (LocalDate date = today; date.isBefore(end); date = date.plusDays(1)) {
            int dow = date.getDayOfWeek().getValue();
            for (ScheduleRule rule : rules) {
                if (rule.getDayOfWeek().equals(dow)) {
                    Schedule s = new Schedule();
                    s.setId(ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE));
                    s.setDocId(docId);
                    s.setWorkDate(date);
                    s.setAvailableNum(rule.getMaxCount());
                    s.setStatus(1);
                    toInsert.add(s);
                }
            }
        }

        if (toInsert.isEmpty()) return Result.FALSE;

        int rows = scheduleMapper.batchInsert(toInsert);
        return rows > 0 ? Result.SUCCESS : Result.FALSE;
    }

    @Override
    public List<ScheduleDetailDTO> findDetailByDate(LocalDate workDate) {
        String redisKey = "schedule:detail:" + workDate;

        List<Object> cached = stringRedisTemplate.opsForHash().values(redisKey);
        if (!cached.isEmpty())
            return cached.stream()
                    .map(o -> JSON.parseObject((String) o, ScheduleDetailDTO.class))
                    .collect(Collectors.toList());

        List<ScheduleDetailDTO> list = scheduleMapper.findDetailByDate(workDate);
        if (!list.isEmpty()) {
            Map<String, String> map = list.stream().collect(
                    Collectors.toMap(d -> d.getScheduleId().toString(), JSON::toJSONString));
            stringRedisTemplate.opsForHash().putAll(redisKey, map);
            stringRedisTemplate.expire(redisKey, 2, TimeUnit.HOURS);
            // 同步初始化各排班的号源计数 key
            for (ScheduleDetailDTO d : list) {
                String numKey = "schedule:num:" + d.getScheduleId();
                if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
                    stringRedisTemplate.opsForValue().set(numKey,
                            String.valueOf(d.getAvailableNum()), 2, TimeUnit.HOURS);
                }
            }
        }
        return list;
    }

    @Override
    public ScheduleDetailDTO findDetailById(Long scheduleId) {
        return scheduleMapper.findDetailById(scheduleId);
    }

    @Override
    public Result deductAvailableNum(Long scheduleId) {
        String numKey = "schedule:num:" + scheduleId;

        // 若 Redis 中无号源缓存，先从 DB 加载
        if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
            ScheduleDetailDTO detail = scheduleMapper.findDetailById(scheduleId);
            if (detail == null) return Result.FALSE;
            stringRedisTemplate.opsForValue().set(numKey,
                    String.valueOf(detail.getAvailableNum()), 2, TimeUnit.HOURS);
        }

        // Lua 原子预扣，返回扣减后的值，-1=key不存在，0=号源耗尽
        Long remaining = stringRedisTemplate.execute(
                DEDUCT_SCRIPT,
                Collections.singletonList(numKey));

        if (remaining == null || remaining < 0) return Result.FALSE;

        // 发 MQ 异步扣减 DB
        rocketMQTemplate.syncSend(
                MQConstant.Topic.SCHEDULE_DEDUCT + ":" + MQConstant.Tag.DEDUCT,
                scheduleId);

        return Result.SUCCESS;
    }
}
