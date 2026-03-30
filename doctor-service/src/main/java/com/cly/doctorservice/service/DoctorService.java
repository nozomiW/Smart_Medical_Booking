package com.cly.doctorservice.service;

import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.result.Result;

import java.math.BigDecimal;
import java.util.List;


public interface DoctorService {

    List<Doctor> searchOnline();
    Result updateFee(String id, BigDecimal fee);
    Result insertDoctor(Doctor doctor);

}