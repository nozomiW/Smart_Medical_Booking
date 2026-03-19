package com.cly.doctorservice.mq.consumer;

import com.cly.doctorservice.event.ScheduleDeductedEvent;
import com.cly.doctorservice.mapper.ScheduleMapper;
import com.cly.doctorservice.mq.constant.MQConstant;
import org.apache.rocketmq.spring.annotation.RocketMQMessageListener;
import org.apache.rocketmq.spring.core.RocketMQListener;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
@RocketMQMessageListener(
        topic = MQConstant.Topic.SCHEDULE_DEDUCT,
        consumerGroup = "hospital-doctor-deduct-group",
        selectorExpression = MQConstant.Tag.DEDUCT
)
public class ScheduleDeductConsumer implements RocketMQListener<Long> {

    private ScheduleMapper scheduleMapper;
    private ApplicationEventPublisher eventPublisher;

    @Autowired
    public void setScheduleMapper(ScheduleMapper scheduleMapper) {
        this.scheduleMapper = scheduleMapper;
    }

    @Autowired
    public void setEventPublisher(ApplicationEventPublisher eventPublisher) {
        this.eventPublisher = eventPublisher;
    }

    @Override
    public void onMessage(Long scheduleId) {
        int rows = scheduleMapper.decreaseAvailableNum(scheduleId);
        if (rows > 0) {
            eventPublisher.publishEvent(new ScheduleDeductedEvent(this, scheduleId));
        } else {
            System.out.println("排班" + scheduleId + " DB扣减失败（号源已耗尽）");
        }
    }
}
