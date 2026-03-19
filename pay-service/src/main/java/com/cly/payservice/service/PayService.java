package com.cly.payservice.service;

import com.cly.payservice.result.Result;

public interface PayService {
    Result pay(Long orderId);
}
