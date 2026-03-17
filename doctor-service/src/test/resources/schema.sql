-- H2 测试库建表脚本（配合 application-test.yaml 的 spring.sql.init.* 自动执行）

-- 1) 医生基础表
CREATE TABLE yy_doctor (
  id BIGINT PRIMARY KEY,
  dept_id BIGINT NOT NULL,
  name VARCHAR(50) NOT NULL,
  title VARCHAR(20),
  fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  status TINYINT DEFAULT 1
);

-- 2) 排班规则表（某医生在周几出诊、最大号源数）
CREATE TABLE yy_schedule_rule (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  doc_id BIGINT NOT NULL,
  day_of_week TINYINT NOT NULL,
  max_count INT NOT NULL DEFAULT 30,
  CONSTRAINT uk_doc_day UNIQUE (doc_id, day_of_week),
  CONSTRAINT fk_rule_doc FOREIGN KEY (doc_id) REFERENCES yy_doctor (id) ON DELETE CASCADE
);

-- 3) 每日号源表（某天某医生的可用号源）
CREATE TABLE yy_schedule (
  id BIGINT PRIMARY KEY,
  doc_id BIGINT NOT NULL,
  work_date DATE NOT NULL,
  available_num INT NOT NULL,
  status TINYINT DEFAULT 1,
  CONSTRAINT uk_doc_date UNIQUE (doc_id, work_date),
  CONSTRAINT fk_sched_doc FOREIGN KEY (doc_id) REFERENCES yy_doctor (id) ON DELETE CASCADE
);
