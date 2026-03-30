package com.cly.aiservice.controller;

import com.cly.aiservice.dto.ChatRequest;
import com.cly.aiservice.dto.ChatResponse;
import com.cly.aiservice.result.Result;
import com.cly.aiservice.service.AiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("ai")
public class AiController {

    @Autowired
    private AiService aiService;

    /**
     * 对话接口
     * @param request 对话请求
     * @return 对话响应
     */
    @PostMapping("/chat")
    public Result<ChatResponse> chat(@RequestBody ChatRequest request) {
        log.info("收到对话请求 - message: {}", request.getMessage());
        
        try {
            ChatResponse response = aiService.chat(request);
            return Result.success(response);
        } catch (Exception e) {
            log.error("对话处理失败", e);
            return Result.error("对话处理失败：" + e.getMessage());
        }
    }

    /**
     * 简单测试接口
     * @return 测试结果
     */
    @GetMapping("/test")
    public Result<String> test() {
        return Result.success("AI Service is running!");
    }
}
