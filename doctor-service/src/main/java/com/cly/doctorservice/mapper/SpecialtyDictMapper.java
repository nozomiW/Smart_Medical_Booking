package com.cly.doctorservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.doctorservice.entity.SpecialtyDict;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 擅长标签字典 Mapper
 */
@Mapper
public interface SpecialtyDictMapper extends BaseMapper<SpecialtyDict> {

    /**
     * 查询所有启用的标签
     */
    List<SpecialtyDict> selectActiveSpecialties();

    /**
     * 按分类查询标签
     */
    List<SpecialtyDict> selectByCategory(@Param("category") String category);

    /**
     * 模糊搜索标签
     */
    List<SpecialtyDict> selectByKeyword(@Param("keyword") String keyword);

    /**
     * 查询医生擅长的所有标签
     */
    List<SpecialtyDict> selectByDoctorId(@Param("docId") String docId);

    /**
     * 根据标签名称批量查询
     */
    List<SpecialtyDict> selectByNames(@Param("names") List<String> names);
}
