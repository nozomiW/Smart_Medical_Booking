package com.cly.orderservice.service.impl;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.mq.producer.OrderProducer;
import com.cly.orderservice.result.Result;
import com.cly.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class OrderServiceImpl implements OrderService {

    OrderProducer orderProducer;

    @Autowired
    public void setOrderProducer(OrderProducer orderProducer) {
        this.orderProducer = orderProducer;
    }

    @Override
    public Result createOrder(Order order, OrderItem orderItem) {
        orderProducer.produceOrderCreate(order, orderItem);
        return Result.SUCCESS;
    }
}
