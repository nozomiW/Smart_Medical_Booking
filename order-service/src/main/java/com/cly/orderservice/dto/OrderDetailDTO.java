package com.cly.orderservice.dto;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import lombok.Data;

@Data
public class OrderDetailDTO {
    private Order order;
    private OrderItem orderItem;
}
