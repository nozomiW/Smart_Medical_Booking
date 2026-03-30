package com.cly.doctorservice.aspect;

import com.alibaba.fastjson.JSON;
import com.cly.doctorservice.annotation.BusinessLog;
import jakarta.servlet.http.HttpServletRequest;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.aspectj.lang.reflect.MethodSignature;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.lang.reflect.Method;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * 业务日志切面
 * 记录带有@BusinessLog 注解的方法执行情况
 */
@Aspect
@Component
public class BusinessLogAspect {

    private static final Logger log = LoggerFactory.getLogger(BusinessLogAspect.class);
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSS");

    @Pointcut("@annotation(com.cly.doctorservice.annotation.BusinessLog)")
    public void businessLogPointcut() {
    }

    @Around("businessLogPointcut()")
    public Object around(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature signature = (MethodSignature) joinPoint.getSignature();
        Method method = signature.getMethod();
        BusinessLog businessLog = method.getAnnotation(BusinessLog.class);

        // 获取请求信息
        HttpServletRequest request = getRequest();
        String uri = request != null ? request.getRequestURI() : "unknown";
        String methodType = request != null ? request.getMethod() : "unknown";

        // INFO 级别打印关键业务信息
        log.info("[业务] {} - {}.{} - {}", 
                businessLog.type(),
                joinPoint.getTarget().getClass().getSimpleName(),
                signature.getName(),
                businessLog.value());

        long startTime = System.currentTimeMillis();
        Object result = null;
        boolean success = false;

        try {
            result = joinPoint.proceed();
            success = true;
            return result;
        } catch (Throwable e) {
            log.error("业务执行异常：{}", e.getMessage(), e);
            throw e;
        } finally {
            long endTime = System.currentTimeMillis();
            
            // 耗时超过阈值才打印日志
            long duration = endTime - startTime;
            if (duration > 100) {
                log.info("[业务完成] 耗时：{}ms - 状态：{}", duration, success ? "成功" : "失败");
            }
        }
    }

    private HttpServletRequest getRequest() {
        try {
            ServletRequestAttributes attributes = 
                    (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                return attributes.getRequest();
            }
        } catch (Exception e) {
            // 非 Web 环境可能抛出异常
        }
        return null;
    }
}
