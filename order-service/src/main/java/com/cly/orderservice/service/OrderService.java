package com.cly.orderservice.service;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.result.Result;

public interface OrderService {
    Result createOrder(Order order, OrderItem orderItem);
}
