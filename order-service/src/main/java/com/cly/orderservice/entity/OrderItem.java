package com.cly.orderservice.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("ord_order_item")
public class OrderItem {

    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    @TableField("order_id")
    private Long orderId;

    @TableField("patient_name")
    private String patientName;

    @TableField("patient_id_card")
    private String patientIdCard;

    @TableField("patient_phone")
    private String patientPhone;

    @TableField("schedule_id")
    private Long scheduleId;

    @TableField("doc_id")
    private Long docId;

    @TableField("doc_name")
    private String docName;

    @TableField("doc_title")
    private String docTitle;

    @TableField("dept_name")
    private String deptName;

    @TableField("work_date")
    private LocalDate workDate;

}
