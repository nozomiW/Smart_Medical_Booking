# 后端代码注释规范

## 原则
1. **精简直接** - 只保留必要的说明，删除显而易见的注释
2. **关键逻辑** - 复杂业务逻辑、算法、特殊处理需要注释
3. **统一风格** - 使用简洁的单行注释 `//`

## 注释类型使用规则

### 1. JavaDoc `/** */`
**仅用于：**
- 公开 API 方法（Controller、Service 接口）
- 工具类的公共方法
- 参数和返回值需要明确说明时

**示例：**
```java
/**
 * 根据科室 ID 映射科室名称
 */
private String getDeptNameByDeptId(String deptId) {
    // ...
}
```

### 2. 单行注释 `//`
**用于：**
- 方法内部的关键步骤说明
- 业务逻辑解释
- 特殊处理原因

**示例：**
```java
public Result createOrder() {
    // 步骤 1: Redis 预扣减号源
    Result deductResult = doctorFeignClient.deductAvailableNum(scheduleId);
    
    // 步骤 2: 验证就诊人
    PatientDTO patient = patients.stream()
            .filter(p -> p.getId().equals(patientId))
            .findFirst()
            .orElse(null);
}
```

### 3. 调试日志分隔符 `=====`
**仅用于：**
- 重要的错误信息
- 关键业务流程的开始/结束

**示例：**
```java
System.err.println("\n========== [订单创建失败] ==========");
System.err.println("失败原因：扣减号源失败");
System.err.println("====================================\n");
```

## 删除的注释类型

### ❌ 删除以下冗余注释：
1. 显而易见的 getter/setter 说明
2. 重复代码功能的注释
3. 过度的装饰性分隔线（如 `// ======`）
4. 已废弃代码的大段注释（直接删除代码）

### ✅ 保留以下必要注释：
1. 业务流程的关键步骤
2. 特殊算法或处理逻辑
3. 性能优化原因
4. 重要参数校验说明
5. 异常处理的上下文

## 实际案例对比

### 修改前（冗余）：
```java
// ========== 步骤 1: Redis 预扣减号源 ==========
Result deductResult = doctorFeignClient.deductAvailableNum(scheduleId);
if (deductResult != Result.SUCCESS) {
    // 如果扣减失败，返回失败
    return Result.FALSE;
}

// ========== 步骤 2: 获取就诊人信息并验证 ==========
List<PatientDTO> patients = userFeignClient.getPatients(userId);

// 记录获取到的所有就诊人信息（用于排查问题）
StringBuilder patientListInfo = new StringBuilder();
```

### 修改后（精简）：
```java
// 步骤 1: Redis 预扣减号源
Result deductResult = doctorFeignClient.deductAvailableNum(scheduleId);
if (deductResult != Result.SUCCESS) {
    System.err.println("\n========== [订单创建失败] ==========");
    System.err.println("失败原因：扣减号源失败");
    return Result.FALSE;
}

// 步骤 2: 获取就诊人信息并验证
List<PatientDTO> patients = userFeignClient.getPatients(userId);
```

## 日志输出规范

### 正常流程：
```java
System.out.println("[步骤 1] ✓ 号源扣减成功");
```

### 错误流程：
```java
System.err.println("\n========== [订单创建失败] ==========");
System.err.println("失败原因：扣减号源失败");
System.err.println("scheduleId: " + scheduleId);
System.err.println("可能原因:");
System.err.println("  1. Redis 中号源 key 不存在");
System.err.println("  2. 号源已用完");
System.err.println("====================================\n");
```
