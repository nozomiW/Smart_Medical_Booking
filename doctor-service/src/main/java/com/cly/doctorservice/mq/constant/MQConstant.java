package com.cly.doctorservice.mq.constant;

public class MQConstant {
    public static class Topic {
        public static final String DOCTOR_FEE = "DOC_FEE_TOPIC";
        public static final String SCHEDULE_DEDUCT = "SCHEDULE_DEDUCT_TOPIC";
    }

    public static class Tag {
        public static final String UPDATE = "UPDATE";
        public static final String DEDUCT = "DEDUCT";
    }

}
