SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
-- 创建数据库
CREATE DATABASE IF NOT EXISTS `doctor-service` CHARACTER SET utf8mb4;
USE `doctor-service`;

-- 1. 医生基础表
CREATE TABLE `yy_doctor` (
                             `id` VARCHAR(50) PRIMARY KEY COMMENT '医生 ID',
                             `dept_id` VARCHAR(50) NOT NULL COMMENT '所属科室 ID',
                             `name` VARCHAR(50) NOT NULL COMMENT '姓名',
                             `title` VARCHAR(20) COMMENT '职称',
                             `fee` DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '挂号费',
                             `status` TINYINT DEFAULT 1 COMMENT '状态'
) ENGINE=InnoDB;

-- 2. 排班规则表
CREATE TABLE `yy_schedule_rule` (
                                    `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
                                    `doc_id` VARCHAR(50) NOT NULL,
                                    `day_of_week` TINYINT NOT NULL,
                                    `max_count` INT NOT NULL DEFAULT 30,
                                    UNIQUE KEY `uk_doc_day` (`doc_id`, `day_of_week`),
    -- 内部外键：确保规则必须属于存在的医生
                                    CONSTRAINT `fk_rule_doc` FOREIGN KEY (`doc_id`) REFERENCES `yy_doctor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 3. 每日号源表
CREATE TABLE `yy_schedule` (
                               `id` BIGINT PRIMARY KEY,
                               `doc_id` VARCHAR(50) NOT NULL,
                               `work_date` DATE NOT NULL,
                               `available_num` INT NOT NULL,
                               `status` TINYINT DEFAULT 1,
                               UNIQUE KEY `uk_doc_date` (`doc_id`, `work_date`),
    -- 内部外键：确保号源必须属于存在的医生
                               CONSTRAINT `fk_sched_doc` FOREIGN KEY (`doc_id`) REFERENCES `yy_doctor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. 擅长标签字典表（统一管理所有关键词）
CREATE TABLE `yy_specialty_dict` (
                                     `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
                                     `name` VARCHAR(100) NOT NULL COMMENT '标签名称',
                                     `category` VARCHAR(50) DEFAULT NULL COMMENT '所属分类（如：心血管、呼吸等）',
                                     `sort_order` INT DEFAULT 0 COMMENT '排序权重',
                                     `is_active` TINYINT DEFAULT 1 COMMENT '是否启用：0-禁用，1-启用',
                                     `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                     `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
                                     UNIQUE KEY `uk_name` (`name`),
                                     INDEX `idx_category` (`category`),
                                     INDEX `idx_sort` (`sort_order`)
) ENGINE=InnoDB COMMENT='擅长标签字典表';

-- 5. 医生擅长标签关联表
CREATE TABLE `yy_doctor_specialty` (
                                       `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
                                       `doc_id` VARCHAR(50) NOT NULL COMMENT '医生 ID（外键关联 yy_doctor.id）',
                                       `specialty_id` BIGINT NOT NULL COMMENT '擅长标签 ID（外键关联 yy_specialty_dict.id）',
                                       `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                                       UNIQUE KEY `uk_doc_specialty` (`doc_id`, `specialty_id`),
                                       INDEX `idx_specialty_id` (`specialty_id`),
    -- 外键约束：确保擅长标签必须属于存在的医生
                                       CONSTRAINT `fk_specialty_doc` FOREIGN KEY (`doc_id`) REFERENCES `yy_doctor` (`id`) ON DELETE CASCADE,
                                       CONSTRAINT `fk_specialty_dict` FOREIGN KEY (`specialty_id`) REFERENCES `yy_specialty_dict` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='医生擅长标签关联表';


USE `doctor-service`;

-- 初始化标签字典数据（按科室分类）
-- 心血管类
INSERT INTO `yy_specialty_dict` (`name`, `category`, `sort_order`) VALUES
('高血压', '心血管', 1), ('冠心病', '心血管', 2), ('心律失常', '心血管', 3), 
('心力衰竭', '心血管', 4), ('心悸', '心血管', 5);

-- 呼吸类
INSERT INTO `yy_specialty_dict` (`name`, `category`, `sort_order`) VALUES
('感冒', '呼吸', 1), ('咳嗽', '呼吸', 2), ('肺炎', '呼吸', 3), 
('呼吸道感染', '呼吸', 4), ('发热', '呼吸', 5), ('哮喘', '呼吸', 6);

-- 消化类
INSERT INTO `yy_specialty_dict` (`name`, `category`, `sort_order`) VALUES
('胃炎', '消化', 1), ('胃溃疡', '消化', 2), ('消化不良', '消化', 3), 
('幽门螺杆菌', '消化', 4), ('肝炎', '消化', 5), ('肝硬化', '消化', 6);

-- 内分泌类
INSERT INTO `yy_specialty_dict` (`name`, `category`, `sort_order`) VALUES
('糖尿病', '内分泌', 1), ('甲状腺疾病', '内分泌', 2), ('肥胖症', '内分泌', 3), 
('痛风', '内分泌', 4), ('高血脂', '内分泌', 5);

-- 神经内科类
INSERT INTO `yy_specialty_dict` (`name`, `category`, `sort_order`) VALUES
('头痛', '神经内科', 1), ('失眠', '神经内科', 2), ('脑血管病', '神经内科', 3), 
('头晕', '神经内科', 4), ('癫痫', '神经内科', 5);

-- 插入 5 个科室的医生数据
-- 科室 101: 心血管内科
INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
('2001', '101', '张志强', '主任医师', 80.00, 1),
('2002', '101', '李明华', '副主任医师', 50.00, 1),
('2003', '101', '王晓芳', '主治医师', 30.00, 1);

-- 科室 102: 呼吸内科
INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
('2004', '102', '刘建军', '主任医师', 80.00, 1),
('2005', '102', '陈静', '副主任医师', 50.00, 1),
('2006', '102', '赵伟', '主治医师', 30.00, 1);

-- 科室 103: 消化内科
INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
('2007', '103', '孙秀英', '主任医师', 80.00, 1),
('2008', '103', '周强', '副主任医师', 50.00, 1),
('2009', '103', '吴敏', '主治医师', 30.00, 1);

-- 科室 104: 内分泌科
INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
('2010', '104', '郑建华', '主任医师', 80.00, 1),
('2011', '104', '冯丽', '副主任医师', 50.00, 1),
('2012', '104', '何勇', '主治医师', 30.00, 1);

-- 科室 105: 神经内科
INSERT INTO `yy_doctor` (`id`, `dept_id`, `name`, `title`, `fee`, `status`) VALUES
('2013', '105', '高建华', '主任医师', 80.00, 1),
('2014', '105', '徐红梅', '副主任医师', 50.00, 1),
('2015', '105', '马超', '主治医师', 30.00, 1);

-- 插入医生的擅长标签（通过标签名称关联字典表）
-- 心血管内科医生
INSERT INTO `yy_doctor_specialty` (`doc_id`, `specialty_id`) VALUES
('2001', (SELECT id FROM yy_specialty_dict WHERE name='高血压')),
('2001', (SELECT id FROM yy_specialty_dict WHERE name='冠心病')),
('2001', (SELECT id FROM yy_specialty_dict WHERE name='心律失常')),
('2001', (SELECT id FROM yy_specialty_dict WHERE name='心力衰竭')),
('2002', (SELECT id FROM yy_specialty_dict WHERE name='高血压')),
('2002', (SELECT id FROM yy_specialty_dict WHERE name='糖尿病')),
('2002', (SELECT id FROM yy_specialty_dict WHERE name='冠心病')),
('2003', (SELECT id FROM yy_specialty_dict WHERE name='高血压')),
('2003', (SELECT id FROM yy_specialty_dict WHERE name='心律失常'));

-- 呼吸内科医生
INSERT INTO `yy_doctor_specialty` (`doc_id`, `specialty_id`) VALUES
('2004', (SELECT id FROM yy_specialty_dict WHERE name='感冒')),
('2004', (SELECT id FROM yy_specialty_dict WHERE name='咳嗽')),
('2004', (SELECT id FROM yy_specialty_dict WHERE name='肺炎')),
('2004', (SELECT id FROM yy_specialty_dict WHERE name='呼吸道感染')),
('2005', (SELECT id FROM yy_specialty_dict WHERE name='发热')),
('2005', (SELECT id FROM yy_specialty_dict WHERE name='咳嗽')),
('2005', (SELECT id FROM yy_specialty_dict WHERE name='呼吸道感染')),
('2006', (SELECT id FROM yy_specialty_dict WHERE name='感冒')),
('2006', (SELECT id FROM yy_specialty_dict WHERE name='肺炎'));

-- 消化内科医生
INSERT INTO `yy_doctor_specialty` (`doc_id`, `specialty_id`) VALUES
('2007', (SELECT id FROM yy_specialty_dict WHERE name='胃炎')),
('2007', (SELECT id FROM yy_specialty_dict WHERE name='胃溃疡')),
('2007', (SELECT id FROM yy_specialty_dict WHERE name='消化不良')),
('2007', (SELECT id FROM yy_specialty_dict WHERE name='幽门螺杆菌')),
('2008', (SELECT id FROM yy_specialty_dict WHERE name='胃炎')),
('2008', (SELECT id FROM yy_specialty_dict WHERE name='胃溃疡')),
('2008', (SELECT id FROM yy_specialty_dict WHERE name='肝炎')),
('2009', (SELECT id FROM yy_specialty_dict WHERE name='消化不良')),
('2009', (SELECT id FROM yy_specialty_dict WHERE name='胃炎'));

-- 内分泌科医生
INSERT INTO `yy_doctor_specialty` (`doc_id`, `specialty_id`) VALUES
('2010', (SELECT id FROM yy_specialty_dict WHERE name='糖尿病')),
('2010', (SELECT id FROM yy_specialty_dict WHERE name='高血压')),
('2010', (SELECT id FROM yy_specialty_dict WHERE name='甲状腺疾病')),
('2011', (SELECT id FROM yy_specialty_dict WHERE name='糖尿病')),
('2011', (SELECT id FROM yy_specialty_dict WHERE name='肥胖症')),
('2012', (SELECT id FROM yy_specialty_dict WHERE name='糖尿病')),
('2012', (SELECT id FROM yy_specialty_dict WHERE name='痛风'));

-- 神经内科医生
INSERT INTO `yy_doctor_specialty` (`doc_id`, `specialty_id`) VALUES
('2013', (SELECT id FROM yy_specialty_dict WHERE name='头痛')),
('2013', (SELECT id FROM yy_specialty_dict WHERE name='失眠')),
('2013', (SELECT id FROM yy_specialty_dict WHERE name='脑血管病')),
('2014', (SELECT id FROM yy_specialty_dict WHERE name='头痛')),
('2014', (SELECT id FROM yy_specialty_dict WHERE name='头晕')),
('2015', (SELECT id FROM yy_specialty_dict WHERE name='失眠')),
('2015', (SELECT id FROM yy_specialty_dict WHERE name='脑血管病'));
