package com.cly.doctorservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ScheduleDetailDTO {

    // 排班信息
    private String scheduleId;
    private LocalDate workDate;
    private Integer availableNum;
    private Integer scheduleStatus;

    // 医生信息
    private String docId;
    private String docName;
    private String docTitle;
    private BigDecimal docFee;
    private String deptId;

}
