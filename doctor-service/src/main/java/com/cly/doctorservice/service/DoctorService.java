package com.cly.doctorservice.service;

import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.result.Result;

import java.math.BigDecimal;
import java.util.List;


public interface DoctorService {

    public List<Doctor> searchOnline();
    public Result updateFee(Long id, BigDecimal fee);

}