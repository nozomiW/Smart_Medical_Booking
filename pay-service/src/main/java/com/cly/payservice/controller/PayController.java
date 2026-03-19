package com.cly.payservice.controller;

import com.cly.payservice.result.Result;
import com.cly.payservice.service.PayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("pay")
public class PayController {

    private PayService payService;

    @Autowired
    public void setPayService(PayService payService) {
        this.payService = payService;
    }

    @PostMapping
    public Result pay(@RequestParam Long orderId) {
        return payService.pay(orderId);
    }
}
