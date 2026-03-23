package com.cly.orderservice.feign;

import com.cly.orderservice.dto.DoctorDTO;
import com.cly.orderservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "doctor-service")
public interface DoctorFeignClient {

    @GetMapping("/doctor/search/online")
    List<DoctorDTO> searchOnline();

    @GetMapping("/doctor/schedule/detail")
    String findScheduleDetail(@RequestParam("workDate") String workDate);

    @GetMapping("/doctor/schedule/detail/id")
    com.cly.orderservice.dto.ScheduleDetailDTO findScheduleDetailById(@RequestParam("scheduleId") Long scheduleId);

    @PostMapping("/doctor/schedule/deduct")
    Result deductAvailableNum(@RequestParam("scheduleId") Long scheduleId);

    @PostMapping("/doctor/schedule/deduct/db")
    Result deductAvailableNumDb(@RequestParam("scheduleId") Long scheduleId);
}
