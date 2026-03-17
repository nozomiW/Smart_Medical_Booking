package com.cly.doctorservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("yy_schedule_rule")
public class ScheduleRule {

    @TableId("id")
    private Long id;

    @TableField("doc_id")
    private Long docId;

    @TableField("day_of_week")
    private Integer dayOfWeek;

    @TableField("max_count")
    private Integer maxCount;

}
