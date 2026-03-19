package com.cly.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.userservice.entity.Patient;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface PatientMapper extends BaseMapper<Patient> {
}
