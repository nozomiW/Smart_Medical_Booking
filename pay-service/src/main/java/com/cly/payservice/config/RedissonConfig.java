package com.cly.payservice.config;

import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class RedissonConfig {

    @Value("${spring.redisson.config}")
    private String redissonYaml;

    @Bean(destroyMethod = "shutdown")
    public RedissonClient redissonClient() throws IOException {
        // 直接从 YAML 字符串解析配置
        Config config = Config.fromYAML(redissonYaml);
        return Redisson.create(config);
    }
}
