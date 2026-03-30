package com.cly.doctorservice.mq.consumer;

import com.cly.doctorservice.handler.FeeHandler;
import com.cly.doctorservice.mq.constant.MQConstant;
import com.cly.doctorservice.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;

@Slf4j
@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.DOCTOR_FEE,
        consumerGroup = "hospital-doctor-group",
        selectorExpression = MQConstant.Tag.UPDATE
)
public class FeeConsumer implements RocketMQListener<Map<String, Object>> {
    FeeHandler feeHandler;
    @Autowired
    public void setFeeHandler(FeeHandler feeHandler) {
        this.feeHandler = feeHandler;
    }

    @Override
    public void onMessage(Map<String, Object> message) {
        String id = message.get("id").toString();
        BigDecimal fee = new BigDecimal(message.get("fee").toString());
        Result result = feeHandler.updateFee(id, fee);
        if (result == Result.SUCCESS) {
            log.info("医生费用修改成功 - doctorId: {}, fee: {}", id, fee);
        }
    }
}
