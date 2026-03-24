package com.cly.doctorservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;

@Configuration
public class ThreadPoolConfig {

    @Bean
    public ScheduledExecutorService scheduledExecutorService() {
        // 创建一个核心线程数为 10 的调度线程池
        return Executors.newScheduledThreadPool(10);
    }
}
