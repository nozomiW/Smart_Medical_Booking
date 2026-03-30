package com.cly.orderservice.service;

import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.result.Result;

import java.util.List;

public interface OrderService {
    Result createOrder(Long userId, Long patientId, Long scheduleId);
    
    // ========== 压力测试基线接口（已注释） ==========
    // Result createOrderDb(Long userId, Long patientId, Long scheduleId);
    // ===============================================
    
    List<OrderDetailDTO> getOrders(Long userId);
    OrderDetailDTO getOrderDetail(Long orderId);
}
