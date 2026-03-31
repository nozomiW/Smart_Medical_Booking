package com.cly.aiservice.service;

import com.cly.aiservice.config.AiProperties;
import com.cly.aiservice.dto.ChatRequest;
import com.cly.aiservice.dto.ChatResponse;
import com.cly.aiservice.feign.DoctorFeignClient;
import com.cly.aiservice.feign.OrderFeignClient;
import com.cly.aiservice.feign.UserFeignClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class AiService {

    @Autowired
    private AiProperties aiProperties;

    @Autowired
    private McpToolService mcpToolService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /** sessionId -> 对话历史 */
    private final Map<String, List<Map<String, String>>> conversationHistory = new ConcurrentHashMap<>();

    // ── 主入口 ──────────────────────────────────────────────────────────

    public ChatResponse chat(ChatRequest request) {
        log.info("收到对话请求 - message: {}, sessionId: {}, userId: {}",
                request.getMessage(), request.getSessionId(), request.getUserId());
        try {
            String systemPrompt = buildEnhancedSystemPrompt(request.getSystemPrompt());
            List<Map<String, String>> history = conversationHistory
                    .computeIfAbsent(request.getSessionId(), k -> new ArrayList<>());

            history.add(msgOf("user", request.getMessage()));

            // 第一次调用 AI
            String firstReply = callAiWithHistory(history, systemPrompt);
            log.info("AI 第一次回复：{}", firstReply);

            String toolCall = extractToolCall(firstReply);
            if (toolCall != null) {
                log.info("========== AI 工具调用开始 ==========");
                log.info("检测到工具调用指令：{}", toolCall);
                
                // 解析工具名称和参数
                String[] parts = toolCall.split("\\(", 2);
                String toolName = parts[0].trim();
                String paramsStr = parts.length > 1 ? parts[1].replaceAll("\\)$", "").trim() : "";
                log.info("工具名称：{}", toolName);
                if (!paramsStr.isEmpty()) {
                    log.info("工具参数：{}", paramsStr);
                }
                
                // 执行工具
                log.info("开始执行工具...");
                Map<String, Object> toolResult = executeToolCall(toolCall, request.getUserId());
                
                // 记录执行结果
                log.info("工具执行完成 - 成功：{}, 消息：{}", 
                        toolResult.get("success"), toolResult.get("message"));
                
                // 如果有数据，简要说明数据量
                Object data = toolResult.get("data");
                if (data != null) {
                    if (data instanceof List) {
                        log.info("返回数据：共 {} 条记录", ((List<?>) data).size());
                    } else {
                        log.info("返回数据：{}", data.getClass().getSimpleName());
                    }
                }
                log.info("========== AI 工具调用结束 ==========");

                history.add(msgOf("assistant", firstReply));
                history.add(msgOf("system", buildToolResultMessage(toolCall, toolResult)));

                // 第二次调用 AI 生成自然语言回复
                String finalReply = callAiWithHistory(history, systemPrompt);
                log.info("AI 最终回复：{}", finalReply);
                history.add(msgOf("assistant", finalReply));

                return ChatResponse.builder()
                        .reply(finalReply)
                        .sessionId(request.getSessionId())
                        .success(true)
                        .toolAction(buildToolAction(toolCall, toolResult))
                        .build();
            }

            history.add(msgOf("assistant", firstReply));
            return ChatResponse.builder()
                    .reply(firstReply)
                    .sessionId(request.getSessionId())
                    .success(true)
                    .build();

        } catch (Exception e) {
            log.error("AI 对话处理失败", e);
            return ChatResponse.builder()
                    .reply("抱歉，AI 服务暂时不可用，请稍后再试。")
                    .sessionId(request.getSessionId())
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }
    // ── AI HTTP 调用 ────────────────────────────────────────────────────

    private String callAiWithHistory(List<Map<String, String>> history, String systemPrompt) {
        String url = aiProperties.getBaseUrl() + "/chat/completions";
        try {
            String body = buildRequestBody(systemPrompt, history);
            try (CloseableHttpClient client = HttpClients.createDefault()) {
                HttpPost post = new HttpPost(url);
                post.setHeader("Content-Type", "application/json");
                post.setHeader("Authorization", "Bearer " + aiProperties.getApiKey());
                post.setEntity(new StringEntity(body, StandardCharsets.UTF_8));
                log.info("调用 AI API - model: {}, 消息数: {}", aiProperties.getModel(), history.size());
                return client.execute(post, resp -> {
                    int code = resp.getCode();
                    String rb = EntityUtils.toString(resp.getEntity(), StandardCharsets.UTF_8);
                    if (code == 200) return parseAiResponse(rb);
                    log.error("AI API 失败 - status: {}, body: {}", code, rb);
                    throw new RuntimeException("AI API 调用失败：HTTP " + code);
                });
            }
        } catch (Exception e) {
            log.error("HTTP 请求失败", e);
            throw new RuntimeException("HTTP 请求失败", e);
        }
    }

    private String buildRequestBody(String systemPrompt, List<Map<String, String>> history) {
        String sys = systemPrompt != null ? systemPrompt : "你是一个医疗预约助手。";
        StringBuilder msgs = new StringBuilder();
        msgs.append("{\"role\":\"system\",\"content\":\"").append(escapeJson(sys)).append("\"}");
        int start = Math.max(0, history.size() - 20);
        for (int i = start; i < history.size(); i++) {
            Map<String, String> m = history.get(i);
            msgs.append(",{\"role\":\"").append(m.get("role"))
                    .append("\",\"content\":\"").append(escapeJson(m.get("content"))).append("\"}");
        }
        return String.format(
                "{\"model\":\"%s\",\"messages\":[%s],\"temperature\":0.7,\"max_tokens\":1024}",
                aiProperties.getModel(), msgs);
    }

    private String parseAiResponse(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                String content = choices.get(0).path("message").path("content").asText();
                if (!content.isEmpty()) return content;
            }
            JsonNode error = root.path("error");
            if (!error.isMissingNode()) {
                String msg = error.path("message").asText("未知错误");
                log.warn("AI 返回错误：{}", msg);
                return "AI 服务响应异常：" + msg;
            }
            return "未获取到有效响应";
        } catch (Exception e) {
            log.error("解析 AI 响应失败 - body: {}", body, e);
            throw new RuntimeException("解析 AI 响应失败", e);
        }
    }
    // ── 工具调用 ────────────────────────────────────────────────────────

    private String extractToolCall(String reply) {
        if (reply == null || !reply.contains("TOOL:")) return null;
        int idx = reply.indexOf("TOOL:");
        int end = reply.indexOf("\n", idx);
        if (end == -1) end = reply.length();
        String tc = reply.substring(idx + 5, end).trim();
        return tc.isEmpty() ? null : tc;
    }

    private Map<String, Object> executeToolCall(String toolCall, String userId) {
        long startTime = System.currentTimeMillis();
        log.info("[MCP] 准备执行工具：{}", toolCall);
        try {
            String[] parts = toolCall.split("\\(", 2);
            String name = parts[0].trim();
            String paramsStr = parts.length > 1 ? parts[1].replaceAll("\\)$", "").trim() : "";
            Map<String, String> params = parseParams(paramsStr);
            log.info("[MCP] 工具名={}, 参数={}", name, params);
            switch (name) {
                case "get_patient_list":    return mcpToolService.getPatientList(userId);
                case "search_doctors":      return mcpToolService.searchDoctors();
                case "get_schedule_detail": {
                    String sid = params.get("scheduleId");
                    if (sid == null || sid.isEmpty()) return errorResult("scheduleId 参数缺失");
                    return mcpToolService.getScheduleDetail(sid);
                }
                case "create_order": {
                    String pid = params.get("patientId");
                    String sid = params.get("scheduleId");
                    if (pid == null || pid.isEmpty()) return errorResult("patientId 参数缺失");
                    if (sid == null || sid.isEmpty()) return errorResult("scheduleId 参数缺失");
                    return mcpToolService.createOrder(userId, pid, sid);
                }
                default: return errorResult("未知工具：" + name);
            }
        } catch (Exception e) {
            log.error("[MCP] 工具调用异常 - toolCall: {}, 错误：{}", toolCall, e.getMessage(), e);
            return errorResult("工具执行异常：" + e.getMessage());
        } finally {
            long endTime = System.currentTimeMillis();
            log.info("[MCP] 工具执行耗时：{}ms", (endTime - startTime));
        }
    }

    private String buildToolResultMessage(String toolCall, Map<String, Object> result) {
        StringBuilder sb = new StringBuilder();
        sb.append("[系统：工具调用结果]\n");
        sb.append("调用工具：").append(toolCall).append("\n");
        sb.append("执行成功：").append(result.getOrDefault("success", false)).append("\n");
        sb.append("结果摘要：").append(result.getOrDefault("message", "")).append("\n");
        Object data = result.get("data");
        if (data != null) {
            sb.append("详细数据：\n");
            if (data instanceof List) {
                List<?> list = (List<?>) data;
                sb.append("共 ").append(list.size()).append(" 条记录\n");
                for (int i = 0; i < Math.min(list.size(), 10); i++) {
                    sb.append("  ").append(i + 1).append(". ").append(formatItem(list.get(i))).append("\n");
                }
                if (list.size() > 10) sb.append("  ...还有 ").append(list.size() - 10).append(" 条\n");
            } else {
                sb.append("  ").append(formatItem(data)).append("\n");
            }
        }
        sb.append("\n请根据以上工具执行结果，用自然语言向用户清晰说明情况，并引导用户进行下一步操作。不要再重复输出 TOOL 指令。");
        return sb.toString();
    }

    private String formatItem(Object item) {
        if (item == null) return "null";
        if (item instanceof DoctorFeignClient.DoctorDTO) {
            DoctorFeignClient.DoctorDTO d = (DoctorFeignClient.DoctorDTO) item;
            return String.format("医生ID:%s 姓名:%s 职称:%s 挂号费:%.1f元",
                    d.getId(), d.getName(), d.getTitle(), d.getFee() != null ? d.getFee() : 0.0);
        }
        if (item instanceof UserFeignClient.PatientDTO) {
            UserFeignClient.PatientDTO p = (UserFeignClient.PatientDTO) item;
            return String.format("就诊人ID:%s 姓名:%s 性别:%s",
                    p.getId(), p.getName(), p.getGender() != null && p.getGender() == 1 ? "男" : "女");
        }
        if (item instanceof DoctorFeignClient.ScheduleDTO) {
            DoctorFeignClient.ScheduleDTO s = (DoctorFeignClient.ScheduleDTO) item;
            return String.format("排班ID:%s 医生:%s 科室:%s 日期:%s 余号:%d",
                    s.getId(), s.getDoctorName(), s.getDeptName(), s.getWorkDate(),
                    s.getAvailableNum() != null ? s.getAvailableNum() : 0);
        }
        if (item instanceof OrderFeignClient.OrderDTO) {
            OrderFeignClient.OrderDTO o = (OrderFeignClient.OrderDTO) item;
            return String.format("订单号:%s 金额:%.2f元",
                    o.getOrderNo(), o.getAmount() != null ? o.getAmount() : 0.0);
        }
        return item.toString();
    }

    private Map<String, Object> buildToolAction(String toolCall, Map<String, Object> toolResult) {
        if (toolResult == null || Boolean.FALSE.equals(toolResult.get("success"))) return null;
        String name = toolCall.split("\\(")[0].trim();
        Map<String, Object> action = new HashMap<>();
        action.put("tool", name);
        action.put("success", true);
        switch (name) {
            case "create_order":
                action.put("type", "ORDER_CREATED");
                Object data = toolResult.get("data");
                if (data instanceof OrderFeignClient.OrderDTO) {
                    OrderFeignClient.OrderDTO o = (OrderFeignClient.OrderDTO) data;
                    action.put("orderNo", o.getOrderNo());
                    action.put("amount", o.getAmount());
                    action.put("orderId", o.getId());
                }
                break;
            case "search_doctors":      action.put("type", "DOCTORS_SEARCHED"); break;
            case "get_patient_list":    action.put("type", "PATIENTS_LOADED"); break;
            case "get_schedule_detail": action.put("type", "SCHEDULE_LOADED"); break;
            default:                    action.put("type", "TOOL_CALLED"); break;
        }
        return action;
    }
    // ── System Prompt 构建 ──────────────────────────────────────────────

    private String buildEnhancedSystemPrompt(String custom) {
        String base = custom != null ? custom : "你是一个智能医疗预约助手，可以帮助患者预约挂号。";
        String now = java.time.LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("yyyy 年 MM 月 dd 日 HH:mm"));
        return base +
            "\n\n【当前时间】" + now +
            "\n\n【【【核心要求】】】当你需要查询信息或执行操作时，**必须直接输出工具调用指令**，绝对不要说'正在查询'、'请稍等'、'我将...'这类废话！"
            + "\n系统会自动调用工具并返回结果，然后你再用自然语言向用户解释结果。"
            + "\n**错误示例**：'我将为您查询医生信息，请稍等' ❌"
            + "\n**正确做法**：直接输出 TOOL: search_doctors() ✅"
            +
            "\n\n【工具调用格式】"
            + "\nTOOL: 工具名 (参数 1=值 1，参数 2=值 2)"
            + "\n例如：TOOL: search_doctors()"
            + "\n注意：TOOL 指令必须大写，并且单独占一行，不要添加任何其他说明文字。"
            +
            "\n\n【可用工具】"
            + "\n1. TOOL: get_patient_list - 获取用户的就诊人列表（不需要参数）"
            + "\n2. TOOL: search_doctors() - 查询所有在线医生列表（无参数，返回全部医生）"
            + "\n   注意：此工具不带参数，返回所有科室的医生。如果用户提到特定科室，你需要从返回结果中找到该科室的医生。"
            + "\n   示例：TOOL: search_doctors()"
            + "\n3. TOOL: get_schedule_detail(scheduleId=日期 + 医生 ID) - 查询某个排班的详细信息"
            + "\n   scheduleId 格式说明：yyyymmdd+ 医生 ID，其中 yyyyMMdd 是预约日期，医生 ID 从医生列表中获取"
            + "\n   例如：今天是 2026 年 3 月 31 日，如果要预约明天 (4 月 1 日)、医生 ID 为 2001 的排班，则 scheduleId=20260401+2001"
            + "\n   示例：TOOL: get_schedule_detail(scheduleId=20260401+2001)"
            + "\n4. TOOL: create_order(patientId=就诊人 ID,scheduleId=日期 + 医生 ID) - 创建挂号订单"
            + "\n   示例：TOOL: create_order(patientId=123,scheduleId=20260401+2001)"
            +
            "\n\n【使用规则】"
            + "\n- 每次只能调用一个工具，TOOL 指令必须单独占一行"
            + "- **不要在调用工具前说任何话**（如'正在查询'、'请稍等'），直接输出 TOOL 指令即可"
            + "\n- 调用工具后，系统会返回结果，然后你再用自然语言向用户解释结果并引导下一步"
            + "\n- 绝对不要在一条消息中连续输出多个 TOOL 指令"
            + "\n- 如果用户的问题需要多个步骤，先完成第一步，等待系统返回后再进行下一步"
            + "\n- 当用户说要查询某科室医生时，立即调用 TOOL: search_doctors(),不要说'正在查询'等话语"
            +
            "\n\n【标准挂号流程】"
            + "\n第 1 步：用户说要挂某科室 -> 立即调用 TOOL: search_doctors()"
            + "\n第 2 步：系统返回所有医生后，你从中找出该科室的医生名单，告知用户有哪些医生，询问想挂哪位医生的号以及日期"
            + "\n第 3 步：用户选择医生和日期后 -> 调用 TOOL: get_schedule_detail(scheduleId=日期 + 医生 ID)"
            + "\n   注意：日期格式为 yyyymmdd，要根据当前日期计算用户要的日期。如今天是 2026-03-31，明天就是 20260401"
            + "\n第 4 步：系统返回排班详情后，展示余号等信息，并询问是否有就诊人 -> 调用 TOOL: get_patient_list"
            + "\n第 5 步：用户确认就诊人后 -> 调用 TOOL: create_order(patientId=xxx,scheduleId=xxx)"
            + "\n第 6 步：系统返回订单信息后，告知用户挂号成功并提供订单详情";
    }

    // ── 工具方法 ────────────────────────────────────────────────────────

    private Map<String, String> parseParams(String paramsStr) {
        Map<String, String> params = new HashMap<>();
        if (paramsStr == null || paramsStr.trim().isEmpty()) return params;
        for (String pair : paramsStr.split(",")) {
            String[] kv = pair.split("=", 2);
            if (kv.length == 2) params.put(kv[0].trim(), kv[1].trim());
        }
        return params;
    }

    private Map<String, Object> errorResult(String message) {
        Map<String, Object> r = new HashMap<>();
        r.put("success", false);
        r.put("message", message);
        return r;
    }

    private Map<String, String> msgOf(String role, String content) {
        Map<String, String> m = new HashMap<>();
        m.put("role", role);
        m.put("content", content);
        return m;
    }

    private String escapeJson(String text) {
        if (text == null) return "";
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}