package com.cly.userservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("uc_user")
public class User {

    @TableId("id")
    private String id;

    private String phone;

    private String password;

    /**
     * 账号状态：0-冻结(黑名单), 1-正常
     */
    private Integer status;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;

}
