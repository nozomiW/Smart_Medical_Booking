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

        // 【优化】只在 DEBUG 级别打印详细参数，减少序列化开销
        if (log.isDebugEnabled()) {
            log.debug("========== 业务操作开始 ==========");
            log.debug("时间：{}", LocalDateTime.now().format(formatter));
            log.debug("接口：{} {}", methodType, uri);
            log.debug("类名：{}.{}", 
                    joinPoint.getTarget().getClass().getSimpleName(), 
                    signature.getName());
            log.debug("业务描述：{}", businessLog.value());
            log.debug("业务类型：{}", businessLog.type());

            // 记录请求参数
            if (businessLog.recordParams()) {
                Object[] args = joinPoint.getArgs();
                if (args != null && args.length > 0) {
                    try {
                        String params = JSON.toJSONString(args);
                        log.debug("请求参数：{}", params);
                    } catch (Exception e) {
                        log.warn("参数序列化失败：{}", e.getMessage());
                    }
                }
            }
        } else {
            // INFO 级别只打印关键信息
            log.info("[业务] {} - {}.{} - {}", 
                    businessLog.type(),
                    joinPoint.getTarget().getClass().getSimpleName(),
                    signature.getName(),
                    businessLog.value());
        }

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
            
            // 【优化】耗时超过阈值才打印详细日志
            long duration = endTime - startTime;
            if (duration > 100 || log.isDebugEnabled()) {
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
