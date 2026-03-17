package com.cly.userservice.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.cly.userservice.entity.User;
import com.cly.userservice.mapper.UserMapper;
import com.cly.userservice.service.UserService;
import com.cly.userservice.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    UserMapper userMapper;

    @Autowired
    public void setUserMapper(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public String login(String phone, String password) {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone)
                .eq(User::getPassword, password));

        if (user == null) throw new RuntimeException("手机号或密码错误");
        if (user.getStatus() == 0) throw new RuntimeException("账号已被冻结");

        return JwtUtil.generate(user.getId());
    }

    @Override
    public void register(String phone, String password) {
        Long count = userMapper.selectCount(new LambdaQueryWrapper<User>()
                .eq(User::getPhone, phone));
        if (count > 0) throw new RuntimeException("手机号已注册");

        User user = new User();
        user.setPhone(phone);
        user.setPassword(password);
        user.setStatus(1);
        userMapper.insert(user);
    }
}
