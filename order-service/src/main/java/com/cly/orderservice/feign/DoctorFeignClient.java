package com.cly.orderservice.feign;

import com.cly.orderservice.dto.ScheduleDetailDTO;
import com.cly.orderservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "doctor-service")
public interface DoctorFeignClient {

    @GetMapping("/doctor/schedule/detail")
    String findScheduleDetail(@RequestParam("workDate") String workDate);

    @GetMapping("/doctor/schedule/detail/id")
    ScheduleDetailDTO findScheduleDetailById(@RequestParam("scheduleId") String scheduleId);

    @PostMapping("/doctor/schedule/deduct")
    Result deductAvailableNum(@RequestParam("scheduleId") String scheduleId);

    @PostMapping("/doctor/schedule/release")
    Result releaseAvailableNum(@RequestParam("scheduleId") String scheduleId, @RequestParam("num") int num);
}
