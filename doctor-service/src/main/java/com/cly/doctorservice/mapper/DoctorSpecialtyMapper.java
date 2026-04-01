package com.cly.doctorservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.doctorservice.entity.DoctorSpecialty;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 医生擅长标签关联 Mapper
 */
@Mapper
public interface DoctorSpecialtyMapper extends BaseMapper<DoctorSpecialty> {

    /**
     * 根据医生 ID 删除所有标签关联
     */
    int deleteByDocId(@Param("docId") String docId);

    /**
     * 批量插入医生标签关联
     */
    int batchInsert(@Param("list") List<DoctorSpecialty> list);

    /**
     * 查询拥有某个标签的所有医生 ID
     */
    List<String> selectDoctorIdsBySpecialtyId(@Param("specialtyId") Long specialtyId);

    /**
     * 查询拥有某些标签的医生 ID（匹配指定数量以上）
     */
    List<String> selectDoctorIdsBySpecialtyIds(@Param("specialtyIds") List<Long> specialtyIds,
                                               @Param("minMatch") int minMatch);
}
