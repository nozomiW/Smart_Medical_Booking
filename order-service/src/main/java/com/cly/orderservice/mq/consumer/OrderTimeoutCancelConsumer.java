package com.cly.orderservice.mq.consumer;

import com.cly.orderservice.service.OrderService;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

/**
 * 订单超时取消消费者
 */
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
        Long orderId = (Long) message.get("orderId");
        String orderNo = (String) message.get("orderNo");
        
        System.out.println("\n========== 订单超时取消消息 ==========");
        System.out.println("时间：" + java.time.LocalDateTime.now());
        System.out.println("orderId: " + orderId);
        System.out.println("orderNo: " + orderNo);
        
        try {
            // 检查订单支付状态，如果未支付则取消订单
            orderService.cancelUnpaidOrder(orderId);
            System.out.println("订单已取消（未支付）\n");
        } catch (Exception e) {
            System.err.println("取消订单失败：" + e.getMessage());
            e.printStackTrace();
        }
        
        System.out.println("=====================================\n");
    }
}
