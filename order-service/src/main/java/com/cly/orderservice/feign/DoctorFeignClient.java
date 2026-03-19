package com.cly.orderservice.feign;

import com.cly.orderservice.dto.DoctorDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(name = "doctor-service")
public interface DoctorFeignClient {

    @GetMapping("/doctor/search/online")
    List<DoctorDTO> searchOnline();

    @GetMapping("/doctor/schedule/detail")
    List<com.cly.orderservice.dto.ScheduleDetailDTO> findScheduleDetail(@RequestParam("workDate") String workDate);
}
