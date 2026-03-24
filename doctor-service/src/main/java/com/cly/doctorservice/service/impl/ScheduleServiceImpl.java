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
import java.util.concurrent.ScheduledExecutorService;
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

    private ScheduleRuleMapper scheduleRuleMapper;
    private ScheduleMapper scheduleMapper;
    private StringRedisTemplate stringRedisTemplate;
    private RocketMQTemplate rocketMQTemplate;
    private RedissonClient redissonClient;
    private ScheduledExecutorService scheduledExecutorService;

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

    @Autowired
    public void setScheduledExecutorService(ScheduledExecutorService scheduledExecutorService) {
        this.scheduledExecutorService = scheduledExecutorService;
    }

    /**
     * 清除详情缓存，用于双删
     */
    private void clearDetailCache(Long scheduleId, LocalDate workDate) {
        // 1. 清除单个详情缓存
        stringRedisTemplate.delete("schedule:detail:id:" + scheduleId);
        // 2. 清除按日期查询的 Hash 缓存（整个删除，确保一致性）
        if (workDate != null) {
            stringRedisTemplate.delete("schedule:detail:" + workDate);
        }
    }

    @Override
    public Result insertScheduleRule(ScheduleRule rule) {
        // ... (rest of the methods remain unchanged except deductAvailableNum and releaseAvailableNum)
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
    public String findDetailByDate(LocalDate workDate) {
        String redisKey = "schedule:detail:" + workDate;

        // 1. 尝试从缓存获取
        List<Object> cached = stringRedisTemplate.opsForHash().values(redisKey);
        if (!cached.isEmpty()) {
            return "[" + cached.stream().map(Object::toString).collect(Collectors.joining(",")) + "]";
        }

        // 2. 缓存失效，尝试获取分布式锁
        String lockKey = "lock:schedule:detail:" + workDate;
        RLock lock = redissonClient.getLock(lockKey);
        try {
            // 最多等待 5 秒，加锁后 10 秒自动解锁
            if (lock.tryLock(5, 10, TimeUnit.SECONDS)) {
                // 3. 二次检查缓存
                cached = stringRedisTemplate.opsForHash().values(redisKey);
                if (!cached.isEmpty()) {
                    return "[" + cached.stream().map(Object::toString).collect(Collectors.joining(",")) + "]";
                }

                // 4. 查询数据库并回写缓存
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
                    return JSON.toJSONString(list);
                }
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }

        return "[]";
    }

    @Override
    public List<ScheduleDetailDTO> findDetailByDateDb(LocalDate workDate) {
        return scheduleMapper.findDetailByDate(workDate);
    }

    @Override
    public ScheduleDetailDTO findDetailById(Long scheduleId) {
        String redisKey = "schedule:detail:id:" + scheduleId;
        String cached = stringRedisTemplate.opsForValue().get(redisKey);
        if (cached != null) {
            return JSON.parseObject(cached, ScheduleDetailDTO.class);
        }

        ScheduleDetailDTO detail = scheduleMapper.findDetailById(scheduleId);
        if (detail != null) {
            stringRedisTemplate.opsForValue().set(redisKey, JSON.toJSONString(detail), 2, TimeUnit.HOURS);
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
                if (lock.isHeldByCurrentThread()) {
                    lock.unlock();
                }
            }
        }

        // Lua 原子预扣，返回扣减前的旧值
        Long oldVal = stringRedisTemplate.execute(
                DEDUCT_SCRIPT,
                Collections.singletonList(numKey));

        if (oldVal == null || oldVal <= 0) return Result.FALSE;

        // 获取日期信息用于双删
        ScheduleDetailDTO detail = findDetailById(scheduleId);
        LocalDate workDate = detail != null ? detail.getWorkDate() : null;

        // 1. 第一次删除缓存
        clearDetailCache(scheduleId, workDate);

        // 2. 发 MQ 异步扣减 DB
        rocketMQTemplate.syncSend(
                MQConstant.Topic.SCHEDULE_DEDUCT + ":" + MQConstant.Tag.DEDUCT,
                scheduleId);

        // 3. 延迟第二次删除（使用线程池延迟 500ms）
        scheduledExecutorService.schedule(() -> clearDetailCache(scheduleId, workDate),
                500, TimeUnit.MILLISECONDS);

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

        // 获取日期信息用于双删
        ScheduleDetailDTO detail = findDetailById(scheduleId);
        LocalDate workDate = detail != null ? detail.getWorkDate() : null;

        // 1. 第一次删除缓存
        clearDetailCache(scheduleId, workDate);

        // 2. 更新 DB
        int rows = scheduleMapper.increaseAvailableNum(scheduleId, num);
        if (rows <= 0) {
            return Result.FALSE;
        }

        // 3. 更新 Redis 计数
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(numKey))) {
            stringRedisTemplate.opsForValue().increment(numKey, num);
        }

        // 4. 延迟第二次删除
        scheduledExecutorService.schedule(() -> clearDetailCache(scheduleId, workDate),
                500, TimeUnit.MILLISECONDS);

        return Result.SUCCESS;
    }
}
