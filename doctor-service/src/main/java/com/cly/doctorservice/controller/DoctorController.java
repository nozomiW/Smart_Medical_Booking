package com.cly.doctorservice.controller;

import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.DoctorService;
import com.cly.doctorservice.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("doctor")
public class DoctorController {

    private DoctorService doctorService;
    private ScheduleService scheduleService;

    @Autowired
    public void setDoctorService(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Autowired
    public void setScheduleService(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @GetMapping("search/online")
    public List<Doctor> searchDoctorsOnline() {
        return doctorService.searchOnline();
    }

    // 新增医生
    @PostMapping("insert")
    public Result insertDoctor(@RequestBody Doctor doctor) {
        return doctorService.insertDoctor(doctor);
    }

    // 新增排班规则（某医生在周几出诊、最大号源数）
    @PostMapping("insert/schedule/rule")
    public Result insertScheduleRule(@RequestBody ScheduleRule rule) {
        return scheduleService.insertScheduleRule(rule);
    }

    // 按规则生成排班（向后 weeks 周）
    @PostMapping("insert/schedule")
    public Result insertSchedule(@RequestParam Long docId,
                                 @RequestParam(defaultValue = "4") int weeks) {
        return scheduleService.insertSchedule(docId, weeks);
    }

    // 查询某天所有排班（含医生信息）
    @GetMapping("schedule/detail")
    public List<ScheduleDetailDTO> findScheduleDetail(@RequestParam String workDate) {
        return scheduleService.findDetailByDate(LocalDate.parse(workDate));
    }

    // 按排班ID查单条排班详情
    @GetMapping("schedule/detail/id")
    public ScheduleDetailDTO findScheduleDetailById(@RequestParam Long scheduleId) {
        return scheduleService.findDetailById(scheduleId);
    }

    @PostMapping("schedule/deduct")
    public Result deductAvailableNum(@RequestParam Long scheduleId) {
        return scheduleService.deductAvailableNum(scheduleId);
    }

    @PostMapping("schedule/release")
    public Result releaseAvailableNum(@RequestParam Long scheduleId, @RequestParam(defaultValue = "1") int num) {
        return scheduleService.releaseAvailableNum(scheduleId, num);
    }

    @PostMapping("update/fee")
    public Result updateDoctorFee(@RequestParam Long doctorId, @RequestParam BigDecimal fee) {
        return doctorService.updateFee(doctorId, fee);
    }

}
