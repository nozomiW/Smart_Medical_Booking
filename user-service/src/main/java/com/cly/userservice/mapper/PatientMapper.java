package com.cly.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.userservice.entity.Patient;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface PatientMapper extends BaseMapper<Patient> {

    List<Patient> selectByUserId(@Param("userId") Long userId);

    Patient selectDefaultByUserId(@Param("userId") Long userId);

    int clearDefaultByUserId(@Param("userId") Long userId);

    int setDefaultById(@Param("id") Long id);

}
