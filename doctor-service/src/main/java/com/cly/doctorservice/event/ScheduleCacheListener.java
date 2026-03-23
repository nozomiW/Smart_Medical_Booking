package com.cly.doctorservice.event;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.mapper.ScheduleMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.util.concurrent.TimeUnit;

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

        // 1. 同步按日期查询的 Hash 列表缓存
        String dateKey = "schedule:detail:" + detail.getWorkDate();
        String field = scheduleId.toString();
        if (Boolean.TRUE.equals(stringRedisTemplate.opsForHash().hasKey(dateKey, field))) {
            stringRedisTemplate.opsForHash().put(dateKey, field, JSON.toJSONString(detail));
        }
        
        // 2. 同步按 ID 查询的 String 详情缓存
        String idKey = "schedule:detail:id:" + scheduleId;
        if (Boolean.TRUE.equals(stringRedisTemplate.hasKey(idKey))) {
            stringRedisTemplate.opsForValue().set(idKey, JSON.toJSONString(detail), 2, TimeUnit.HOURS);
        }
    }
}
