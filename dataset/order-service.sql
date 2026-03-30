SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
-- 创建数据库
CREATE DATABASE IF NOT EXISTS order_service CHARACTER SET utf8mb4;
USE order_service;

CREATE TABLE `ord_order` (
                             `id` VARCHAR(50) PRIMARY KEY COMMENT '订单 ID',
                             `order_no` VARCHAR(50) UNIQUE NOT NULL COMMENT '订单号',
                             `user_id` VARCHAR(50) NOT NULL COMMENT '下单账号 ID',
                             `amount` DECIMAL(10, 2) NOT NULL COMMENT '实付总金额',
                             `status` TINYINT DEFAULT 0 COMMENT '状态: 0待付, 1已付, 2已就诊, -1取消',
                             `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                             `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                             INDEX `idx_user_id` (`user_id`),
                             INDEX `idx_status` (`status`)
) ENGINE=InnoDB COMMENT '订单主表';

CREATE TABLE `ord_order_item` (
                                  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                  `order_id` VARCHAR(50) NOT NULL COMMENT '关联主表 ID',

    -- 【就诊人信息快照】
                                  `patient_name` VARCHAR(50) NOT NULL,
                                  `patient_id_card` VARCHAR(50) NOT NULL,
                                  `patient_phone` VARCHAR(20),

    -- 【医生与号源信息快照】
                                  `schedule_id` VARCHAR(50) NOT NULL COMMENT '排班 ID',
                                  `doc_id` VARCHAR(50) NOT NULL,
                                  `doc_name` VARCHAR(50) NOT NULL,
                                  `doc_title` VARCHAR(20),
                                  `dept_name` VARCHAR(50),
                                  `work_date` DATE NOT NULL COMMENT '就诊日期',

    -- 约束：删除主表时自动清理详情
                                  CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `ord_order` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT '订单详情快照表';