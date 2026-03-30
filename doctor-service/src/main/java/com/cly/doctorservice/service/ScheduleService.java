package com.cly.doctorservice.service;

import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.result.Result;

import java.time.LocalDate;
import java.util.List;

public interface ScheduleService {

    Result insertScheduleRule(ScheduleRule rule);

    Result insertSchedule(String docId, int weeks);

    String findDetailByDate(LocalDate workDate);

    List<ScheduleDetailDTO> findDetailByDateDb(LocalDate workDate);

    ScheduleDetailDTO findDetailById(String scheduleId);

    Result deductAvailableNum(String scheduleId);

    Result deductAvailableNumDb(String scheduleId);

    Result releaseAvailableNum(String scheduleId, int num);

}
