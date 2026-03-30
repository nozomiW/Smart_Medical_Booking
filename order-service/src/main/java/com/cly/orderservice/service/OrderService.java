package com.cly.orderservice.service;

import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.result.Result;

import java.util.List;

public interface OrderService {
    Result createOrder(Long userId, Long patientId, Long scheduleId);

    List<OrderDetailDTO> getOrders(Long userId);
    OrderDetailDTO getOrderDetail(Long orderId);

    /**
     * 用户主动取消订单 - 将状态标记为 -1
     * @param userId   当前用户 ID（用于权限校验）
     * @param orderId  订单 ID
     */
    Result cancelOrder(Long userId, Long orderId);

    /**
     * 超时自动取消未支付订单 - 将状态标记为 -1
     * @param orderId 订单 ID
     */
    void cancelUnpaidOrder(Long orderId);
}
