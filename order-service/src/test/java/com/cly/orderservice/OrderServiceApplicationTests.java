package com.cly.orderservice;

import com.cly.orderservice.dto.DoctorDTO;
import com.cly.orderservice.dto.PatientDTO;
import com.cly.orderservice.dto.ScheduleDetailDTO;
import com.cly.orderservice.feign.DoctorFeignClient;
import com.cly.orderservice.feign.UserFeignClient;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
class OrderServiceApplicationTests {

    @Autowired
    DoctorFeignClient doctorFeignClient;

    @Autowired
    UserFeignClient userFeignClient;

    @Test
    void testSearchOnlineDoctors() {
        List<DoctorDTO> doctors = doctorFeignClient.searchOnline();
        doctors.forEach(d -> System.out.println("医生: " + d.getName() + " | 职称: " + d.getTitle() + " | 费用: " + d.getFee()));
    }

    @Test
    void testFindScheduleDetail() {
        List<ScheduleDetailDTO> list = doctorFeignClient.findScheduleDetail("2026-03-24");
        list.forEach(s -> System.out.println("排班: " + s.getWorkDate() + " | 医生: " + s.getDocName() + " | 余号: " + s.getAvailableNum()));
    }

    @Test
    void testGetPatients() {
        Long userId = 2034109869263138818L;
        List<PatientDTO> patients = userFeignClient.getPatients(userId);
        patients.forEach(p -> System.out.println("病人: " + p.getName() + " | 手机: " + p.getPhone() + " | 默认: " + p.getIsDefault()));
    }
}
