package com.cly.aiservice.feign;

import com.cly.aiservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.math.BigDecimal;
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
     * 根据医生 ID 和日期查询排班详情
     */
    @GetMapping("/doctor/schedule/detail/doctor-date")
    ScheduleDTO getScheduleDetailByDoctorAndDate(@RequestParam String doctorId, @RequestParam String workDate);

    /**
     * 按日期查询所有医生的排班详情
     */
    @GetMapping("/doctor/schedule/detail/db")
    List<ScheduleDTO> getSchedulesByDate(@RequestParam String workDate);

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
        private Long scheduleId; // 修改为 scheduleId 与后端一致
        private String docId;
        private String docName;
        private String docTitle;
        private String deptId;
        private BigDecimal docFee;
        private String workDate;
        private Integer availableNum;

        public Long getScheduleId() { return scheduleId; }
        public void setScheduleId(Long scheduleId) { this.scheduleId = scheduleId; }
        public String getDocId() { return docId; }
        public void setDocId(String docId) { this.docId = docId; }
        public String getDocName() { return docName; }
        public void setDocName(String docName) { this.docName = docName; }
        public String getDocTitle() { return docTitle; }
        public void setDocTitle(String docTitle) { this.docTitle = docTitle; }
        public String getDeptId() { return deptId; }
        public void setDeptId(String deptId) { this.deptId = deptId; }
        public BigDecimal getDocFee() { return docFee; }
        public void setDocFee(BigDecimal docFee) { this.docFee = docFee; }
        public String getWorkDate() { return workDate; }
        public void setWorkDate(String workDate) { this.workDate = workDate; }
        public Integer getAvailableNum() { return availableNum; }
        public void setAvailableNum(Integer availableNum) { this.availableNum = availableNum; }
    }
}
