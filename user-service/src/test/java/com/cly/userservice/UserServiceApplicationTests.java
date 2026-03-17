package com.cly.userservice;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest(properties = {
        // user-service 还未配置 datasource，先让最基础的 contextLoads 不依赖数据库启动
        "spring.autoconfigure.exclude=org.springframework.boot.jdbc.autoconfigure.DataSourceAutoConfiguration"
})
class UserServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
