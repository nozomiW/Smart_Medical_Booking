package com.cly.aiservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

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

    /**
     * 工具调用动作结果，供前端感知（如订单创建成功后刷新列表）
     * 示例：{"type": "ORDER_CREATED", "orderNo": "ORD123", "amount": 50.0}
     */
    private Map<String, Object> toolAction;
}
