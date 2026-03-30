package com.cly.payservice.service.impl;

import com.cly.payservice.annotation.BusinessLog;
import com.cly.payservice.dto.OrderDetailDTO;
import com.cly.payservice.feign.OrderFeignClient;
import com.cly.payservice.mq.producer.PayProducer;
import com.cly.payservice.result.Result;
import com.cly.payservice.service.PayService;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class PayServiceImpl implements PayService {

    private OrderFeignClient orderFeignClient;
    private PayProducer payProducer;
    private RedissonClient redissonClient;

    @Autowired
    public void setOrderFeignClient(OrderFeignClient orderFeignClient) {
        this.orderFeignClient = orderFeignClient;
    }

    @Autowired
    public void setPayProducer(PayProducer payProducer) {
        this.payProducer = payProducer;
    }

    @Autowired
    public void setRedissonClient(RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
    }

    @Override
    @BusinessLog(value = "订单支付", type = "支付管理")
    public Result pay(String orderId) {
        // 1. 预检查订单状态
        OrderDetailDTO detail = orderFeignClient.getOrderDetail(orderId);
        if (detail == null || detail.getOrder() == null) throw new RuntimeException("订单不存在");
        
        // 如果已经支付（非待支付状态0），直接返回成功（满足幂等性）
        if (detail.getOrder().getStatus() != 0) {
            return Result.SUCCESS;
        }

        // 2. 使用 Redisson 分布式锁，防止并发重复支付
        String lockKey = "lock:pay:" + orderId;
        RLock lock = redissonClient.getLock(lockKey);

        try {
            // 尝试加锁，等待 3s，加锁成功后 30s 自动释放（Redisson 看门狗会自动续期）
            // 这里使用 tryLock 的好处是可以优雅处理高并发下的点击
            if (lock.tryLock(3, 30, TimeUnit.SECONDS)) {
                // 3. 再次确认订单状态（Double Check）
                detail = orderFeignClient.getOrderDetail(orderId);
                if (detail.getOrder().getStatus() == 0) {
                    payProducer.producePaySuccess(orderId);
                }
                return Result.SUCCESS;
            } else {
                // 没抢到锁，说明有另一个请求正在处理支付逻辑，直接返回成功或提示
                return Result.SUCCESS;
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException("支付请求被中断");
        } finally {
            // 4. 释放锁（Redisson 会自动判断是否是当前线程持有的锁）
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
