package com.cly.orderservice.handler;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.mapper.OrderItemMapper;
import com.cly.orderservice.mapper.OrderMapper;
import com.cly.orderservice.result.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
public class OrderHandler {

    OrderMapper orderMapper;
    OrderItemMapper orderItemMapper;

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Autowired
    public void setOrderItemMapper(OrderItemMapper orderItemMapper) {
        this.orderItemMapper = orderItemMapper;
    }

    @Transactional
    public Result createOrder(Order order, OrderItem orderItem) {
        int row = orderMapper.insert(order);
        if (row != 1) return Result.FALSE;
        orderItem.setOrderId(order.getId());
        int itemRow = orderItemMapper.insert(orderItem);
        if (itemRow != 1) return Result.FALSE;
        return Result.SUCCESS;
    }
}
