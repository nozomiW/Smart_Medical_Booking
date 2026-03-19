package com.cly.doctorservice.event;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.mapper.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
public class ScheduleCacheListener {

    private ScheduleMapper scheduleMapper;
    private StringRedisTemplate stringRedisTemplate;

    @Autowired
    public void setScheduleMapper(ScheduleMapper scheduleMapper) {
        this.scheduleMapper = scheduleMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @EventListener
    public void onDeducted(ScheduleDeductedEvent event) {
        Long scheduleId = event.getScheduleId();
        ScheduleDetailDTO detail = scheduleMapper.findDetailById(scheduleId);
        if (detail == null) return;

        String dateKey = "schedule:detail:" + detail.getWorkDate();
        String field = scheduleId.toString();
        if (Boolean.TRUE.equals(stringRedisTemplate.opsForHash().hasKey(dateKey, field))) {
            stringRedisTemplate.opsForHash().put(dateKey, field, JSON.toJSONString(detail));
        }
    }
}
