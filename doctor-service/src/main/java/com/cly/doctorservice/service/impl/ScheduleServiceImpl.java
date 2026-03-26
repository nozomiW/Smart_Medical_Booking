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
import jakarta.annotation.PostConstruct;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.redisson.api.RBloomFilter;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
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
                    "redis.call('DECR', KEYS[1])\n" +
                    "return num"; // 返回扣减前的旧值

    private static final DefaultRedisScript<Long> DEDUCT_SCRIPT =
            new DefaultRedisScript<>(DEDUCT_LUA, Long.class);

    private static final String BLOOM_KEY = "schedule:date:bloom";

    private ScheduleRuleMapper scheduleRuleMapper;
    private ScheduleMapper scheduleMapper;
    private StringRedisTemplate stringRedisTemplate;
    private RocketMQTemplate rocketMQTemplate;
    private RedissonClient redissonClient;

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

    @Autowired
    public void setRedissonClient(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    @Override
    public Result insertScheduleRule(ScheduleRule rule) {
        int rows = scheduleRuleMapper.insert(rule);
        return rows > 0 ? Result.SUCCESS : Result.FALSE;
    }

    @PostConstruct
    public void initBloomFilter() {
        RBloomFilter<String> bloomFilter = redissonClient.getBloomFilter(BLOOM_KEY);
        bloomFilter.tryInit(100_000L, 0.01);
        List<LocalDate> dates = scheduleMapper.selectAllWorkDates();
        for (LocalDate date : dates) {
            bloomFilter.add(date.toString());
        }
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
        if (rows > 0) {
            RBloomFilter<String> bloomFilter = redissonClient.getBloomFilter(BLOOM_KEY);
            toInsert.stream().map(s -> s.getWorkDate().toString()).distinct().forEach(bloomFilter::add);
            return Result.SUCCESS;
        }
        return Result.FALSE;
    }

    @Override
    public String findDetailByDate(LocalDate workDate) {
        // 0. 布隆过滤器拦截不存在的日期，防止缓存穿透
        LocalDate deadline = LocalDate.of(2026, 4, 1);
        if (workDate.isAfter(deadline)) {
            return "[]";
        }
        String redisKey = "schedule:detail:" + workDate;
        List<Object> cached = stringRedisTemplate.opsForHash().values(redisKey);
        if (!cached.isEmpty()) {
            return "[" + cached.stream().map(Object::toString).collect(Collectors.joining(",")) + "]";
        }
        String lockKey = "lock:schedule:detail:" + workDate;
        RLock lock = redissonClient.getLock(lockKey);
        try {
            if (lock.tryLock(3, 30, TimeUnit.SECONDS)) {
                // Double Check：可能前一个持锁线程刚写完缓存
                cached = stringRedisTemplate.opsForHash().values(redisKey);
                if (!cached.isEmpty()) {
                    return "[" + cached.stream().map(Object::toString).collect(Collectors.joining(",")) + "]";
                }
                List<ScheduleDetailDTO> list = scheduleMapper.findDetailByDate(workDate);
                if (!list.isEmpty()) {
                    Map<String, String> map = list.stream().collect(
                            Collectors.toMap(d -> d.getScheduleId().toString(), JSON::toJSONString));
                    stringRedisTemplate.opsForHash().putAll(redisKey, map);
                    stringRedisTemplate.expire(redisKey, 2, TimeUnit.HOURS);
                    for (ScheduleDetailDTO d : list) {
                        String numKey = "schedule:num:" + d.getScheduleId();
                        if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
                            stringRedisTemplate.opsForValue().set(numKey,
                                    String.valueOf(d.getAvailableNum()), 2, TimeUnit.HOURS);
                        }
                    }
                    return JSON.toJSONString(list);
                }
                return "[]";
            } else {
                // 未抢到锁，等锁释放后缓存已就绪，直接读缓存
                cached = stringRedisTemplate.opsForHash().values(redisKey);
                return cached.isEmpty() ? "[]"
                        : "[" + cached.stream().map(Object::toString).collect(Collectors.joining(",")) + "]";
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("查询排班被中断");
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }

    @Override
    public List<ScheduleDetailDTO> findDetailByDateDb(LocalDate workDate) {
        return scheduleMapper.findDetailByDate(workDate);
    }

    @Override
    public ScheduleDetailDTO findDetailById(Long scheduleId) {
        String redisKey = "schedule:detail:id:" + scheduleId;
        String cached = stringRedisTemplate.opsForValue().get(redisKey);
        ScheduleDetailDTO detail;

        if (cached != null) {
            detail = JSON.parseObject(cached, ScheduleDetailDTO.class);
        } else {
            detail = scheduleMapper.findDetailById(scheduleId);
            if (detail != null) {
                stringRedisTemplate.opsForValue().set(redisKey, JSON.toJSONString(detail), 2, TimeUnit.HOURS);
                // 确保实时库存 Key 存在
                String numKey = "schedule:num:" + scheduleId;
                stringRedisTemplate.opsForValue().setIfAbsent(numKey,
                        String.valueOf(detail.getAvailableNum()), 2, TimeUnit.HOURS);
            }
        }

        // 【核心步骤：合并实时库存】
        if (detail != null) {
            String numKey = "schedule:num:" + scheduleId;
            String realNum = stringRedisTemplate.opsForValue().get(numKey);
            if (realNum != null) {
                detail.setAvailableNum(Integer.parseInt(realNum));
            }
        }
        return detail;
    }

    @Override
    public Result deductAvailableNum(Long scheduleId) {
        String numKey = "schedule:num:" + scheduleId;

        // 若 Redis 中无号源缓存，先从 DB 加载
        if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
            String lockKey = "lock:schedule:num:" + scheduleId;
            RLock lock = redissonClient.getLock(lockKey);
            try {
                if (lock.tryLock(5, 10, TimeUnit.SECONDS)) {
                    if (!Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
                        ScheduleDetailDTO detail = scheduleMapper.findDetailById(scheduleId);
                        if (detail == null) return Result.FALSE;
                        stringRedisTemplate.opsForValue().set(numKey,
                                String.valueOf(detail.getAvailableNum()), 2, TimeUnit.HOURS);
                    }
                }
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } finally {
                if (lock.isHeldByCurrentThread()) lock.unlock();
            }
        }

        // 1. Lua 原子预扣
        Long oldVal = stringRedisTemplate.execute(DEDUCT_SCRIPT, Collections.singletonList(numKey));
        if (oldVal == null || oldVal <= 0) return Result.FALSE;

        // 2. 发 MQ 异步扣减 DB
        rocketMQTemplate.syncSend(MQConstant.Topic.SCHEDULE_DEDUCT + ":" + MQConstant.Tag.DEDUCT, scheduleId);

        // 注意：由于查询时会动态读取实时库存 Key，这里不再需要更新详情缓存
        return Result.SUCCESS;
    }

    @Override
    public Result deductAvailableNumDb(Long scheduleId) {
        int rows = scheduleMapper.decreaseAvailableNum(scheduleId);
        return rows > 0 ? Result.SUCCESS : Result.FALSE;
    }

    @Override
    public Result releaseAvailableNum(Long scheduleId, int num) {
        String numKey = "schedule:num:" + scheduleId;

        // 1. 更新 DB
        int rows = scheduleMapper.increaseAvailableNum(scheduleId, num);
        if (rows <= 0) return Result.FALSE;

        // 2. 更新 Redis 实时库存
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
            stringRedisTemplate.opsForValue().increment(numKey, num);
        }

        // 注意：由于查询时动态合并，无需操作详情缓存
        return Result.SUCCESS;
    }
}