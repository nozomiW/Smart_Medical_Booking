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
        log.info("[消息] 扣减号源库存 - scheduleId: {}", scheduleId);
        int rows = scheduleMapper.decreaseAvailableNum(scheduleId);
        if (rows <= 0) {
            log.error("[错误] DB 扣减号源失败 - scheduleId: {}，可能出现超卖！", scheduleId);
        } else {
            log.info("[成功] DB 扣减号源成功 - scheduleId: {}, 影响行数：{}", scheduleId, rows);
        }
    }
}
