package com.cly.doctorservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.math.BigDecimal;

@Data
@TableName("yy_doctor")
public class Doctor {

    @TableId("id")
    private Long id;

    @TableField("dept_id")
    private Long deptId;

    private String name;

    private String title;

    private BigDecimal fee;

    private Integer status;

}
