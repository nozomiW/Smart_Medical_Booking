package com.cly.doctorservice.mq.producer;


import com.cly.doctorservice.mq.constant.MQConstant;
import com.cly.doctorservice.result.Result;
import org.apache.rocketmq.client.producer.SendResult;
import org.apache.rocketmq.spring.core.RocketMQTemplate;
import org.apache.rocketmq.spring.support.RocketMQHeaders;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.Message;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class FeeProducer {
    RocketMQTemplate rocketMQTemplate;
    @Autowired
    public void setRocketMQTemplate(RocketMQTemplate rocketMQTemplate) {
        this.rocketMQTemplate = rocketMQTemplate;
    }


    public SendResult produceFeeUpdate(Long doctorId, BigDecimal fee) {
        String tag = "UPDATE";

        Map<String, Object> body = new HashMap<>();
        body.put("id", doctorId);
        body.put("fee", fee);

        Message<Map<String, Object>> message = MessageBuilder
                .withPayload(body)
                .setHeader(RocketMQHeaders.KEYS, doctorId.toString())
                .build();
        String destination = MQConstant.Topic.DOCTOR_FEE + ":" + MQConstant.Tag.UPDATE;
        return rocketMQTemplate.syncSend(destination, message);
    }

}
