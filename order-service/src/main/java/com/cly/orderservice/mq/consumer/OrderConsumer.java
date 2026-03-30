package com.cly.orderservice.mq.consumer;

import com.alibaba.fastjson.JSON;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.handler.OrderHandler;
import com.cly.orderservice.mq.constant.MQConstant;
import com.cly.orderservice.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
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
        try {
            Order order = JSON.parseObject(JSON.toJSONString(message.get("order")), Order.class);
            OrderItem orderItem = JSON.parseObject(JSON.toJSONString(message.get("orderItem")), OrderItem.class);
                
            log.info("开始处理订单 - orderNo: {}, userId: {}, amount: {}, patient: {}", 
                    order.getOrderNo(), order.getUserId(), order.getAmount(), orderItem.getPatientName());
                
            Result result = orderHandler.createOrder(order, orderItem);
            if (result == Result.SUCCESS) {
                log.info("订单创建成功 - orderNo: {}", order.getOrderNo());
            } else {
                log.error("订单创建失败 - orderNo: {}", order.getOrderNo());
                // 返回 FALSE 也抛出异常，触发 MQ 重试
                throw new RuntimeException("订单写库返回 FALSE，触发 MQ 重试：" + order.getOrderNo());
            }
        } catch (Exception e) {
            log.error("订单创建异常 - orderNo: {}", 
                    JSON.parseObject(JSON.toJSONString(message.get("order")), Order.class).getOrderNo(), e);
            // 重新抛出异常，让 RocketMQ 触发重试，避免订单丢失
            throw new RuntimeException("订单创建失败，触发 MQ 重试", e);
        }
    }
}
