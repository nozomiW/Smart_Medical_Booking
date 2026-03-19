package com.cly.orderservice.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DoctorDTO {
    private Long id;
    private Long deptId;
    private String name;
    private String title;
    private BigDecimal fee;
    private Integer status;
}
