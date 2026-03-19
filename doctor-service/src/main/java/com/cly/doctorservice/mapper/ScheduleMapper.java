package com.cly.doctorservice.mapper;

import com.cly.doctorservice.dto.ScheduleDetailDTO;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.cly.doctorservice.entity.Schedule;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ScheduleMapper extends BaseMapper<Schedule> {
    List<Schedule> findByDocAndDate(@Param("docId") Long docId, @Param("workDate") LocalDate workDate);
    List<Schedule> findByDeptAndDate(@Param("deptId") Long deptId, @Param("workDate") LocalDate workDate);
    int decreaseAvailableNum(@Param("id") Long id);
    int batchInsert(@Param("list") List<Schedule> list);

    // 查询某天所有排班，联表带出医生信息
    List<ScheduleDetailDTO> findDetailByDate(@Param("workDate") LocalDate workDate);

    // 按排班ID查单条排班详情
    ScheduleDetailDTO findDetailById(@Param("scheduleId") Long scheduleId);
}
