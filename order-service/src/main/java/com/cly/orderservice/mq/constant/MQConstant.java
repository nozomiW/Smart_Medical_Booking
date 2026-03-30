package com.cly.orderservice.mq.constant;

public class MQConstant {
    public static class Topic {
        public static final String ORDER_CREATE = "ORDER_CREATE_TOPIC";
        public static final String PAY_SUCCESS = "PAY_SUCCESS_TOPIC";
        public static final String ORDER_CACHE_DELETE = "ORDER_CACHE_DELETE_TOPIC";
        public static final String ORDER_TIMEOUT_CANCEL = "ORDER_TIMEOUT_CANCEL_TOPIC";
    }

    public static class Tag {
        public static final String CREATE = "CREATE";
        public static final String SUCCESS = "SUCCESS";
        public static final String DELETE_LATER = "DELETE_LATER";
        public static final String CANCEL = "CANCEL";
    }
}
