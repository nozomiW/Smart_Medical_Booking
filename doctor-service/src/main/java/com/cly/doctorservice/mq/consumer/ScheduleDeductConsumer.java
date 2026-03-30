package com.cly.doctorservice.mq.consumer;

import com.cly.doctorservice.mapper.ScheduleMapper;
import com.cly.doctorservice.mq.constant.MQConstant;
import lombok.extern.slf4j.Slf4j;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.SCHEDULE_DEDUCT,
        consumerGroup = "hospital-doctor-deduct-group",
        selectorExpression = MQConstant.Tag.DEDUCT
)
public class ScheduleDeductConsumer implements RocketMQListener<String> {

    private ScheduleMapper scheduleMapper;

    @Autowired
    public void setScheduleMapper(ScheduleMapper scheduleMapper) {
        this.scheduleMapper = scheduleMapper;
    }

    @Override
    public void onMessage(String scheduleId) {
        int rows = scheduleMapper.decreaseAvailableNum(scheduleId);
        if (rows <= 0) {
            log.error("Critical Error: DB deduct failed for scheduleId={}. Possible over-sell in memory!", scheduleId);
        }
    }
}
