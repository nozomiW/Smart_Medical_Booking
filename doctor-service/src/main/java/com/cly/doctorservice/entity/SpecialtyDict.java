package com.cly.doctorservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * 擅长标签字典表
 */
@Data
@TableName("yy_specialty_dict")
public class SpecialtyDict {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String name;

    private String category;

    private Integer sortOrder;

    private Integer isActive;

    private LocalDateTime createTime;

    private LocalDateTime updateTime;
}
