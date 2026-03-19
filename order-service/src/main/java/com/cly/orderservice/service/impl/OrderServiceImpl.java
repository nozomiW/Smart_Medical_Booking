package com.cly.orderservice.service.impl;

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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class OrderServiceImpl implements OrderService {

    OrderProducer orderProducer;
    DoctorFeignClient doctorFeignClient;
    UserFeignClient userFeignClient;
    OrderMapper orderMapper;
    OrderItemMapper orderItemMapper;

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

    @Override
    public Result createOrder(Long userId, Long patientId, Long scheduleId, String workDate) {
        // 1. 获取病人信息
        List<PatientDTO> patients = userFeignClient.getPatients(userId);
        PatientDTO patient = patients.stream()
                .filter(p -> p.getId().equals(patientId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("病人不存在"));

        // 2. 按前端传入的 workDate 查排班，再按 scheduleId 匹配
        List<ScheduleDetailDTO> schedules = doctorFeignClient.findScheduleDetail(workDate);
        ScheduleDetailDTO schedule = schedules.stream()
                .filter(s -> s.getScheduleId().equals(scheduleId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("排班不存在"));

        // 3. 组装 Order
        Order order = new Order();
        order.setId(ThreadLocalRandom.current().nextLong(1, Long.MAX_VALUE));
        order.setOrderNo("ORD" + System.currentTimeMillis());
        order.setUserId(userId);
        order.setAmount(schedule.getDocFee());
        order.setStatus(0);
        order.setCreateTime(LocalDateTime.now());
        order.setUpdateTime(LocalDateTime.now());

        // 4. 组装 OrderItem
        OrderItem orderItem = new OrderItem();
        orderItem.setPatientName(patient.getName());
        orderItem.setPatientIdCard(patient.getIdCard());
        orderItem.setPatientPhone(patient.getPhone());
        orderItem.setScheduleId(scheduleId);
        orderItem.setDocId(schedule.getDocId());
        orderItem.setDocName(schedule.getDocName());
        orderItem.setDocTitle(schedule.getDocTitle());
        orderItem.setWorkDate(schedule.getWorkDate());

        orderProducer.produceOrderCreate(order, orderItem);
        return Result.SUCCESS;
    }

    @Override
    public List<Order> getOrders(Long userId) {
        return orderMapper.selectList(
                new LambdaQueryWrapper<Order>().eq(Order::getUserId, userId));
    }

    @Override
    public OrderDetailDTO getOrderDetail(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) throw new RuntimeException("订单不存在");
        OrderItem orderItem = orderItemMapper.selectOne(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrder(order);
        dto.setOrderItem(orderItem);
        return dto;
    }
}
