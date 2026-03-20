package com.cly.orderservice.mq.consumer;

import com.baomidou.mybatisplus.core.conditions.update.LambdaUpdateWrapper;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.mapper.OrderMapper;
import com.cly.orderservice.mq.constant.MQConstant;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.*;

@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.PAY_SUCCESS,
        consumerGroup = "hospital-order-pay-group",
        selectorExpression = MQConstant.Tag.SUCCESS
)
public class PaySuccessConsumer implements RocketMQListener<Long> {

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
    public void onMessage(Long orderId) {
        // 1. 第一次删除缓存
        String redisKey = "order:detail:" + orderId;
        stringRedisTemplate.delete(redisKey);

        int rows = orderMapper.update(null, new LambdaUpdateWrapper<Order>()
                .eq(Order::getId, orderId)
                .eq(Order::getStatus, 0)
                .set(Order::getStatus, 1));

        if (rows > 0) {
            // 2. 延迟 500ms 后第二次删除（延迟双删）
            executorService.schedule(
                    () -> stringRedisTemplate.delete(redisKey),
                    500,
                    TimeUnit.MILLISECONDS
            );
            System.out.println("订单" + orderId + "支付成功");
        } else {
            System.out.println("订单" + orderId + "状态更新失败（已支付或不存在）");
        }
    }
}
