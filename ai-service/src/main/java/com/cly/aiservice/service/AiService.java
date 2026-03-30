package com.cly.aiservice.service;

import com.cly.aiservice.config.AiProperties;
import com.cly.aiservice.dto.ChatRequest;
import com.cly.aiservice.dto.ChatResponse;
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

@Slf4j
@Service
public class AiService {

    @Autowired
    private AiProperties aiProperties;

    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 对话接口
     * @param request 对话请求
     * @return 对话响应
     */
    public ChatResponse chat(ChatRequest request) {
        log.info("收到对话请求 - message: {}, sessionId: {}", 
                request.getMessage(), request.getSessionId());

        try {
            // 调用真实的 SiliconFlow API
            String reply = callSiliconFlowApi(request.getMessage(), request.getSystemPrompt());
            
            return ChatResponse.builder()
                    .reply(reply)
                    .sessionId(request.getSessionId())
                    .success(true)
                    .build();
        } catch (Exception e) {
            log.error("SiliconFlow API 调用失败 - message: {}", request.getMessage(), e);
            return ChatResponse.builder()
                    .reply("抱歉，AI 服务暂时不可用，请稍后再试。")
                    .sessionId(request.getSessionId())
                    .success(false)
                    .errorMessage(e.getMessage())
                    .build();
        }
    }

    /**
     * 调用 SiliconFlow API（OpenAI 兼容格式）
     * @param message 用户消息
     * @param systemPrompt 系统提示词
     * @return AI 回复
     */
    private String callSiliconFlowApi(String message, String systemPrompt) {
        String url = aiProperties.getBaseUrl() + "/chat/completions";

        // 构建请求体
        String requestBody;
        try {
            requestBody = buildSiliconFlowRequestBody(message, systemPrompt);
        } catch (Exception e) {
            log.error("构建请求体失败", e);
            throw new RuntimeException("构建请求体失败", e);
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost post = new HttpPost(url);
            post.setHeader("Content-Type", "application/json");
            post.setHeader("Authorization", "Bearer " + aiProperties.getApiKey());
            post.setEntity(new StringEntity(requestBody, StandardCharsets.UTF_8));

            log.info("调用 SiliconFlow API - url: {}, model: {}", url, aiProperties.getModel());

            // 执行请求并获取响应
            return httpClient.execute(post, response -> {
                try {
                    int code = response.getCode();
                    String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                    
                    if (code == 200) {
                        return parseSiliconFlowResponse(responseBody);
                    } else {
                        log.error("SiliconFlow API 响应失败 - status: {}, body: {}", code, responseBody);
                        throw new RuntimeException("SiliconFlow API 调用失败：HTTP " + code);
                    }
                } catch (Exception e) {
                    log.error("处理响应失败", e);
                    throw new RuntimeException("处理响应失败", e);
                }
            });
        } catch (Exception e) {
            log.error("HTTP 请求失败", e);
            throw new RuntimeException("HTTP 请求失败", e);
        }
    }

    /**
     * 构建 SiliconFlow 请求体（OpenAI 兼容格式）
     * @param message 用户消息
     * @param systemPrompt 系统提示词
     * @return JSON 请求体
     */
    private String buildSiliconFlowRequestBody(String message, String systemPrompt) throws Exception {
        String systemInstruction = systemPrompt != null ? systemPrompt : "你是一个医疗预约助手，帮助用户了解医生排班、预约流程等信息。";
        
        // OpenAI 兼容格式
        String jsonTemplate = "{\n" +
                "  \"model\": \"%s\",\n" +
                "  \"messages\": [\n" +
                "    {\n" +
                "      \"role\": \"system\",\n" +
                "      \"content\": \"%s\"\n" +
                "    },\n" +
                "    {\n" +
                "      \"role\": \"user\",\n" +
                "      \"content\": \"%s\"\n" +
                "    }\n" +
                "  ],\n" +
                "  \"temperature\": 0.7,\n" +
                "  \"max_tokens\": 1024\n" +
                "}";

        return String.format(jsonTemplate, 
                aiProperties.getModel(), 
                escapeJson(systemInstruction),
                escapeJson(message));
    }

    /**
     * 解析 SiliconFlow 响应（OpenAI 兼容格式）
     * @param responseBody 响应 JSON
     * @return 提取的文本内容
     */
    private String parseSiliconFlowResponse(String responseBody) throws Exception {
        JsonNode root = objectMapper.readTree(responseBody);
        
        // OpenAI 响应格式：{"choices":[{"message":{"content":"...","role":"assistant"}}],"usage":{...}}
        JsonNode choices = root.path("choices");
        if (choices.isArray() && choices.size() > 0) {
            JsonNode message = choices.get(0).path("message");
            String content = message.path("content").asText();
            if (!content.isEmpty()) {
                return content;
            }
        }
        
        // 如果没有找到有效响应，检查是否有错误
        JsonNode error = root.path("error");
        if (!error.isMissingNode()) {
            String errorMsg = error.path("message").asText("未知错误");
            log.warn("SiliconFlow 返回错误 - {}", errorMsg);
            return "AI 服务响应异常：" + errorMsg;
        }
        
        log.warn("未从响应中提取到内容 - body: {}", responseBody);
        return "未获取到有效响应";
    }

    /**
     * 转义 JSON 特殊字符
     * @param text 原始文本
     * @return 转义后的文本
     */
    private String escapeJson(String text) {
        return text.replace("\\", "\\\\")
                   .replace("\"", "\\\"")
                   .replace("\n", "\\n")
                   .replace("\r", "\\r")
                   .replace("\t", "\\t");
    }
}
