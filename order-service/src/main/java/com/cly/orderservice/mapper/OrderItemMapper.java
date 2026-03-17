package com.cly.orderservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.orderservice.entity.OrderItem;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface OrderItemMapper extends BaseMapper<OrderItem> {
}
