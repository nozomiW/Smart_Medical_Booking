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
        try {
            Order order = JSON.parseObject(JSON.toJSONString(message.get("order")), Order.class);
            OrderItem orderItem = JSON.parseObject(JSON.toJSONString(message.get("orderItem")), OrderItem.class);
                
            System.out.println("\n[订单消费者] 开始处理订单...");
            System.out.println("  - 订单号：" + order.getOrderNo());
            System.out.println("  - 订单 ID: " + order.getId());
            System.out.println("  - 用户 ID: " + order.getUserId());
            System.out.println("  - 金额：" + order.getAmount());
            System.out.println("  - 就诊人：" + orderItem.getPatientName());
            System.out.println("  - 排班 ID: " + orderItem.getScheduleId());
                
            Result result = orderHandler.createOrder(order, orderItem);
            if (result == Result.SUCCESS) {
                System.out.println("[订单消费者] ✓ 订单创建成功：" + order.getOrderNo());
            } else {
                System.err.println("[订单消费者] ✗ 订单创建失败：" + order.getOrderNo());
                // 返回 FALSE 也抛出异常，触发 MQ 重试
                throw new RuntimeException("订单写库返回 FALSE，触发 MQ 重试: " + order.getOrderNo());
            }
        } catch (Exception e) {
            System.err.println("\n========== [订单消费者] 订单创建异常 ==========");
            System.err.println("时间：" + java.time.LocalDateTime.now());
            System.err.println("异常类型：" + e.getClass().getName());
            System.err.println("异常信息：" + e.getMessage());
            System.err.println("==========================================\n");
            e.printStackTrace();
            // 重新抛出异常，让 RocketMQ 触发重试，避免订单丢失
            throw new RuntimeException("订单创建失败，触发 MQ 重试", e);
        }
    }
}
