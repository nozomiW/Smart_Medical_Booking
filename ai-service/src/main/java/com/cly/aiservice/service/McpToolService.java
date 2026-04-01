package com.cly.aiservice.service;

import com.cly.aiservice.feign.DoctorFeignClient;
import com.cly.aiservice.feign.OrderFeignClient;
import com.cly.aiservice.feign.UserFeignClient;
import com.cly.aiservice.result.Result;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * MCP 工具服务 - 提供给大模型调用的业务工具
 */
@Slf4j
@Service
public class McpToolService {

    @Autowired
    private UserFeignClient userFeignClient;

    @Autowired
    private DoctorFeignClient doctorFeignClient;

    @Autowired
    private OrderFeignClient orderFeignClient;

    /**
     * 工具 1: 获取用户的就诊人列表
     */
    public Map<String, Object> getPatientList(String userId) {
        log.info("[MCP 工具] 获取就诊人列表 - userId: {}", userId);
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<UserFeignClient.PatientDTO> patients = userFeignClient.getPatients(userId);
            if (patients != null && !patients.isEmpty()) {
                result.put("success", true);
                result.put("data", patients);
                result.put("message", String.format("找到 %d 个就诊人", patients.size()));
            } else {
                result.put("success", false);
                result.put("message", "暂无就诊人信息");
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 获取就诊人列表失败", e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }
        
        return result;
    }

    /**
     * 工具 2: 查询在线医生列表
     */
    public Map<String, Object> searchDoctors() {
        log.info("[MCP 工具] 查询在线医生列表");
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<DoctorFeignClient.DoctorDTO> doctors = doctorFeignClient.searchOnline();
            log.info("[MCP 工具] Feign 调用成功，返回{}位医生", doctors != null ? doctors.size() : 0);
            if (doctors != null && !doctors.isEmpty()) {
                result.put("success", true);
                result.put("data", doctors);
                result.put("message", String.format("找到 %d 位在线医生", doctors.size()));
                log.info("[MCP 工具] 查询成功：{}位医生", doctors.size());
            } else {
                result.put("success", false);
                result.put("message", "暂无在线医生");
                log.warn("[MCP 工具] 查询结果：无在线医生");
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 查询医生列表失败", e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }
        
        return result;
    }

    /**
     * 工具 3: 查询排班详情
     */
    public Map<String, Object> getScheduleDetail(String scheduleId) {
        log.info("[MCP 工具] 查询排班详情 - scheduleId: {}", scheduleId);
        Map<String, Object> result = new HashMap<>();
        
        try {
            log.info("[MCP 工具] 开始调用 Feign 接口 getScheduleDetailById({})", scheduleId);
            DoctorFeignClient.ScheduleDTO schedule = doctorFeignClient.getScheduleDetailById(scheduleId);
            log.info("[MCP 工具] Feign 调用返回：{}", schedule != null ? 
                    String.format("医生=%s，日期=%s，余号=%d", schedule.getDocName(), schedule.getWorkDate(), schedule.getAvailableNum()) : "null");
            if (schedule != null) {
                result.put("success", true);
                result.put("data", schedule);
                result.put("message", "获取成功");
                log.info("[MCP 工具] 查询成功：医生={}, 日期={}, 余号={}", 
                        schedule.getDocName(), schedule.getWorkDate(), schedule.getAvailableNum());
            } else {
                result.put("success", false);
                result.put("message", "排班不存在");
                log.warn("[MCP 工具] 查询结果：排班不存在，scheduleId={}", scheduleId);
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 查询排班详情失败 - scheduleId: {}", scheduleId, e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }
        
        return result;
    }

    /**
     * 工具 4: 创建订单（核心功能）
     */
    public Map<String, Object> createOrder(String userId, String patientId, String scheduleId) {
        log.info("[MCP 工具] 创建订单 - userId: {}, patientId: {}, scheduleId: {}", userId, patientId, scheduleId);
        Map<String, Object> result = new HashMap<>();
        
        try {
            String orderResult = orderFeignClient.createOrder(patientId, scheduleId, userId);
            // 去除可能的引号和空格
            if (orderResult != null && orderResult.replaceAll("\"", "").trim().equals("SUCCESS")) {
                result.put("success", true);
                result.put("message", "挂号成功！订单已创建");
                log.info("[MCP 工具] 创建订单成功");
            } else {
                result.put("success", false);
                result.put("message", "创建订单失败");
                log.warn("[MCP 工具] 创建订单失败：{}", orderResult);
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 创建订单失败 - userId: {}, patientId: {}, scheduleId: {}", 
                    userId, patientId, scheduleId, e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }
        
        return result;
    }

    /**
     * 工具 5: 根据医生 ID 和日期查询排班详情
     */
    public Map<String, Object> getDoctorSchedule(String doctorId, String workDate) {
        log.info("[MCP 工具] 查询医生某日排班 - doctorId: {}, workDate: {}", doctorId, workDate);
        Map<String, Object> result = new HashMap<>();

        try {
            DoctorFeignClient.ScheduleDTO schedule = doctorFeignClient.getScheduleDetailByDoctorAndDate(doctorId, workDate);
            if (schedule != null) {
                result.put("success", true);
                result.put("data", schedule);
                result.put("message", "获取成功");
            } else {
                result.put("success", false);
                result.put("message", "该医生在所选日期没有排班");
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 查询医生排班失败", e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }

        return result;
    }

    /**
     * 工具 6: 按日期查询所有医生的排班详情
     */
    public Map<String, Object> getSchedulesByDate(String workDate) {
        log.info("[MCP 工具] 查询某日所有医生排班 - workDate: {}", workDate);
        Map<String, Object> result = new HashMap<>();

        try {
            List<DoctorFeignClient.ScheduleDTO> schedules = doctorFeignClient.getSchedulesByDate(workDate);
            if (schedules != null && !schedules.isEmpty()) {
                result.put("success", true);
                result.put("data", schedules);
                result.put("message", String.format("找到 %d 条排班记录", schedules.size()));
                log.info("[MCP 工具] 查询成功：{}条排班", schedules.size());
            } else {
                result.put("success", false);
                result.put("message", "该日期暂无排班信息");
                log.warn("[MCP 工具] 查询结果：该日期暂无排班");
            }
        } catch (Exception e) {
            log.error("[MCP 工具] 查询日期排班失败 - workDate: {}", workDate, e);
            result.put("success", false);
            result.put("message", "系统异常：" + e.getMessage());
        }

        return result;
    }
}
