package com.cly.userservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import com.cly.userservice.annotation.BusinessLog;
import com.cly.userservice.entity.Patient;
import com.cly.userservice.mapper.PatientMapper;
import com.cly.userservice.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    PatientMapper patientMapper;
    StringRedisTemplate stringRedisTemplate;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

    @Autowired
    public void setPatientMapper(PatientMapper patientMapper) {
        this.patientMapper = patientMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    @BusinessLog(value = "添加就诊人", type = "就诊人管理")
    public void insertPatient(String userId, Patient patient) {
        Long count = patientMapper.selectCount(
                new LambdaQueryWrapper<Patient>().eq(Patient::getUserId, userId));

        // 使用雪花算法生成唯一 ID，存为字符串避免前端精度丢失
        patient.setId(IdWorker.getIdStr());
        patient.setUserId(userId);
        patient.setIsDefault(count == 0 ? 1 : 0);
        patient.setCreateTime(LocalDateTime.now());
        patient.setUpdateTime(LocalDateTime.now());

        // 1. 第一次删除缓存
        String redisKey = "patient:list:" + userId;
        stringRedisTemplate.delete(redisKey);

        patientMapper.insert(patient);

        // 2. 延迟 500ms 后第二次删除缓存（延迟双删）
        executorService.schedule(
                () -> stringRedisTemplate.delete(redisKey),
                500,
                TimeUnit.MILLISECONDS
        );
    }

    @Override
    @BusinessLog(value = "查询就诊人列表", type = "就诊人管理")
    public List<Patient> getPatients(String userId) {
        String redisKey = "patient:list:" + userId;

        List<Object> cached = stringRedisTemplate.opsForHash().values(redisKey);
        if (!cached.isEmpty())
            return cached.stream()
                    .map(o -> JSON.parseObject((String) o, Patient.class))
                    .collect(Collectors.toList());

        List<Patient> list = patientMapper.selectList(
                new LambdaQueryWrapper<Patient>().eq(Patient::getUserId, userId));
        if (!list.isEmpty()) {
            Map<String, String> map = list.stream().collect(
                    Collectors.toMap(p -> p.getId(), JSON::toJSONString));
            stringRedisTemplate.opsForHash().putAll(redisKey, map);
            stringRedisTemplate.expire(redisKey, 2, TimeUnit.HOURS);
        }
        return list;
    }
}
