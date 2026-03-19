package com.cly.doctorservice.handler;

import com.cly.doctorservice.mapper.DoctorMapper;
import com.cly.doctorservice.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.concurrent.*;

@Component
public class FeeHandler {

    DoctorMapper doctorMapper;
    StringRedisTemplate stringRedisTemplate;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

    @Autowired
    public void setDoctorMapper(DoctorMapper doctorMapper) {
        this.doctorMapper = doctorMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Transactional
    public Result updateFee(Long id, BigDecimal fee) {
        // 第一次删除缓存
        stringRedisTemplate.opsForHash().delete("doctor:online", id.toString());

        int row = doctorMapper.updateFeeById(id, fee);
        if (row != 1) return Result.FALSE;

        // 延迟双删：500ms 后再删一次，防止并发读写导致脏数据回填
        executorService.schedule(
                () -> stringRedisTemplate.opsForHash().delete("doctor:online", id.toString()),
                500,
                TimeUnit.MILLISECONDS
        );
        return Result.SUCCESS;
    }
}
