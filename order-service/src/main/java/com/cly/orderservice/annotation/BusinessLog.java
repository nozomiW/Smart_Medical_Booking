package com.cly.orderservice.annotation;

import java.lang.annotation.*;

/**
 * 业务日志注解
 * 用于标记需要记录业务日志的方法
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface BusinessLog {
    
    /**
     * 业务操作描述
     */
    String value() default "";
    
    /**
     * 业务类型
     */
    String type() default "";
    
    /**
     * 是否记录请求参数
     */
    boolean recordParams() default true;
    
    /**
     * 是否记录响应结果
     */
    boolean recordResult() default false;
}
