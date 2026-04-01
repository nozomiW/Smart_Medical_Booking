package com.cly.aiservice.feign;

import com.cly.aiservice.result.Result;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 订单服务 Feign 客户端
 */
@FeignClient(name = "order-service")
public interface OrderFeignClient {

    /**
     * 创建订单
     */
    @PostMapping("/order/create")
    Result<OrderDTO> createOrder(
        @RequestParam String patientId,
        @RequestParam String scheduleId,
        @RequestHeader("X-User-Id") String userId
    );

    /**
     * 订单 DTO
     */
    class OrderDTO {
        private String id;
        private String orderNo;
        private String userId;
        private Double amount;
        private Integer status;
        private String createTime;

        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getOrderNo() { return orderNo; }
        public void setOrderNo(String orderNo) { this.orderNo = orderNo; }
        public String getUserId() { return userId; }
        public void setUserId(String userId) { this.userId = userId; }
        public Double getAmount() { return amount; }
        public void setAmount(Double amount) { this.amount = amount; }
        public Integer getStatus() { return status; }
        public void setStatus(Integer status) { this.status = status; }
        public String getCreateTime() { return createTime; }
        public void setCreateTime(String createTime) { this.createTime = createTime; }
    }
}
