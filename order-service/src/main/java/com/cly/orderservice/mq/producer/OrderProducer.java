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
        try {
            // 组装消息体
            Map<String, Object> body = new HashMap<>();
            body.put("order", order);
            body.put("orderItem", orderItem);

            Message<Map<String, Object>> message = MessageBuilder
                    .withPayload(body)
                    .setHeader(RocketMQHeaders.KEYS, order.getOrderNo())
                    .build();

            String destination = MQConstant.Topic.ORDER_CREATE + ":" + MQConstant.Tag.CREATE;
            SendResult result = rocketMQTemplate.syncSend(destination, message);
            
            // 打印发送成功日志
            System.out.println("\n[订单 Producer] ✓ 订单消息发送成功");
            System.out.println("  - 订单号：" + order.getOrderNo());
            System.out.println("  - Topic: " + MQConstant.Topic.ORDER_CREATE);
            System.out.println("  - Tag: " + MQConstant.Tag.CREATE);
            System.out.println("  - MessageId: " + result.getMsgId());
            System.out.println("  - SendStatus: " + result.getSendStatus());
            System.out.println("====================================\n");
            
            return result;
        } catch (Exception e) {
            System.err.println("\n========== [订单 Producer] 消息发送失败 ==========");
            System.err.println("订单号：" + order.getOrderNo());
            System.err.println("异常：" + e.getClass().getName());
            System.err.println("信息：" + e.getMessage());
            System.err.println("=================================================\n");
            e.printStackTrace();
            throw e;
        }
    }

    public void produceOrderCacheDelete(String key) {
        Message<String> message = MessageBuilder
                .withPayload(key)
                .build();
        String destination = MQConstant.Topic.ORDER_CACHE_DELETE + ":" + MQConstant.Tag.DELETE_LATER;
        // Delay level 1 = 1s
        rocketMQTemplate.syncSend(destination, message, 3000, 1);
    }
    
    /**
     * 发送订单超时取消延迟消息（30 分钟）
     */
    public void produceOrderTimeoutCancel(String orderId, String orderNo) {
        Map<String, Object> body = new HashMap<>();
        body.put("orderId", orderId);
        body.put("orderNo", orderNo);

        Message<Map<String, Object>> message = MessageBuilder
                .withPayload(body)
                .setHeader(RocketMQHeaders.KEYS, orderNo)
                .build();

        String destination = MQConstant.Topic.ORDER_TIMEOUT_CANCEL + ":" + MQConstant.Tag.CANCEL;
        // Delay level 16 = 30 分钟
        rocketMQTemplate.syncSend(destination, message, 3000, 16);

        System.out.println("\n[发送延迟消息] 订单超时取消");
        System.out.println("  - orderId: " + orderId);
        System.out.println("  - orderNo: " + orderNo);
        System.out.println("  - 延迟时间：30 分钟\n");
    }
}
