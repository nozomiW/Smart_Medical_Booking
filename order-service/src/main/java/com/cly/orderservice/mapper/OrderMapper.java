package com.cly.orderservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.orderservice.entity.Order;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
}
