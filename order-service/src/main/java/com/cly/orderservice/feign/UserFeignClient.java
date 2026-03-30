package com.cly.orderservice.feign;

import com.cly.orderservice.dto.PatientDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;

import java.util.List;

@FeignClient(name = "user-service")
public interface UserFeignClient {

    @GetMapping("/user/patient/list")
    List<PatientDTO> getPatients(@RequestHeader("X-User-Id") String userId);
}
