package com.cly.orderservice.mq.consumer;

import com.cly.orderservice.mq.constant.MQConstant;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.ORDER_CACHE_DELETE,
        consumerGroup = "hospital-order-group",
        selectorExpression = MQConstant.Tag.DELETE_LATER
)
public class OrderCacheDeleteConsumer implements RocketMQListener<String> {

    StringRedisTemplate stringRedisTemplate;

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public void onMessage(String key) {
        System.out.println("执行延迟缓存删除，key: " + key);
        stringRedisTemplate.delete(key);
    }
}
