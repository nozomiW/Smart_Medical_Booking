package com.cly.orderservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ScheduleDetailDTO {
    private Long scheduleId;
    private LocalDate workDate;
    private Integer availableNum;
    private Integer scheduleStatus;
    private Long docId;
    private String docName;
    private String docTitle;
    private BigDecimal docFee;
    private Long deptId;
}
