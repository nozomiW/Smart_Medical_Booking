package com.cly.doctorservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import java.time.LocalDate;

@Data
@TableName("yy_schedule")
public class Schedule {

    @TableId("id")
    private Long id;

    @TableField("doc_id")
    private Long docId;

    @TableField("work_date")
    private LocalDate workDate;

    @TableField("available_num")
    private Integer availableNum;

    private Integer status;

}
