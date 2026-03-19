package com.cly.orderservice.service;

import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.result.Result;

import java.util.List;

public interface OrderService {
    Result createOrder(Long userId, Long patientId, Long scheduleId, String workDate);
    List<Order> getOrders(Long userId);
    OrderDetailDTO getOrderDetail(Long orderId);
}
