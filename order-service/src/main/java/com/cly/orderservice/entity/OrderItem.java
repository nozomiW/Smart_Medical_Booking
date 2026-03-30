package com.cly.orderservice.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.time.LocalDate;

@Data
@TableName("ord_order_item")
public class OrderItem {

    @TableId("id")
    private String id;

    @TableField("order_id")
    private String orderId;

    @TableField("patient_name")
    private String patientName;

    @TableField("patient_id_card")
    private String patientIdCard;

    @TableField("patient_phone")
    private String patientPhone;

    @TableField("schedule_id")
    private String scheduleId;

    @TableField("doc_id")
    private String docId;

    @TableField("doc_name")
    private String docName;

    @TableField("doc_title")
    private String docTitle;

    @TableField("dept_name")
    private String deptName;

    @TableField("work_date")
    private LocalDate workDate;

}
