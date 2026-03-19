package com.cly.gateway.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.data.redis.core.ReactiveStringRedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
public class RateLimitFilter implements GlobalFilter, Ordered {

    // 令牌桶 Lua：capacity=桶容量，rate=每秒补充令牌数
    private static final String TOKEN_BUCKET_LUA =
            "local key = KEYS[1]\n" +
            "local capacity = tonumber(ARGV[1])\n" +
            "local rate = tonumber(ARGV[2])\n" +
            "local now = tonumber(ARGV[3])\n" +
            "local requested = 1\n" +
            "local fill_time = capacity / rate\n" +
            "local ttl = math.floor(fill_time * 2)\n" +
            "local last_tokens = tonumber(redis.call('GET', key .. ':tokens'))\n" +
            "if last_tokens == nil then last_tokens = capacity end\n" +
            "local last_time = tonumber(redis.call('GET', key .. ':time'))\n" +
            "if last_time == nil then last_time = now end\n" +
            "local delta = math.max(0, now - last_time)\n" +
            "local filled = math.min(capacity, last_tokens + delta * rate)\n" +
            "local allowed = filled >= requested\n" +
            "local new_tokens = filled\n" +
            "if allowed then new_tokens = filled - requested end\n" +
            "redis.call('SETEX', key .. ':tokens', ttl, new_tokens)\n" +
            "redis.call('SETEX', key .. ':time', ttl, now)\n" +
            "return allowed and 1 or 0";

    private static final DefaultRedisScript<Long> RATE_LIMIT_SCRIPT =
            new DefaultRedisScript<>(TOKEN_BUCKET_LUA, Long.class);

    // 限流路径前缀
    private static final List<String> RATE_LIMIT_PATHS = List.of(
            "/order/create",
            "/pay"
    );

    // 桶容量：最多积累20个令牌；速率：每秒10个
    private static final int CAPACITY = 20;
    private static final int RATE = 10;

    private ReactiveStringRedisTemplate redisTemplate;

    @Autowired
    public void setRedisTemplate(ReactiveStringRedisTemplate redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        boolean needLimit = RATE_LIMIT_PATHS.stream().anyMatch(path::startsWith);
        if (!needLimit) return chain.filter(exchange);

        String userId = exchange.getRequest().getHeaders().getFirst("X-User-Id");
        String key = "rate_limit:" + path + ":" + (userId != null ? userId : "anonymous");
        long now = System.currentTimeMillis() / 1000;

        return redisTemplate.execute(
                        RATE_LIMIT_SCRIPT,
                        List.of(key),
                        List.of(String.valueOf(CAPACITY), String.valueOf(RATE), String.valueOf(now)))
                .next()
                .flatMap(allowed -> {
                    if (allowed != null && allowed == 1L) {
                        return chain.filter(exchange);
                    }
                    exchange.getResponse().setStatusCode(HttpStatus.TOO_MANY_REQUESTS);
                    return exchange.getResponse().setComplete();
                });
    }

    @Override
    public int getOrder() {
        return -99; // 在 AuthFilter(-100) 之后执行
    }
}
