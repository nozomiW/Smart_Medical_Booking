package com.cly.payservice.mq.producer;

import com.cly.payservice.mq.constant.MQConstant;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.apache.rocketmq.spring.support.RocketMQHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

@Component
public class PayProducer {

    private RocketMQTemplate rocketMQTemplate;

    @Autowired
    public void setRocketMQTemplate(RocketMQTemplate rocketMQTemplate) {
        this.rocketMQTemplate = rocketMQTemplate;
    }

    public SendResult producePaySuccess(Long orderId) {
        Message<Long> message = MessageBuilder
                .withPayload(orderId)
                .setHeader(RocketMQHeaders.KEYS, orderId.toString())
                .build();
        return rocketMQTemplate.syncSend(
                MQConstant.Topic.PAY_SUCCESS + ":" + MQConstant.Tag.SUCCESS,
                message);
    }
}
