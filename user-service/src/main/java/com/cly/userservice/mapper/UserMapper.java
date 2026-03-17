package com.cly.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.userservice.entity.User;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface UserMapper extends BaseMapper<User> {
}
