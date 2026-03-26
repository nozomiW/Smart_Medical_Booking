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

INSERT INTO yy_doctor (id, dept_id, name, title, fee, status)
SELECT
    seq AS id,
    FLOOR(1 + RAND()*10) AS dept_id,
    CONCAT('医生', seq) AS name,
    ELT(FLOOR(1 + RAND()*4), '主任医师', '副主任医师', '主治医师', '住院医师') AS title,
    ROUND(10 + RAND()*40, 2) AS fee,
    1
FROM (
         SELECT @row := @row + 1 AS seq
         FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t1,
              (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t2,
              (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t3,
              (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) t4,
              (SELECT @row := 0) t0
         LIMIT 500
     ) t;

INSERT INTO yy_schedule_rule (doc_id, day_of_week, max_count)
SELECT
    d.id,
    dow.day,
    FLOOR(10 + RAND()*40)
FROM yy_doctor d
         JOIN (
    SELECT 1 AS day UNION ALL SELECT 2 UNION ALL SELECT 3
    UNION ALL SELECT 4 UNION ALL SELECT 5
) dow;

-- 确保在使用正确的数据库
USE `doctor-service`;

-- 清理可能存在的旧数据（可选）
-- TRUNCATE TABLE `yy_schedule`;

-- 使用递归 CTE 生成未来 30 天的号源并插入
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`)
WITH RECURSIVE dates AS (
    -- 1. 生成未来 30 天的日期序列
    SELECT CURDATE() AS dt
    UNION ALL
    SELECT DATE_ADD(dt, INTERVAL 1 DAY)
    FROM dates
    WHERE dt < DATE_ADD(CURDATE(), INTERVAL 29 DAY)
)
SELECT
    -- 2. 生成 ID：格式为 日期(8位) + 医生ID(补齐位)
    -- 示例：20260326 + 00001 = 2026032600001
    CAST(CONCAT(DATE_FORMAT(d.dt, '%Y%m%d'), LPAD(r.doc_id, 5, '0')) AS UNSIGNED) AS id,
    r.doc_id,
    d.dt AS work_date,
    r.max_count AS available_num,
    1 AS status
FROM dates d
         JOIN `yy_schedule_rule` r ON d.dt IS NOT NULL
-- 3. 核心逻辑：匹配日期对应的星期几 (DAYOFWEEK: 1=周日, 2=周一...7=周六)
-- 将其转换为你规则表中的 1(周一) 到 7(周日)
WHERE (CASE WHEN DAYOFWEEK(d.dt) = 1 THEN 7 ELSE DAYOFWEEK(d.dt) - 1 END) = r.day_of_week
-- 4. 避免重复插入
ON DUPLICATE KEY UPDATE available_num = VALUES(available_num);

---
-- 验证结果：查看生成了多少条号源记录
SELECT COUNT(*) AS '总号源数', MIN(work_date) AS '开始日期', MAX(work_date) AS '结束日期'
FROM `yy_schedule`;