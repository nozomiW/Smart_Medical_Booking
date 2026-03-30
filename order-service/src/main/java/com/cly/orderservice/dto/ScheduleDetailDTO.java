package com.cly.orderservice.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ScheduleDetailDTO {
    private String scheduleId;
    private LocalDate workDate;
    private Integer availableNum;
    private Integer scheduleStatus;
    private String docId;
    private String docName;
    private String docTitle;
    private BigDecimal docFee;
    private String deptId;
}
