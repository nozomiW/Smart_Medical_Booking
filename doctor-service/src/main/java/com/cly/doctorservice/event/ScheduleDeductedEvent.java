package com.cly.doctorservice.event;

import org.springframework.context.ApplicationEvent;

public class ScheduleDeductedEvent extends ApplicationEvent {

    private final Long scheduleId;

    public ScheduleDeductedEvent(Object source, Long scheduleId) {
        super(source);
        this.scheduleId = scheduleId;
    }

    public Long getScheduleId() {
        return scheduleId;
    }
}
