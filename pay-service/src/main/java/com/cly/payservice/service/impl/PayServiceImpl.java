package com.cly.payservice.service.impl;

import com.cly.payservice.dto.OrderDetailDTO;
import com.cly.payservice.feign.OrderFeignClient;
import com.cly.payservice.mq.producer.PayProducer;
import com.cly.payservice.result.Result;
import com.cly.payservice.service.PayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PayServiceImpl implements PayService {

    private OrderFeignClient orderFeignClient;
    private PayProducer payProducer;

    @Autowired
    public void setOrderFeignClient(OrderFeignClient orderFeignClient) {
        this.orderFeignClient = orderFeignClient;
    }

    @Autowired
    public void setPayProducer(PayProducer payProducer) {
        this.payProducer = payProducer;
    }

    @Override
    public Result pay(Long orderId) {
        OrderDetailDTO detail = orderFeignClient.getOrderDetail(orderId);
        if (detail == null || detail.getOrder() == null) throw new RuntimeException("订单不存在");
        if (detail.getOrder().getStatus() != 0) throw new RuntimeException("订单状态异常");

        payProducer.producePaySuccess(orderId);

        return Result.SUCCESS;
    }
}
