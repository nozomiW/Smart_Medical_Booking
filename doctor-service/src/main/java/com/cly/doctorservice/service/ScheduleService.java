package com.cly.doctorservice.service;

import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.result.Result;

public interface ScheduleService {

    Result insertScheduleRule(ScheduleRule rule);

    Result insertSchedule(Long docId, int weeks);

}