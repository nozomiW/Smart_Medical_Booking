# 🔢 数字精度问题 - 快速修复指南

## 问题

```
后端: 6821689192093853674
前端: 6821689192093854000  ❌ 精度丢失
```

## 原因

JavaScript `Number` 只能安全表示到 2^53-1 (9007199254740991)

## 解决方案

### 一句话总结
**所有 ID 都用字符串传输，不要转换为数字**

### 修复清单

#### 1. API 接口 (src/api/index.js)
```javascript
// ❌ 错误
create: (patientId, scheduleId) => api.post('/order/create', null, { 
  params: { patientId, scheduleId }  // 数字会丢失精度
})

// ✅ 正确
create: (patientId, scheduleId) => api.post('/order/create', null, { 
  params: { 
    patientId: String(patientId),
    scheduleId: String(scheduleId)
  }
})
```

#### 2. 数据处理 (src/pages/*.vue)
```javascript
// ❌ 错误
id: Number(order.id)  // 精度丢失

// ✅ 正确
id: String(order.id)  // 精度保留
```

#### 3. 函数调用
```javascript
// ❌ 错误
await payAPI.pay(Number(id))

// ✅ 正确
await payAPI.pay(String(id))
```

## 已修复的文件

- ✅ `src/api/index.js` - API 接口
- ✅ `src/pages/Bookings.vue` - 预约列表
- ✅ `src/pages/Patients.vue` - 就诊人列表
- ✅ `src/pages/Doctors.vue` - 医生列表

## 验证方法

```javascript
// 测试大整数
const id = '6821689192093853674'

// 字符串保留精度 ✅
String(id) === '6821689192093853674'

// 数字丢失精度 ❌
Number(id) === 6821689192093853674  // false!
```

## 关键规则

| 场景 | 做法 | 原因 |
|------|------|------|
| 接收 ID | 保持字符串 | 避免精度丢失 |
| 传输 ID | 转换为字符串 | 确保完整性 |
| 存储 ID | 字符串格式 | 保留原始值 |
| 比较 ID | 字符串比较 | 避免精度问题 |

---

**状态**: ✅ **已修复**
