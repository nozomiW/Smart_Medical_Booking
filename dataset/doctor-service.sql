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


USE `doctor-service`;

DELIMITER $$

DROP PROCEDURE IF EXISTS InitDoctorData;
CREATE PROCEDURE InitDoctorData()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE doc_id BIGINT;
    DECLARE random_dept INT;
    DECLARE random_title VARCHAR(20);
    DECLARE random_fee DECIMAL(10,2);
    DECLARE day_idx INT;
    DECLARE work_day INT;
    DECLARE schedule_id BIGINT;
    DECLARE base_date DATE DEFAULT '2026-03-25'; -- 设置从明天开始排班

    -- 开启事务保证效率
    START TRANSACTION;

    WHILE i <= 100 DO
            SET doc_id = 2000 + i; -- 医生ID从2001开始，避开你手动插入的100x
            SET random_dept = 100 + (i % 10); -- 模拟10个科室 (100-109)

            -- 随机分配职称和挂号费
            CASE (i % 4)
                WHEN 0 THEN SET random_title = '首席专家', random_fee = 150.00;
                WHEN 1 THEN SET random_title = '主任医师', random_fee = 80.00;
                WHEN 2 THEN SET random_title = '副主任医师', random_fee = 50.00;
                ELSE SET random_title = '主治医师', random_fee = 30.00;
                END CASE;

            -- 1. 插入医生基础表
            INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`)
            VALUES (doc_id, random_dept, CONCAT('医生_', i), random_title, random_fee, 1);

            -- 2. 为每个医生随机生成 2-3 天的排班规则 (周一至周日)
            SET work_day = (i % 7) + 1; -- 保证每个医生至少有一天
            INSERT IGNORE INTO `yy_schedule_rule` (`doc_id`, `day_of_week`, `max_count`)
            VALUES (doc_id, work_day, 40);

            -- 额外增加一天排班，增加数据密度
            INSERT IGNORE INTO `yy_schedule_rule` (`doc_id`, `day_of_week`, `max_count`)
            VALUES (doc_id, ((work_day + 2) % 7) + 1, 30);

            -- 3. 生成未来 7 天的具体号源 (yy_schedule)
            SET day_idx = 0;
            WHILE day_idx < 30 DO
                    SET @target_date = DATE_ADD(base_date, INTERVAL day_idx DAY);
                    SET @target_week_day = DAYOFWEEK(@target_date) - 1;
                    IF @target_week_day = 0 THEN SET @target_week_day = 7; END IF;

                    -- 如果当天符合医生的排班规则，则生成号源
                    IF EXISTS (SELECT 1 FROM `yy_schedule_rule` WHERE `doc_id` = doc_id AND `day_of_week` = @target_week_day) THEN
                        -- 生成号源ID: 日期(8位) + 医生ID(4位)
                        SET schedule_id = CAST(CONCAT(DATE_FORMAT(@target_date, '%Y%m%d'), doc_id) AS UNSIGNED);
                        INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`)
                        VALUES (schedule_id, doc_id, @target_date, 30, 1);
                    END IF;

                    SET day_idx = day_idx + 1;
                END WHILE;

            SET i = i + 1;
        END WHILE;

    COMMIT;
END$$

DELIMITER ;

CALL InitDoctorData();