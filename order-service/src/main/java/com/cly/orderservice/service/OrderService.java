package com.cly.orderservice.service;

import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.result.Result;

import java.util.List;

public interface OrderService {
    Result createOrder(String userId, String patientId, String scheduleId);

    List<OrderDetailDTO> getOrders(String userId);
    OrderDetailDTO getOrderDetail(String orderId);

    /**
     * 用户主动取消订单 - 将状态标记为 -1
     */
    Result cancelOrder(String userId, String orderId);

    /**
     * 超时自动取消未支付订单 - 将状态标记为 -1
     */
    void cancelUnpaidOrder(String orderId);
}
