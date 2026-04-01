package com.cly.doctorservice.service;

import com.cly.doctorservice.dto.SpecialtyDTO;

import java.util.List;

/**
 * 擅长标签服务
 */
public interface SpecialtyService {

    /**
     * 获取所有启用的标签
     */
    List<SpecialtyDTO> getAllActiveSpecialties();

    /**
     * 按分类获取标签
     */
    List<SpecialtyDTO> getSpecialtiesByCategory(String category);

    /**
     * 搜索标签
     */
    List<SpecialtyDTO> searchSpecialties(String keyword);

    /**
     * 获取医生的擅长标签列表
     */
    List<SpecialtyDTO> getDoctorSpecialties(String doctorId);

    /**
     * 根据标签名称查询（支持批量）
     */
    List<SpecialtyDTO> getSpecialtiesByNames(List<String> names);

    /**
     * 根据症状推荐医生 ID 列表（匹配标签越多的越靠前）
     */
    List<String> recommendDoctorsBySymptoms(List<String> symptoms);
}
