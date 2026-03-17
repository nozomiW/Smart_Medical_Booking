package com.cly.userservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@TableName("uc_patient")
public class Patient {

    @TableId("id")
    private Long id;

    @TableField("user_id")
    private Long userId;

    private String name;

    @TableField("id_card")
    private String idCard;

    /**
     * 性别：0-女, 1-男
     */
    private Integer gender;

    @TableField("birth_date")
    private LocalDate birthDate;

    private String phone;

    @TableField("is_default")
    private Integer isDefault;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

}
