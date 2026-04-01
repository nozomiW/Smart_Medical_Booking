package com.cly.doctorservice.service.impl;

import com.cly.doctorservice.dto.SpecialtyDTO;
import com.cly.doctorservice.entity.DoctorSpecialty;
import com.cly.doctorservice.entity.SpecialtyDict;
import com.cly.doctorservice.mapper.DoctorSpecialtyMapper;
import com.cly.doctorservice.mapper.SpecialtyDictMapper;
import com.cly.doctorservice.service.SpecialtyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 擅长标签服务实现
 */
@Slf4j
@Service
public class SpecialtyServiceImpl implements SpecialtyService {

    @Autowired
    private SpecialtyDictMapper specialtyDictMapper;

    @Autowired
    private DoctorSpecialtyMapper doctorSpecialtyMapper;

    @Override
    public List<SpecialtyDTO> getAllActiveSpecialties() {
        log.debug("查询所有启用的标签");
        List<SpecialtyDict> specialties = specialtyDictMapper.selectActiveSpecialties();
        return convertToDTO(specialties);
    }

    @Override
    public List<SpecialtyDTO> getSpecialtiesByCategory(String category) {
        if (!StringUtils.hasText(category)) {
            return getAllActiveSpecialties();
        }
        log.debug("按分类查询标签 - category: {}", category);
        List<SpecialtyDict> specialties = specialtyDictMapper.selectByCategory(category);
        return convertToDTO(specialties);
    }

    @Override
    public List<SpecialtyDTO> searchSpecialties(String keyword) {
        if (!StringUtils.hasText(keyword)) {
            return getAllActiveSpecialties();
        }
        log.debug("搜索标签 - keyword: {}", keyword);
        List<SpecialtyDict> specialties = specialtyDictMapper.selectByKeyword(keyword);
        return convertToDTO(specialties);
    }

    @Override
    public List<SpecialtyDTO> getDoctorSpecialties(String doctorId) {
        if (!StringUtils.hasText(doctorId)) {
            return new ArrayList<>();
        }
        log.debug("查询医生的擅长标签 - doctorId: {}", doctorId);
        List<SpecialtyDict> specialties = specialtyDictMapper.selectByDoctorId(doctorId);
        return convertToDTO(specialties);
    }

    @Override
    public List<SpecialtyDTO> getSpecialtiesByNames(List<String> names) {
        if (CollectionUtils.isEmpty(names)) {
            return new ArrayList<>();
        }
        log.debug("根据名称批量查询标签 - names: {}", names);
        List<SpecialtyDict> specialties = specialtyDictMapper.selectByNames(names);
        return convertToDTO(specialties);
    }

    @Override
    public List<String> recommendDoctorsBySymptoms(List<String> symptoms) {
        if (CollectionUtils.isEmpty(symptoms)) {
            return new ArrayList<>();
        }

        log.info("根据症状推荐医生 - symptoms: {}", symptoms);

        // 1. 查询匹配的标签 ID
        List<SpecialtyDict> matchedSpecialties = specialtyDictMapper.selectByNames(symptoms);
        if (CollectionUtils.isEmpty(matchedSpecialties)) {
            log.warn("未找到匹配的标签");
            return new ArrayList<>();
        }

        List<Long> specialtyIds = matchedSpecialties.stream()
                .map(SpecialtyDict::getId)
                .collect(Collectors.toList());

        log.info("匹配到 {} 个标签，ID 列表：{}", specialtyIds.size(), specialtyIds);

        // 2. 查询拥有这些标签的医生（至少匹配 1 个标签）
        List<String> doctorIds = doctorSpecialtyMapper.selectDoctorIdsBySpecialtyIds(
                specialtyIds, 1);

        log.info("推荐到 {} 个医生", doctorIds.size());
        return doctorIds;
    }

    /**
     * 转换为 DTO
     */
    private List<SpecialtyDTO> convertToDTO(List<SpecialtyDict> specialties) {
        if (CollectionUtils.isEmpty(specialties)) {
            return new ArrayList<>();
        }
        return specialties.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 单个实体转 DTO
     */
    private SpecialtyDTO toDTO(SpecialtyDict entity) {
        return SpecialtyDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .category(entity.getCategory())
                .sortOrder(entity.getSortOrder())
                .build();
    }
}
