-- ============================================
-- 生成未来一周的排班数据
-- 说明：为所有 15 位医生生成从明天开始连续 7 天的排班
-- 每天号源数：30 个
-- 排班 ID 使用雪花算法格式：日期 + 医生 ID + 序号
-- ============================================

USE `doctor-service`;

-- 设置起始日期为明天（如果需要修改日期，请更改 @start_date 的值）
SET @start_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY);

-- ============================================
-- 第 1 天
-- ============================================
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
-- 心血管内科
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2001, '2001', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2002, '2002', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2003, '2003', @start_date, 30, 1),
-- 呼吸内科
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2004, '2004', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2005, '2005', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2006, '2006', @start_date, 30, 1),
-- 消化内科
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2007, '2007', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2008, '2008', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2009, '2009', @start_date, 30, 1),
-- 内分泌科
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2010, '2010', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2011, '2011', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2012, '2012', @start_date, 30, 1),
-- 神经内科
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2013, '2013', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2014, '2014', @start_date, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@start_date, '%Y%m%d')) * 100000 + 2015, '2015', @start_date, 30, 1);

-- ============================================
-- 第 2 天
-- ============================================
SET @day2 = DATE_ADD(@start_date, INTERVAL 1 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2001, '2001', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2002, '2002', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2003, '2003', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2004, '2004', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2005, '2005', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2006, '2006', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2007, '2007', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2008, '2008', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2009, '2009', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2010, '2010', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2011, '2011', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2012, '2012', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2013, '2013', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2014, '2014', @day2, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day2, '%Y%m%d')) * 100000 + 2015, '2015', @day2, 30, 1);

-- ============================================
-- 第 3 天
-- ============================================
SET @day3 = DATE_ADD(@start_date, INTERVAL 2 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2001, '2001', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2002, '2002', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2003, '2003', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2004, '2004', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2005, '2005', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2006, '2006', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2007, '2007', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2008, '2008', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2009, '2009', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2010, '2010', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2011, '2011', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2012, '2012', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2013, '2013', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2014, '2014', @day3, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day3, '%Y%m%d')) * 100000 + 2015, '2015', @day3, 30, 1);

-- ============================================
-- 第 4 天
-- ============================================
SET @day4 = DATE_ADD(@start_date, INTERVAL 3 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2001, '2001', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2002, '2002', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2003, '2003', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2004, '2004', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2005, '2005', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2006, '2006', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2007, '2007', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2008, '2008', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2009, '2009', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2010, '2010', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2011, '2011', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2012, '2012', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2013, '2013', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2014, '2014', @day4, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day4, '%Y%m%d')) * 100000 + 2015, '2015', @day4, 30, 1);

-- ============================================
-- 第 5 天
-- ============================================
SET @day5 = DATE_ADD(@start_date, INTERVAL 4 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2001, '2001', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2002, '2002', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2003, '2003', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2004, '2004', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2005, '2005', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2006, '2006', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2007, '2007', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2008, '2008', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2009, '2009', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2010, '2010', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2011, '2011', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2012, '2012', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2013, '2013', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2014, '2014', @day5, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day5, '%Y%m%d')) * 100000 + 2015, '2015', @day5, 30, 1);

-- ============================================
-- 第 6 天
-- ============================================
SET @day6 = DATE_ADD(@start_date, INTERVAL 5 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2001, '2001', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2002, '2002', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2003, '2003', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2004, '2004', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2005, '2005', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2006, '2006', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2007, '2007', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2008, '2008', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2009, '2009', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2010, '2010', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2011, '2011', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2012, '2012', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2013, '2013', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2014, '2014', @day6, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day6, '%Y%m%d')) * 100000 + 2015, '2015', @day6, 30, 1);

-- ============================================
-- 第 7 天
-- ============================================
SET @day7 = DATE_ADD(@start_date, INTERVAL 6 DAY);
INSERT INTO `yy_schedule` (`id`, `doc_id`, `work_date`, `available_num`, `status`) VALUES
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2001, '2001', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2002, '2002', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2003, '2003', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2004, '2004', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2005, '2005', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2006, '2006', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2007, '2007', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2008, '2008', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2009, '2009', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2010, '2010', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2011, '2011', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2012, '2012', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2013, '2013', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2014, '2014', @day7, 30, 1),
(UNIX_TIMESTAMP(DATE_FORMAT(@day7, '%Y%m%d')) * 100000 + 2015, '2015', @day7, 30, 1);

-- ============================================
-- 查询验证：显示生成的排班数据
-- ============================================
SELECT 
    s.id AS schedule_id,
    d.name AS doctor_name,
    d.dept_id,
    s.work_date,
    WEEKDAY(s.work_date) + 1 AS day_of_week,
    CASE WEEKDAY(s.work_date) 
        WHEN 0 THEN '周一'
        WHEN 1 THEN '周二'
        WHEN 2 THEN '周三'
        WHEN 3 THEN '周四'
        WHEN 4 THEN '周五'
        WHEN 5 THEN '周六'
        WHEN 6 THEN '周日'
    END AS week_day_cn,
    s.available_num,
    s.status
FROM yy_schedule s
JOIN yy_doctor d ON s.doc_id = d.id
WHERE s.work_date >= @start_date
ORDER BY s.work_date, d.dept_id, d.name;
