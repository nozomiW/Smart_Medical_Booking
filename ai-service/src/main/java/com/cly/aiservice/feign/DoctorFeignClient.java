package com.cly.aiservice.feign;

import com.cly.aiservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

/**
 * 医生服务 Feign 客户端
 */
@FeignClient(name = "doctor-service")
public interface DoctorFeignClient {

    /**
     * 查询在线医生列表
     */
    @GetMapping("/doctor/search/online")
    List<DoctorDTO> searchOnline();

    /**
     * 根据排班 ID 查询排班详情
     */
    @GetMapping("/doctor/schedule/detail/id")
    ScheduleDTO getScheduleDetailById(@RequestParam String scheduleId);

    /**
     * 医生 DTO
     */
    class DoctorDTO {
        private String id;
        private String deptId;
        private String name;
        private String title;
        private Double fee;
        private Integer status;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getDeptId() { return deptId; }
        public void setDeptId(String deptId) { this.deptId = deptId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public Double getFee() { return fee; }
        public void setFee(Double fee) { this.fee = fee; }
        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
    }

    /**
     * 排班详情 DTO
     */
    class ScheduleDTO {
        private Long id;
        private String docId;
        private String doctorName;
        private String title;
        private String deptName;
        private Double fee;
        private String workDate;
        private Integer availableNum;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getDocId() { return docId; }
        public void setDocId(String docId) { this.docId = docId; }
        public String getDoctorName() { return doctorName; }
        public void setDoctorName(String doctorName) { this.doctorName = doctorName; }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDeptName() { return deptName; }
        public void setDeptName(String deptName) { this.deptName = deptName; }
        public Double getFee() { return fee; }
        public void setFee(Double fee) { this.fee = fee; }
        public String getWorkDate() { return workDate; }
        public void setWorkDate(String workDate) { this.workDate = workDate; }
        public Integer getAvailableNum() { return availableNum; }
        public void setAvailableNum(Integer availableNum) { this.availableNum = availableNum; }
    }
}
