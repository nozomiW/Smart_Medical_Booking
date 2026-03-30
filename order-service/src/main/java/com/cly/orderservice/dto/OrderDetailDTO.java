package com.cly.orderservice.dto;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import lombok.Data;

@Data
public class OrderDetailDTO {
    private Order order;
    private OrderItem orderItem;
    
    /**
     * 实时号源数量（从 Redis 获取）
     */
    private Integer availableNum;
}
