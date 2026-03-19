package com.cly.orderservice.controller;

import com.cly.orderservice.dto.OrderDetailDTO;
import com.cly.orderservice.entity.Order;
import com.cly.orderservice.result.Result;
import com.cly.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("order")
public class OrderController {

    OrderService orderService;

    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("create")
    public Result createOrder(@RequestHeader("X-User-Id") Long userId,
                              @RequestParam Long patientId,
                              @RequestParam Long scheduleId) {
        return orderService.createOrder(userId, patientId, scheduleId);
    }

    @GetMapping("list")
    public List<Order> getOrders(@RequestHeader("X-User-Id") Long userId) {
        return orderService.getOrders(userId);
    }

    @GetMapping("detail")
    public OrderDetailDTO getOrderDetail(@RequestParam Long orderId) {
        return orderService.getOrderDetail(orderId);
    }

}
