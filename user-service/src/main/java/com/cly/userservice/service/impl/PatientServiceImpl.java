package com.cly.userservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cly.userservice.entity.Patient;
import com.cly.userservice.mapper.PatientMapper;
import com.cly.userservice.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class PatientServiceImpl implements PatientService {

    PatientMapper patientMapper;
    StringRedisTemplate stringRedisTemplate;

    @Autowired
    public void setPatientMapper(PatientMapper patientMapper) {
        this.patientMapper = patientMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public void insertPatient(Long userId, Patient patient) {
        Long count = patientMapper.selectCount(
                new LambdaQueryWrapper<Patient>().eq(Patient::getUserId, userId));

        patient.setId(ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE));
        patient.setUserId(userId);
        patient.setIsDefault(count == 0 ? 1 : 0);
        patient.setCreateTime(LocalDateTime.now());
        patient.setUpdateTime(LocalDateTime.now());

        patientMapper.insert(patient);

        // 插入后使缓存失效，下次查询重建
        stringRedisTemplate.delete("patient:list:" + userId);
    }

    @Override
    public List<Patient> getPatients(Long userId) {
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
                    Collectors.toMap(p -> p.getId().toString(), JSON::toJSONString));
            stringRedisTemplate.opsForHash().putAll(redisKey, map);
            stringRedisTemplate.expire(redisKey, 2, TimeUnit.HOURS);
        }
        return list;
    }
}
