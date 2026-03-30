package com.cly.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {

    /**
     * AI 回复的消息
     */
    private String reply;

    /**
     * 会话 ID
     */
    private String sessionId;

    /**
     * 是否成功
     */
    private Boolean success;

    /**
     * 错误信息（如果失败）
     */
    private String errorMessage;
}
