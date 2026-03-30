package com.cly.aiservice.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "ai")
public class AiProperties {

    /**
     * SiliconFlow API Key
     */
    private String apiKey = "sk-xqfeedlachvcovfxcztkgxnzdottviyqatnsuwthluqpuxwe";

    /**
     * SiliconFlow API Base URL
     */
    private String baseUrl = "https://api.siliconflow.cn/v1";

    /**
     * 模型名称
     */
    private String model = "Qwen/Qwen2.5-7B-Instruct";

    /**
     * 超时时间（毫秒）
     */
    private Long timeout = 30000L;
}
