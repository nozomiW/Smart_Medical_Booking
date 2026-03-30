package com.cly.orderservice.service.impl;

import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cly.orderservice.annotation.BusinessLog;
import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.dto.PatientDTO;
import com.cly.orderservice.dto.ScheduleDetailDTO;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.feign.DoctorFeignClient;
import com.cly.orderservice.feign.UserFeignClient;
import com.cly.orderservice.handler.OrderHandler;
import com.cly.orderservice.mapper.OrderMapper;
import com.cly.orderservice.mapper.OrderItemMapper;
import com.cly.orderservice.mq.producer.OrderProducer;
import com.cly.orderservice.result.Result;
import com.cly.orderservice.service.OrderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import com.baomidou.mybatisplus.core.toolkit.IdWorker;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class OrderServiceImpl implements OrderService {

    OrderProducer orderProducer;
    DoctorFeignClient doctorFeignClient;
    UserFeignClient userFeignClient;
    OrderMapper orderMapper;
    OrderItemMapper orderItemMapper;
    StringRedisTemplate stringRedisTemplate;
    OrderHandler orderHandler;

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

    @Autowired
    public void setOrderHandler(OrderHandler orderHandler) {
        this.orderHandler = orderHandler;
    }

    @Override
    @BusinessLog(value = "创建订单（MQ 异步）", type = "订单管理")
    public Result createOrder(String userId, String patientId, String scheduleId) {
        log.info("开始创建订单 - userId: {}, patientId: {}, scheduleId: {}", userId, patientId, scheduleId);
        
        // 步骤 1: Redis 预扣减号源
        Result deductResult = doctorFeignClient.deductAvailableNum(scheduleId);
        if (deductResult != Result.SUCCESS) {
            log.error("扣减号源失败 - scheduleId: {}", scheduleId);
            return Result.FALSE;
        }
    
        // 步骤 2: 获取就诊人信息并验证
        List<PatientDTO> patients = userFeignClient.getPatients(userId);
        PatientDTO patient = patients.stream()
                .filter(p -> p.getId().equals(patientId))
                .findFirst()
                .orElse(null);
        
        if (patient == null) {
            log.error("就诊人验证不通过 - userId: {}, patientId: {}", userId, patientId);
            return Result.FALSE;
        }
    
        // 步骤 3: 获取排班信息
        ScheduleDetailDTO schedule = doctorFeignClient.findScheduleDetailById(scheduleId);
        if (schedule == null) {
            log.error("排班信息不存在 - scheduleId: {}", scheduleId);
            return Result.FALSE;
        }
    
        // 步骤 4: 组装订单数据
        Order order = new Order();
        order.setId(IdWorker.getIdStr());
        order.setOrderNo("ORD" + IdWorker.getIdStr());
        order.setUserId(userId);
        order.setAmount(schedule.getDocFee());
        order.setStatus(0);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());
    
        OrderItem orderItem = new OrderItem();
        orderItem.setPatientName(patient.getName());
        orderItem.setPatientIdCard(patient.getIdCard());
        orderItem.setPatientPhone(patient.getPhone());
        orderItem.setScheduleId(scheduleId);
        orderItem.setDocId(schedule.getDocId());
        orderItem.setDocName(schedule.getDocName());
        orderItem.setDocTitle(schedule.getDocTitle());
        orderItem.setWorkDate(schedule.getWorkDate());
        String deptName = getDeptNameByDeptId(schedule.getDeptId());
        orderItem.setDeptName(deptName);

        String indexKey = "order:index:" + userId;
        stringRedisTemplate.delete(indexKey);

        orderProducer.produceOrderCreate(order, orderItem);

        // 发送订单超时取消延迟消息（30 分钟后检查支付状态）
        orderProducer.produceOrderTimeoutCancel(order.getId(), order.getOrderNo());

        log.info("订单创建成功 - orderNo: {}, userId: {}, docName: {}, amount: {}", 
                order.getOrderNo(), userId, schedule.getDocName(), schedule.getDocFee());
    
        return Result.SUCCESS;
    }

    
    /**
     * 根据科室 ID 映射科室名称
     * @param deptId 科室 ID
     * @return 科室名称
     */
    private String getDeptNameByDeptId(String deptId) {
        if (deptId == null) return "未知科室";
        switch (deptId) {
            case "100": return "内科";
            case "101": return "外科";
            case "102": return "儿科";
            case "103": return "妇产科";
            case "104": return "眼科";
            case "105": return "口腔科";
            case "106": return "耳鼻喉科";
            case "107": return "皮肤科";
            case "108": return "中医科";
            case "109": return "骨科";
            default: return "其他科室";
        }
    }
    
    // 压力测试基线接口（已注释）
    // @Override
    // @BusinessLog(value = "创建订单（DB 同步）", type = "订单管理")
    // public Result createOrderDb(Long userId, Long patientId, Long scheduleId) {
    //
    //     // 1. DB 直接预扣号源
    //     Result deductResult = doctorFeignClient.deductAvailableNumDb(scheduleId);
    //     if (deductResult != Result.SUCCESS) return Result.FALSE;
    //
    //     // 2. 获取病人信息
    //     List<PatientDTO> patients = userFeignClient.getPatients(userId);
    //     PatientDTO patient = patients.stream()
    //             .filter(p -> p.getId().equals(patientId))
    //             .findFirst()
    //             .orElse(null);
    //     if (patient == null) return Result.FALSE;
    //
    //     // 3. 按排班 ID 查排班
    //     ScheduleDetailDTO schedule = doctorFeignClient.findScheduleDetailById(scheduleId);
    //     if (schedule == null) return Result.FALSE;
    //
    //     // 4. 组装 Order
    //     Order order = new Order();
    //     // 使用较小的随机数范围，避免超过 JavaScript Number.MAX_SAFE_INTEGER (9007199254740991)
    //     order.setId(ThreadLocalRandom.current().nextLong(1, 9007199254740991L));
    //     order.setOrderNo("ORD" + IdWorker.getIdStr());
    //     order.setUserId(userId);
    //     order.setAmount(schedule.getDocFee());
    //     order.setStatus(0);
    //     order.setCreateTime(LocalDateTime.now());
    //     order.setUpdateTime(LocalDateTime.now());
    //
    //     // 5. 组装 OrderItem
    //     OrderItem orderItem = new OrderItem();
    //     orderItem.setPatientName(patient.getName());
    //     orderItem.setPatientIdCard(patient.getIdCard());
    //     orderItem.setPatientPhone(patient.getPhone());
    //     orderItem.setScheduleId(scheduleId);
    //     orderItem.setDocId(schedule.getDocId());
    //     orderItem.setDocName(schedule.getDocName());
    //     orderItem.setDocTitle(schedule.getDocTitle());
    //     orderItem.setWorkDate(schedule.getWorkDate());
    //     orderItem.setDeptName(getDeptNameByDeptId(schedule.getDeptId()));
    //
    //     // 6. 同步写入 DB
    //     Result createResult = orderHandler.createOrder(order, orderItem);
    //     if (createResult != Result.SUCCESS) {
    //         return Result.FALSE;
    //     }
    //
    //     return Result.SUCCESS;
    // }
    // ============================
    
    @Override
    @BusinessLog(value = "查询用户订单列表", type = "订单查询")
    public List<OrderDetailDTO> getOrders(String userId) {
        String indexKey = "order:index:" + userId;
        long now = System.currentTimeMillis();

        Set<String> orderIds = stringRedisTemplate.opsForZSet()
                .rangeByScore(indexKey, now, Double.MAX_VALUE);

        if (orderIds != null && !orderIds.isEmpty()) {
            List<String> detailKeys = orderIds.stream()
                    .map(id -> "order:detail:" + id)
                    .collect(Collectors.toList());
            List<String> values = stringRedisTemplate.opsForValue().multiGet(detailKeys);
            if (values != null) {
                List<OrderDetailDTO> result = values.stream()
                        .filter(v -> v != null)
                        .map(v -> JSON.parseObject(v, OrderDetailDTO.class))
                        .collect(Collectors.toList());
                if (!result.isEmpty()) return result;
            }
        }

        // 从数据库查询并组装数据
        List<Order> orders = orderMapper.selectList(
                new LambdaQueryWrapper<Order>().eq(Order::getUserId, userId));
        
        if (!orders.isEmpty()) {
            List<OrderDetailDTO> resultList = new ArrayList<>();
            long expireAt = now + TimeUnit.HOURS.toMillis(2);
            
            // 先收集所有的 scheduleId
            List<String> scheduleIds = new ArrayList<>();
            Map<String, OrderItem> orderItemMap = new HashMap<>();
            
            for (Order o : orders) {
                OrderItem orderItem = orderItemMapper.selectOne(
                        new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, o.getId()));
                
                if (orderItem != null && orderItem.getScheduleId() != null) {
                    scheduleIds.add(orderItem.getScheduleId());
                    orderItemMap.put(o.getId(), orderItem);
                }
            }
            
            // 批量从 Redis 获取所有号源数量（一次 MGET）
            Map<String, Integer> availableNumMap = getAvailableNumBatchFromRedis(scheduleIds);
            
            // 组装结果
            for (Order o : orders) {
                OrderItem orderItem = orderItemMap.get(o.getId());
                if (orderItem == null) continue;
                
                Integer availableNum = availableNumMap.get(orderItem.getScheduleId());
                
                OrderDetailDTO dto = new OrderDetailDTO();
                dto.setOrder(o);
                dto.setOrderItem(orderItem);
                dto.setAvailableNum(availableNum);
                resultList.add(dto);
                
                // 缓存订单详情（包含实时库存）
                stringRedisTemplate.opsForValue().set(
                        "order:detail:" + o.getId(), JSON.toJSONString(dto), 2, TimeUnit.HOURS);
                stringRedisTemplate.opsForZSet().add(indexKey, o.getId().toString(), expireAt);
            }
            stringRedisTemplate.expire(indexKey, 3, TimeUnit.HOURS);
            return resultList;
        }
        
        return new ArrayList<>();
    }

    @Override
    @BusinessLog(value = "查询订单详情", type = "订单查询")
    public OrderDetailDTO getOrderDetail(String orderId) {
        String redisKey = "order:detail:" + orderId;

        String cached = stringRedisTemplate.opsForValue().get(redisKey);
        if (cached != null) {
            OrderDetailDTO cachedDto = JSON.parseObject(cached, OrderDetailDTO.class);
            // 从 Redis 获取最新库存（缓存中的库存可能过期）
            if (cachedDto.getOrderItem() != null && cachedDto.getOrderItem().getScheduleId() != null) {
                Integer latestAvailableNum = getAvailableNumFromRedis(cachedDto.getOrderItem().getScheduleId());
                cachedDto.setAvailableNum(latestAvailableNum);
            }
            return cachedDto;
        }

        Order order = orderMapper.selectById(orderId);
        if (order == null) throw new RuntimeException("订单不存在");
        OrderItem orderItem = orderItemMapper.selectOne(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));

        // 从 Redis 获取实时号源数量
        Integer availableNum = getAvailableNumFromRedis(orderItem.getScheduleId());

        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrder(order);
        dto.setOrderItem(orderItem);
        dto.setAvailableNum(availableNum);

        stringRedisTemplate.opsForValue().set(redisKey, JSON.toJSONString(dto), 2, TimeUnit.HOURS);
        return dto;
    }
    
    /**
     * 批量从 Redis 获取排班的实时号源数量（使用 MGET 优化）
     * @param scheduleIds 排班 ID 列表
     * @return Map<scheduleId, availableNum>  scheduleId -> 剩余号源数量的映射
     */
    private Map<String, Integer> getAvailableNumBatchFromRedis(List<String> scheduleIds) {
        Map<String, Integer> resultMap = new HashMap<>();
        
        if (scheduleIds == null || scheduleIds.isEmpty()) {
            return resultMap;
        }
        
        // 构建所有的 key
        List<String> keys = scheduleIds.stream()
                .map(id -> "schedule:num:" + id)
                .collect(Collectors.toList());
        
        // 一次 MGET 获取所有值
        List<String> values = stringRedisTemplate.opsForValue().multiGet(keys);
        
        // 建立 scheduleId -> availableNum 的映射
        Map<String, Integer> scheduleNumMap = new HashMap<>();
        for (int i = 0; i < scheduleIds.size(); i++) {
            String scheduleId = scheduleIds.get(i);
            String numStr = (values != null && i < values.size()) ? values.get(i) : null;
            
            if (numStr != null) {
                try {
                    scheduleNumMap.put(scheduleId, Integer.parseInt(numStr));
                } catch (NumberFormatException e) {
                    log.warn("解析号源数量失败 - scheduleId: {}, value: {}", scheduleId, numStr);
                }
            }
        }
        
        return scheduleNumMap;
    }
    
    /**
     * 从 Redis 获取排班的实时号源数量
     * @param scheduleId 排班 ID
     * @return 剩余号源数量
     */
    private Integer getAvailableNumFromRedis(String scheduleId) {
        if (scheduleId == null) return null;
        
        String numKey = "schedule:num:" + scheduleId;
        String numStr = stringRedisTemplate.opsForValue().get(numKey);
        
        if (numStr != null) {
            try {
                return Integer.parseInt(numStr);
            } catch (NumberFormatException e) {
                log.warn("解析号源数量失败 - scheduleId: {}, value: {}", scheduleId, numStr);
                return null;
            }
        }
        
        // 如果 Redis 中没有，返回 null（或者可以从 DB 查询）
        return null;
    }
    
    @Override
    public void cancelUnpaidOrder(String orderId) {
        log.info("开始检查订单支付状态 - orderId: {}", orderId);

        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            log.error("订单不存在 - orderId: {}", orderId);
            return;
        }

        log.info("订单信息 - orderNo: {}, status: {}", order.getOrderNo(), order.getStatus());

        // 只取消待支付订单
        if (order.getStatus() != 0) {
            log.info("订单已支付或已取消，无需处理 - orderId: {}", orderId);
            return;
        }

        // 标记状态为 -1（已取消）
        order.setStatus(-1);
        order.setUpdateTime(LocalDateTime.now());
        int rows = orderMapper.updateById(order);

        if (rows > 0) {
            log.info("订单状态已更新为 -1（已取消）- orderId: {}", orderId);

            // 释放号源
            try {
                OrderItem orderItem = orderItemMapper.selectOne(
                        new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));
                if (orderItem != null && orderItem.getScheduleId() != null) {
                    doctorFeignClient.releaseAvailableNum(orderItem.getScheduleId(), 1);
                    log.info("已释放号源 - scheduleId: {}", orderItem.getScheduleId());
                }
            } catch (Exception e) {
                log.error("释放号源失败", e);
            }

            // 清除缓存
            stringRedisTemplate.delete("order:index:" + order.getUserId());
            stringRedisTemplate.delete("order:detail:" + orderId);
            log.info("已清除订单缓存 - orderId: {}", orderId);
            log.info("订单取消完成 - orderId: {}\n", orderId);
        } else {
            log.error("订单状态更新失败 - orderId: {}", orderId);
        }
    }
    
    @Override
    public Result cancelOrder(String userId, String orderId) {
        // 1. 查询订单
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            System.err.println("[cancelOrder] 订单不存在: " + orderId);
            return Result.FALSE;
        }

        // 2. 权限校验
        if (!order.getUserId().equals(userId)) {
            System.err.println("[cancelOrder] 无权限取消他人订单: orderId=" + orderId + ", userId=" + userId);
            return Result.FALSE;
        }

        // 3. 只能取消待支付订单
        if (order.getStatus() != 0) {
            System.err.println("[cancelOrder] 订单状态不允许取消: status=" + order.getStatus());
            return Result.FALSE;
        }

        // 4. 标记状态为 -1（已取消）
        order.setStatus(-1);
        order.setUpdateTime(LocalDateTime.now());
        int rows = orderMapper.updateById(order);
        if (rows <= 0) {
            System.err.println("[cancelOrder] 更新订单状态失败");
            return Result.FALSE;
        }

        // 5. 释放号源
        try {
            OrderItem orderItem = orderItemMapper.selectOne(
                    new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));
            if (orderItem != null && orderItem.getScheduleId() != null) {
                doctorFeignClient.releaseAvailableNum(orderItem.getScheduleId(), 1);
                System.out.println("[cancelOrder] 已释放号源: scheduleId=" + orderItem.getScheduleId());
            }
        } catch (Exception e) {
            System.err.println("[cancelOrder] 释放号源失败: " + e.getMessage());
        }

        // 6. 清除缓存
        stringRedisTemplate.delete("order:index:" + userId);
        stringRedisTemplate.delete("order:detail:" + orderId);
        System.out.println("[cancelOrder] 订单已取消: orderId=" + orderId);
        return Result.SUCCESS;
    }
}
