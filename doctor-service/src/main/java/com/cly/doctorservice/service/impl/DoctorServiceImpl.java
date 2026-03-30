package com.cly.doctorservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.annotation.BusinessLog;
import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.mapper.DoctorMapper;
import com.cly.doctorservice.mq.producer.FeeProducer;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class DoctorServiceImpl implements DoctorService {

    private DoctorMapper doctorMapper;
    private StringRedisTemplate stringRedisTemplate;
    private FeeProducer feeProducer;

    @Autowired
    public void setDoctorMapper(DoctorMapper doctorMapper) {
        this.doctorMapper = doctorMapper;
    }
    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }
    @Autowired
    public void setFeeProducer(FeeProducer feeProducer) {
        this.feeProducer = feeProducer;
    }

    @Override
    @BusinessLog(value = "查询在线医生列表", type = "医生查询")
    public List<Doctor> searchOnline() {

        List<Object> doctorsOnline = stringRedisTemplate.opsForHash().values("doctor:online");
        if (!doctorsOnline.isEmpty())
            return doctorsOnline.stream().map(
                object -> (String) object).map(
                        json -> JSON.parseObject(json, Doctor.class)).collect(
                                Collectors.toList());

        List<Doctor> doctors = doctorMapper.selectDoctorByStatus(1);
        if (!doctors.isEmpty()){
            Map<String, String> doctorStream = doctors.stream().collect(Collectors.toMap(
                    d -> d.getId().toString(), JSON::toJSONString));
            stringRedisTemplate.opsForHash().putAll("doctor:online", doctorStream);
            stringRedisTemplate.expire("doctor:online", 2, TimeUnit.HOURS);
        }
        return doctors;
    }

    @Override
    @BusinessLog(value = "更新医生挂号费", type = "医生管理")
    public Result updateFee(Long id, BigDecimal fee) {
        feeProducer.produceFeeUpdate(id, fee);
        return Result.SUCCESS;
    }

    @Override
    @BusinessLog(value = "新增医生信息", type = "医生管理")
    public Result insertDoctor(Doctor doctor) {
        int rows = doctorMapper.insert(doctor);
        return rows > 0 ? Result.SUCCESS : Result.FALSE;
    }
}
