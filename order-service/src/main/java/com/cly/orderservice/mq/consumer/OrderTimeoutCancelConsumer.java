package com.cly.orderservice.mq.consumer;

import com.cly.orderservice.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Slf4j
@Component
@RocketMQMessageListener(
    topic = "ORDER_TIMEOUT_CANCEL_TOPIC",
    consumerGroup = "order-timeout-cancel-group",
    selectorExpression = "CANCEL"
)
public class OrderTimeoutCancelConsumer implements RocketMQListener<Map<String, Object>> {

    @Autowired
    private OrderService orderService;

    @Override
    public void onMessage(Map<String, Object> message) {
        String orderId = (String) message.get("orderId");
        String orderNo = (String) message.get("orderNo");
        
        log.info("收到订单超时取消消息 - orderId: {}, orderNo: {}", orderId, orderNo);
        
        try {
            // 检查订单支付状态，如果未支付则取消订单
            orderService.cancelUnpaidOrder(orderId);
            log.info("订单已取消（未支付）- orderId: {}", orderId);
        } catch (Exception e) {
            log.error("取消订单失败 - orderId: {}", orderId, e);
        }
    }
}
