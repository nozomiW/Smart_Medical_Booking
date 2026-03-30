package com.cly.orderservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("ord_order")
public class Order {

    @TableId("id")
    private String id;

    @TableField("order_no")
    private String orderNo;

    @TableField("user_id")
    private String userId;

    private BigDecimal amount;

    private Integer status;

    @TableField("create_time")
    private LocalDateTime createTime;

    @TableField("update_time")
    private LocalDateTime updateTime;
}
