package com.cly.doctorservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.doctorservice.entity.Doctor;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.math.BigDecimal;
import java.util.List;

@Mapper
public interface DoctorMapper extends BaseMapper<Doctor> {
    List<Doctor> selectDoctorByStatus(@Param("status") Integer status);
    int updateFeeById(@Param("id")Long id, @Param("fee")BigDecimal fee);
}
