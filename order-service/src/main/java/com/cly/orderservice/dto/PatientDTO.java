package com.cly.orderservice.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PatientDTO {
    private Long id;
    private Long userId;
    private String name;
    private String idCard;
    private Integer gender;
    private LocalDate birthDate;
    private String phone;
    private Integer isDefault;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
}
