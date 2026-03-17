package com.cly.userservice.service;

public interface UserService {
    String login(String phone, String password);
    void register(String phone, String password);
}
