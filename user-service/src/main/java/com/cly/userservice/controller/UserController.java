package com.cly.userservice.controller;

import com.cly.userservice.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("user")
public class UserController {

    UserService userService;

    @Autowired
    public void setUserService(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("register")
    public String register(@RequestBody Map<String, String> body) {
        userService.register(body.get("phone"), body.get("password"));
        return "注册成功";
    }

    @PostMapping("login")
    public String login(@RequestBody Map<String, String> body) {
        return userService.login(body.get("phone"), body.get("password"));
    }
}
