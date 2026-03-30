package com.cly.gateway.filter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 全局日志过滤器
 * 记录所有经过网关的请求和响应信息
 */
@Component
public class GlobalLogFilter implements GlobalFilter, Ordered {

    private static final Logger log = LoggerFactory.getLogger(GlobalLogFilter.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        String method = exchange.getRequest().getMethod().name();
        String startTime = LocalDateTime.now().format(formatter);

        // 记录请求信息
        log.info("========== 网关请求开始 ==========");
        log.info("时间：{}", startTime);
        log.info("路径：{} {}", method, path);
        
        HttpHeaders headers = exchange.getRequest().getHeaders();
        String userId = headers.getFirst("X-User-Id");
        if (userId != null) {
            log.info("用户 ID: {}", userId);
        }

        long startTimestamp = System.currentTimeMillis();

        return chain.filter(exchange).then(Mono.fromRunnable(() -> {
            long endTimestamp = System.currentTimeMillis();
            long duration = endTimestamp - startTimestamp;
            
            Integer statusCode = exchange.getResponse().getStatusCode() != null 
                    ? exchange.getResponse().getStatusCode().value() : -1;
            
            log.info("========== 网关请求结束 ==========");
            log.info("状态码：{}", statusCode);
            log.info("耗时：{}ms", duration);
            log.info("成功：{}", statusCode >= 200 && statusCode < 300 ? "是" : "否");
        }));
    }

    @Override
    public int getOrder() {
        return -200; // 最高优先级，最先执行
    }
}
