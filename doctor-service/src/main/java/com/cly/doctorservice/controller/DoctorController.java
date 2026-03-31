package com.cly.doctorservice.controller;

import com.cly.doctorservice.entity.Doctor;
import com.cly.doctorservice.entity.ScheduleRule;
import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.cly.doctorservice.dto.SpecialtyDTO;
import com.cly.doctorservice.result.Result;
import com.cly.doctorservice.service.DoctorService;
import com.cly.doctorservice.service.ScheduleService;
import com.cly.doctorservice.service.SpecialtyService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("doctor")
public class DoctorController {

    private DoctorService doctorService;
    private ScheduleService scheduleService;
    private SpecialtyService specialtyService;

    @Autowired
    public void setDoctorService(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    @Autowired
    public void setScheduleService(ScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    @Autowired
    public void setSpecialtyService(SpecialtyService specialtyService) {
        this.specialtyService = specialtyService;
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
    public Result insertSchedule(@RequestParam String docId,
                                 @RequestParam(defaultValue = "4") int weeks) {
        return scheduleService.insertSchedule(docId, weeks);
    }

    // 查询某天所有排班（含医生信息）
    @GetMapping(value = "schedule/detail", produces = "application/json;charset=utf-8")
    public String findScheduleDetail(@RequestParam String workDate) {
        return scheduleService.findDetailByDate(LocalDate.parse(workDate));
    }

    // Baseline: 纯 DB 查询某天所有排班
    @GetMapping("schedule/detail/db")
    public List<ScheduleDetailDTO> findScheduleDetailDb(@RequestParam String workDate) {
        return scheduleService.findDetailByDateDb(LocalDate.parse(workDate));
    }

    // 按排班ID查单条排班详情
    @GetMapping("schedule/detail/id")
    public ScheduleDetailDTO findScheduleDetailById(@RequestParam String scheduleId) {
        return scheduleService.findDetailById(scheduleId);
    }

    @PostMapping("schedule/deduct")
    public Result deductAvailableNum(@RequestParam String scheduleId) {
        return scheduleService.deductAvailableNum(scheduleId);
    }

    @PostMapping("schedule/deduct/db")
    public Result deductAvailableNumDb(@RequestParam String scheduleId) {
        return scheduleService.deductAvailableNumDb(scheduleId);
    }

    @PostMapping("schedule/release")
    public Result releaseAvailableNum(
            @RequestHeader(value = "X-User-Id", required = false) String userId,
            @RequestParam String scheduleId,
            @RequestParam(defaultValue = "1") int num) {
        return scheduleService.releaseAvailableNum(scheduleId, num);
    }

    @PostMapping("update/fee")
    public Result updateDoctorFee(@RequestParam String doctorId, @RequestParam BigDecimal fee) {
        return doctorService.updateFee(doctorId, fee);
    }

    // ==================== 擅长标签相关接口 ====================

    /**
     * 获取所有启用的标签
     */
    @GetMapping("specialties/all")
    public List<SpecialtyDTO> getAllSpecialties() {
        return specialtyService.getAllActiveSpecialties();
    }

    /**
     * 按分类查询标签
     */
    @GetMapping("specialties/category")
    public List<SpecialtyDTO> getSpecialtiesByCategory(@RequestParam(required = false) String category) {
        return specialtyService.getSpecialtiesByCategory(category);
    }

    /**
     * 搜索标签
     */
    @GetMapping("specialties/search")
    public List<SpecialtyDTO> searchSpecialties(@RequestParam(required = false) String keyword) {
        return specialtyService.searchSpecialties(keyword);
    }

    /**
     * 查询某个医生的擅长标签
     */
    @GetMapping("specialties/doctor/{doctorId}")
    public List<SpecialtyDTO> getDoctorSpecialties(@PathVariable String doctorId) {
        return specialtyService.getDoctorSpecialties(doctorId);
    }

    /**
     * 根据症状推荐医生（智能推荐）
     */
    @PostMapping("specialties/recommend")
    public List<String> recommendDoctors(@RequestBody List<String> symptoms) {
        return specialtyService.recommendDoctorsBySymptoms(symptoms);
    }

}
