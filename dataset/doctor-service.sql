-- 创建数据库
CREATE DATABASE IF NOT EXISTS `doctor-service` CHARACTER SET utf8mb4;
USE `doctor-service`;

-- 1. 医生基础表
CREATE TABLE `yy_doctor` (
                             `id` BIGINT PRIMARY KEY COMMENT '医生ID',
                             `dept_id` BIGINT NOT NULL COMMENT '所属科室ID',
                             `name` VARCHAR(50) NOT NULL COMMENT '姓名',
                             `title` VARCHAR(20) COMMENT '职称',
                             `fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '挂号费',
                             `status` TINYINT DEFAULT 1 COMMENT '状态'
) ENGINE=InnoDB;

-- 2. 排班规则表
CREATE TABLE `yy_schedule_rule` (
                                    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    `doc_id` BIGINT NOT NULL,
                                    `day_of_week` TINYINT NOT NULL,
                                    `max_count` INT NOT NULL DEFAULT 30,
                                    UNIQUE KEY `uk_doc_day` (`doc_id`, `day_of_week`),
    -- 内部外键：确保规则必须属于存在的医生
                                    CONSTRAINT `fk_rule_doc` FOREIGN KEY (`doc_id`) REFERENCES `yy_doctor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. 每日号源表
CREATE TABLE `yy_schedule` (
                               `id` BIGINT PRIMARY KEY,
                               `doc_id` BIGINT NOT NULL,
                               `work_date` DATE NOT NULL,
                               `available_num` INT NOT NULL,
                               `status` TINYINT DEFAULT 1,
                               UNIQUE KEY `uk_doc_date` (`doc_id`, `work_date`),
    -- 内部外键：确保号源必须属于存在的医生
                               CONSTRAINT `fk_sched_doc` FOREIGN KEY (`doc_id`) REFERENCES `yy_doctor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;


INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
                                                                                (1001, 101, '孙思邈', '首席专家', 100.00, 1),
                                                                                (1002, 101, '李时珍', '主任医师', 80.00, 1),
                                                                                (1003, 102, '扁鹊', '主任医师', 80.00, 1),
                                                                                (1004, 102, '董奉', '副主任医师', 50.00, 1),
                                                                                (1005, 103, '钱乙', '主任医师', 70.00, 1),
                                                                                (1006, 101, '叶天士', '副主任医师', 50.00, 1),
                                                                                (1007, 103, '吴瑭', '主治医师', 30.00, 1),
                                                                                (1008, 102, '葛洪', '主治医师', 30.00, 1);

INSERT INTO `yy_schedule_rule` (`doc_id`, `day_of_week`, `max_count`) VALUES
                                                                          (1001, 1, 20), -- 孙思邈 周一 (限量专家号)
                                                                          (1001, 3, 20), -- 孙思邈 周三
                                                                          (1002, 2, 40), -- 李时珍 周二
                                                                          (1002, 5, 40), -- 李时珍 周五
                                                                          (1003, 1, 50), -- 扁鹊 周一
                                                                          (1003, 4, 50), -- 扁鹊 周四
                                                                          (1004, 2, 30), -- 董奉 周二
                                                                          (1005, 3, 60), -- 钱乙 周三 (儿科通常号多)
                                                                             (1006, 6, 40), -- 叶天士 周六 (周末加班)
                                                                          (1007, 7, 40), -- 吴瑭 周日
                                                                          (1008, 5, 30); -- 葛洪 周五


INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
                                                                                       (202603161001, 1001, '2026-03-16', 20, 1), -- 孙思邈 下周一号源
                                                                                       (202603161003, 1003, '2026-03-16', 50, 1), -- 扁鹊 下周一号源
                                                                                       (202603171002, 1002, '2026-03-17', 40, 1), -- 李时珍 下周二号源
                                                                                       (202603171004, 1004, '2026-03-17', 30, 1), -- 董奉 下周二号源
                                                                                       (202603181005, 1005, '2026-03-18', 60, 1), -- 钱乙 下周三号源
                                                                                       (202603201008, 1008, '2026-03-20', 30, 1), -- 葛洪 下周五号源
                                                                                       (202603211006, 1006, '2026-03-21', 40, 1), -- 叶天士 下周六号源
                                                                                       (202603221007, 1007, '2026-03-22', 40, 1); -- 吴瑭 下周日号源