package com.cly.orderservice.mq.consumer;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.mapper.OrderMapper;
import com.cly.orderservice.mq.constant.MQConstant;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.*;

@Slf4j
@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.PAY_SUCCESS,
        consumerGroup = "hospital-order-pay-group",
        selectorExpression = MQConstant.Tag.SUCCESS
)
public class PaySuccessConsumer implements RocketMQListener<String> {

    private OrderMapper orderMapper;
    private StringRedisTemplate stringRedisTemplate;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public void onMessage(String orderId) {
        // 获取订单以得到 userId
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            log.warn("订单不存在，忽略支付成功消息 - orderId: {}", orderId);
            return;
        }
        
        String userId = order.getUserId();
        String indexKey = "order:index:" + userId;
        
        // 1. 第一次删除缓存
        String redisKey = "order:detail:" + orderId;
        stringRedisTemplate.delete(redisKey);
        stringRedisTemplate.delete(indexKey);

        int rows = orderMapper.update(null, new LambdaUpdateWrapper<Order>()
                .eq(Order::getId, orderId)
                .eq(Order::getStatus, 0)
                .set(Order::getStatus, 1));

        if (rows > 0) {
            // 2. 延迟 500ms 后第二次删除（延迟双删）
            executorService.schedule(
                    () -> {
                        stringRedisTemplate.delete(redisKey);
                        stringRedisTemplate.delete(indexKey);
                    },
                    500,
                    TimeUnit.MILLISECONDS
            );
            log.info("订单支付成功 - orderId: {}", orderId);
        } else {
            log.warn("订单状态更新失败（已支付或不存在）- orderId: {}", orderId);
        }
    }
}
