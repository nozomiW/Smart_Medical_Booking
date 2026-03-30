package com.cly.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {

    /**
     * 对话消息
     */
    private String message;

    /**
     * 会话 ID（可选，用于多轮对话）
     */
    private String sessionId;

    /**
     * 系统提示词（可选）
     */
    private String systemPrompt;
}
