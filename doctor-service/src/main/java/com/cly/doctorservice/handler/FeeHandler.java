package com.cly.doctorservice.handler;

import com.cly.doctorservice.mapper.DoctorMapper;
import com.cly.doctorservice.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Component
public class FeeHandler {
    DoctorMapper doctorMapper;

    @Autowired
    public void setDoctorMapper(DoctorMapper doctorMapper) {
        this.doctorMapper = doctorMapper;
    }

    @Transactional
    public Result updateFee(Long id, BigDecimal fee) {
        int row = doctorMapper.updateFeeById(id, fee);
        if (row == 1) return Result.SUCCESS;
        return Result.FALSE;
    }
}
