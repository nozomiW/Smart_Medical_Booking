package com.cly.orderservice.mq.consumer;

import com.alibaba.fastjson.JSON;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.handler.OrderHandler;
import com.cly.orderservice.mq.constant.MQConstant;
import com.cly.orderservice.result.Result;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.ORDER_CREATE,
        consumerGroup = "hospital-order-group",
        selectorExpression = MQConstant.Tag.CREATE
)
public class OrderConsumer implements RocketMQListener<Map<String, Object>> {

    OrderHandler orderHandler;

    @Autowired
    public void setOrderHandler(OrderHandler orderHandler) {
        this.orderHandler = orderHandler;
    }

    @Override
    public void onMessage(Map<String, Object> message) {
        Order order = JSON.parseObject(JSON.toJSONString(message.get("order")), Order.class);
        OrderItem orderItem = JSON.parseObject(JSON.toJSONString(message.get("orderItem")), OrderItem.class);
        Result result = orderHandler.createOrder(order, orderItem);
        if (result == Result.SUCCESS) System.out.println("订单创建成功: " + order.getOrderNo());
    }
}
