SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
CREATE DATABASE IF NOT EXISTS user_service CHARACTER SET utf8mb4;
USE user_service;

CREATE TABLE `uc_user` (
                           `id` BIGINT PRIMARY KEY COMMENT '用户账户ID',
                           `phone` VARCHAR(11) NOT NULL COMMENT '手机号(主要登录凭证)',
                           `password` VARCHAR(100) COMMENT '密码(如采用验证码登录可为空)',
                           `status` TINYINT NOT NULL DEFAULT 1 COMMENT '账号状态：0-冻结(黑名单), 1-正常',
                           `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
                           `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                           UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB COMMENT='用户账户表';

CREATE TABLE `uc_patient` (
                              `id` BIGINT PRIMARY KEY COMMENT '就诊人ID(档案号)',
                              `user_id` BIGINT NOT NULL COMMENT '所属账户ID(关联 yy_user.id)',
                              `name` VARCHAR(50) NOT NULL COMMENT '真实姓名',
                              `id_card` VARCHAR(18) NOT NULL COMMENT '身份证号',
                              `gender` TINYINT COMMENT '性别：0-女, 1-男',
                              `birth_date` DATE COMMENT '出生日期',
                              `phone` VARCHAR(11) COMMENT '就诊人联系电话',
                              `is_default` TINYINT DEFAULT 0 COMMENT '是否为默认就诊人：0-否, 1-是',
                              `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '建档时间',
                              `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                              UNIQUE KEY `uk_id_card` (`id_card`),
                              INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB COMMENT='就诊人档案表';