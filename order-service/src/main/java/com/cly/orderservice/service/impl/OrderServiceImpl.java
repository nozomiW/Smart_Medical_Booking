package com.cly.orderservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.dto.PatientDTO;
import com.cly.orderservice.dto.ScheduleDetailDTO;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.feign.DoctorFeignClient;
import com.cly.orderservice.feign.UserFeignClient;
import com.cly.orderservice.mapper.OrderMapper;
import com.cly.orderservice.mapper.OrderItemMapper;
import com.cly.orderservice.mq.producer.OrderProducer;
import com.cly.orderservice.result.Result;
import com.cly.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    OrderProducer orderProducer;
    DoctorFeignClient doctorFeignClient;
    UserFeignClient userFeignClient;
    OrderMapper orderMapper;
    OrderItemMapper orderItemMapper;
    StringRedisTemplate stringRedisTemplate;

    private final ScheduledExecutorService executorService = Executors.newScheduledThreadPool(1);

    @Autowired
    public void setOrderProducer(OrderProducer orderProducer) {
        this.orderProducer = orderProducer;
    }

    @Autowired
    public void setDoctorFeignClient(DoctorFeignClient doctorFeignClient) {
        this.doctorFeignClient = doctorFeignClient;
    }

    @Autowired
    public void setUserFeignClient(UserFeignClient userFeignClient) {
        this.userFeignClient = userFeignClient;
    }

    @Autowired
    public void setOrderMapper(OrderMapper orderMapper) {
        this.orderMapper = orderMapper;
    }

    @Autowired
    public void setOrderItemMapper(OrderItemMapper orderItemMapper) {
        this.orderItemMapper = orderItemMapper;
    }

    @Autowired
    public void setStringRedisTemplate(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public Result createOrder(Long userId, Long patientId, Long scheduleId) {
        // 1. 获取病人信息
        List<PatientDTO> patients = userFeignClient.getPatients(userId);
        PatientDTO patient = patients.stream()
                .filter(p -> p.getId().equals(patientId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("病人不存在"));

        // 2. 按排班ID查排班
        ScheduleDetailDTO schedule = doctorFeignClient.findScheduleDetailById(scheduleId);
        if (schedule == null) throw new RuntimeException("排班不存在");

        // 3. Redis Lua 原子预扣号源
        Result deductResult = doctorFeignClient.deductAvailableNum(scheduleId);
        if (deductResult != Result.SUCCESS) throw new RuntimeException("号源不足");

        // 4. 组装 Order
        Order order = new Order();
        order.setId(ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE));
        order.setOrderNo("ORD" + System.currentTimeMillis());
        order.setUserId(userId);
        order.setAmount(schedule.getDocFee());
        order.setStatus(0);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());

        // 5. 组装 OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setPatientName(patient.getName());
        orderItem.setPatientIdCard(patient.getIdCard());
        orderItem.setPatientPhone(patient.getPhone());
        orderItem.setScheduleId(scheduleId);
        orderItem.setDocId(schedule.getDocId());
        orderItem.setDocName(schedule.getDocName());
        orderItem.setDocTitle(schedule.getDocTitle());
        orderItem.setWorkDate(schedule.getWorkDate());

        // 1. 第一次删除列表缓存
        String indexKey = "order:index:" + userId;
        stringRedisTemplate.delete(indexKey);

        orderProducer.produceOrderCreate(order, orderItem);

        // 2. 延迟 500ms 后第二次删除（延迟双删）
        executorService.schedule(
                () -> stringRedisTemplate.delete(indexKey),
                500,
                TimeUnit.MILLISECONDS
        );

        return Result.SUCCESS;
    }

    @Override
    public List<Order> getOrders(Long userId) {
        String indexKey = "order:index:" + userId;
        long now = System.currentTimeMillis();

        Set<String> orderIds = stringRedisTemplate.opsForZSet()
                .rangeByScore(indexKey, now, Double.MAX_VALUE);

        if (orderIds != null && !orderIds.isEmpty()) {
            List<String> itemKeys = orderIds.stream()
                    .map(id -> "order:item:" + id)
                    .collect(Collectors.toList());
            List<String> values = stringRedisTemplate.opsForValue().multiGet(itemKeys);
            if (values != null) {
                List<Order> result = values.stream()
                        .filter(v -> v != null)
                        .map(v -> JSON.parseObject(v, Order.class))
                        .collect(Collectors.toList());
                if (!result.isEmpty()) return result;
            }
        }

        List<Order> list = orderMapper.selectList(
                new LambdaQueryWrapper<Order>().eq(Order::getUserId, userId));
        if (!list.isEmpty()) {
            long expireAt = now + TimeUnit.HOURS.toMillis(2);
            for (Order o : list) {
                stringRedisTemplate.opsForValue().set(
                        "order:item:" + o.getId(), JSON.toJSONString(o), 2, TimeUnit.HOURS);
                stringRedisTemplate.opsForZSet().add(indexKey, o.getId().toString(), expireAt);
            }
            stringRedisTemplate.expire(indexKey, 3, TimeUnit.HOURS);
        }
        return list;
    }

    @Override
    public OrderDetailDTO getOrderDetail(Long orderId) {
        String redisKey = "order:detail:" + orderId;

        String cached = stringRedisTemplate.opsForValue().get(redisKey);
        if (cached != null)
            return JSON.parseObject(cached, OrderDetailDTO.class);

        Order order = orderMapper.selectById(orderId);
        if (order == null) throw new RuntimeException("订单不存在");
        OrderItem orderItem = orderItemMapper.selectOne(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));

        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrder(order);
        dto.setOrderItem(orderItem);

        stringRedisTemplate.opsForValue().set(redisKey, JSON.toJSONString(dto), 2, TimeUnit.HOURS);
        return dto;
    }
}
