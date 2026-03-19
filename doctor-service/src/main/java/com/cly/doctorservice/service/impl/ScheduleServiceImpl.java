package com.cly.doctorservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.entity.Schedule;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.mapper.ScheduleMapper;
import com.cly.doctorservice.mapper.ScheduleRuleMapper;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    private ScheduleRuleMapper scheduleRuleMapper;
    private ScheduleMapper scheduleMapper;
    private StringRedisTemplate stringRedisTemplate;

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
        }
        return list;
    }
}
