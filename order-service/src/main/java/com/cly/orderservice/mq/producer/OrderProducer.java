package com.cly.orderservice.mq.producer;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.mq.constant.MQConstant;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.apache.rocketmq.spring.support.RocketMQHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
public class OrderProducer {

    RocketMQTemplate rocketMQTemplate;

    @Autowired
    public void setRocketMQTemplate(RocketMQTemplate rocketMQTemplate) {
        this.rocketMQTemplate = rocketMQTemplate;
    }

    public SendResult produceOrderCreate(Order order, OrderItem orderItem) {
        Map<String, Object> body = new HashMap<>();
        body.put("order", order);
        body.put("orderItem", orderItem);

        Message<Map<String, Object>> message = MessageBuilder
                .withPayload(body)
                .setHeader(RocketMQHeaders.KEYS, order.getOrderNo())
                .build();

        String destination = MQConstant.Topic.ORDER_CREATE + ":" + MQConstant.Tag.CREATE;
        return rocketMQTemplate.syncSend(destination, message);
    }
}
