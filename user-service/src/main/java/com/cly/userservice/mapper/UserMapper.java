package com.cly.userservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.userservice.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper extends BaseMapper<User> {

    User selectByPhone(@Param("phone") String phone);

    List<User> selectByStatus(@Param("status") Integer status);

}
