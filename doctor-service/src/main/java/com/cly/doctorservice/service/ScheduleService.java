package com.cly.doctorservice.service;

import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.result.Result;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    Result insertScheduleRule(ScheduleRule rule);

    Result insertSchedule(Long docId, int weeks);

    List<ScheduleDetailDTO> findDetailByDate(LocalDate workDate);

    ScheduleDetailDTO findDetailById(Long scheduleId);

    Result deductAvailableNum(Long scheduleId);

    Result releaseAvailableNum(Long scheduleId, int num);

}