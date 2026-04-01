package com.cly.doctorservice.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

/**
 * 擅长标签 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SpecialtyDTO {

    private Long id;

    private String name;

    private String category;

    private Integer sortOrder;
}
