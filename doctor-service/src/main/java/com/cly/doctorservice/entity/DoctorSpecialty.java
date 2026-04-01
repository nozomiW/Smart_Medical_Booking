package com.cly.doctorservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 医生擅长标签关联表
 */
@Data
@TableName("yy_doctor_specialty")
public class DoctorSpecialty {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String docId;

    private Long specialtyId;

    private LocalDateTime createTime;
}
