package com.cly.orderservice.controller;

import com.cly.orderservice.entity.Order;
import com.cly.orderservice.entity.OrderItem;
import com.cly.orderservice.result.Result;
import com.cly.orderservice.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("order")
public class OrderController {

    OrderService orderService;

    @Autowired
    public void setOrderService(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("order/create")
    public Result createOrder(@RequestBody Map<String, Object> body) {
        Order order = com.alibaba.fastjson.JSON.parseObject(
                com.alibaba.fastjson.JSON.toJSONString(body.get("order")), Order.class);
        OrderItem orderItem = com.alibaba.fastjson.JSON.parseObject(
                com.alibaba.fastjson.JSON.toJSONString(body.get("orderItem")), OrderItem.class);
        return orderService.createOrder(order, orderItem);
    }
}
