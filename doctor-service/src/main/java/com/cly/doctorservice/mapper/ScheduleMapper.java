package com.cly.doctorservice.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.doctorservice.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {
    // 查询某天某医生的号源（自定义 SQL：也可以用 Wrapper，这里按你的偏好保留 XML）
    List<Schedule> findByDocAndDate(@Param("docId") Long docId, @Param("workDate") LocalDate workDate);

    // 查询某天某科室下所有医生的号源（联表查询：更适合放在 XML）
    List<Schedule> findByDeptAndDate(@Param("deptId") Long deptId, @Param("workDate") LocalDate workDate);

    // 扣减号源（原子更新：available_num > 0 才扣减）
    int decreaseAvailableNum(@Param("id") Long id);

    // 批量插入号源（用于按规则生成排班）
    int batchInsert(@Param("list") List<Schedule> list);
}
