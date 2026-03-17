package com.cly.doctorservice.controller;

import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("doctor")
public class DoctorController {

    private DoctorService doctorService;

    @Autowired
    public void setDoctorService(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @GetMapping("search/online")
    public List<Doctor> searchDoctorsOnline() {
        return doctorService.searchOnline();
    }

    @PostMapping("update/fee")
    public Result updateDoctorFee(@RequestParam Long doctorId, @RequestParam BigDecimal fee) {
        return doctorService.updateFee(doctorId, fee);
    }

}
