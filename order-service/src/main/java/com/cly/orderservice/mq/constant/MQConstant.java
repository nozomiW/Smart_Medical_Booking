package com.cly.orderservice.mq.constant;

public class MQConstant {
    public static class Topic {
        public static final String ORDER_CREATE = "ORDER_CREATE_TOPIC";
        public static final String PAY_SUCCESS = "PAY_SUCCESS_TOPIC";
    }

    public static class Tag {
        public static final String CREATE = "CREATE";
        public static final String SUCCESS = "SUCCESS";
    }
}
