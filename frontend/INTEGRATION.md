# 前端与后端集成说明

## 项目概述

这是一个完整的 Vue 3 + JavaScript 前端应用，已与后端微服务架构完全集成。

## 架构图

```
┌─────────────────────────────────────────────────────────────┐
│                     前端应用 (Vue 3)                         │
│                   http://localhost:5173                      │
└────────────────────────────┬────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────┐
│                    网关服务 (Gateway)                        │
│                   http://localhost:9001                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 路由规则:                                            │   │
│  │ /user/**   → user-service:8081                       │   │
│  │ /doctor/** → doctor-service:8082                     │   │
│  │ /order/**  → order-service:8083                      │   │
│  │ /pay/**    → pay-service:8084                        │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
         │          │          │          │
         ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
    │ User   │ │Doctor  │ │ Order  │ │  Pay   │
    │Service │ │Service │ │Service │ │Service │
    │ :8081  │ │ :8082  │ │ :8083  │ │ :8084  │
    └────────┘ └────────┘ └────────┘ └────────┘
```

## 前端页面与后端接口映射

### 1. 首页 (Home.vue)
- 展示系统介绍和统计信息
- 无需后端接口

### 2. 注册页 (Register.vue)
```
用户输入 → POST /user/register
请求体: { phone, password }
响应: 注册成功消息
```

### 3. 登录页 (Login.vue)
```
用户输入 → POST /user/login
请求体: { phone, password }
响应: { token, userId }
存储: localStorage 中保存 token 和 userId
```

### 4. 医生列表 (Doctors.vue)
```
页面加载 → GET /doctor/search/online
响应: 医生列表数组
功能: 搜索、过滤医生
```

### 5. 预约详情 (BookingDetail.vue)
```
步骤1: 获取医生信息
  GET /doctor/search/online → 过滤出指定医生

步骤2: 选择日期后加载排班
  GET /doctor/schedule/detail?workDate=YYYY-MM-DD
  响应: 该日期的所有排班信息

步骤3: 获取就诊人列表
  GET /user/patient/list
  响应: 当前用户的就诊人列表

步骤4: 确认预约
  POST /order/create?patientId={id}&scheduleId={id}
  响应: 预约成功消息
```

### 6. 我的预约 (Bookings.vue)
```
页面加载 → GET /order/list
响应: 预约列表

支付预约 → POST /pay?orderId={id}
响应: 支付结果

取消预约 → (后端暂无接口)
```

## 认证流程

### 请求头配置

所有需要认证的请求都会自动添加：

```javascript
headers: {
  'Authorization': 'Bearer {token}',
  'X-User-Id': '{userId}'
}
```

### Token 管理

- 登录成功后，token 存储在 `localStorage.token`
- userId 存储在 `localStorage.userId`
- 手机号存储在 `localStorage.phone`（用于显示用户信息）
- 退出登录时清除所有存储数据

### 路由守卫

需要认证的路由：
- `/booking/:id` - 预约详情页
- `/bookings` - 我的预约页

未登录用户访问这些路由会被重定向到登录页。

## 数据流转

### 预约流程

```
1. 用户登录
   ↓
2. 浏览医生列表
   ↓
3. 选择医生进入预约页面
   ↓
4. 选择预约日期
   ↓
5. 系统加载该日期的排班信息
   ↓
6. 用户选择时间和就诊人
   ↓
7. 提交预约请求
   ↓
8. 订单创建成功
   ↓
9. 跳转到我的预约页面
   ↓
10. 用户可以支付或取消预约
```

## API 响应格式

### 成功响应

```javascript
// 用户登录
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 123
}

// 医生列表
[
  {
    "id": 1,
    "name": "张医生",
    "dept": "心内科",
    "title": "主任医师",
    "intro": "医生简介",
    "fee": 100
  }
]

// 排班信息
[
  {
    "id": 1,
    "doctorId": 1,
    "workDate": "2026-03-30",
    "workTime": "09:00",
    "availableNumber": 5
  }
]

// 预约列表
[
  {
    "id": 1,
    "doctorName": "张医生",
    "deptName": "心内科",
    "reserveDate": "2026-03-30",
    "reserveTime": "09:00",
    "fee": 100,
    "orderStatus": 0  // 0: 待支付, 1: 已支付, 2: 已完成, 3: 已取消
  }
]
```

### 错误响应

```javascript
// 401 未认证
{
  "code": 401,
  "message": "未授权"
}

// 400 请求错误
{
  "code": 400,
  "message": "参数错误"
}

// 500 服务器错误
{
  "code": 500,
  "message": "服务器内部错误"
}
```

## 环境配置

### 开发环境

```javascript
// frontend/src/api/index.js
const API_BASE_URL = 'http://localhost:9001'
```

### 生产环境

需要修改 API_BASE_URL 为生产环境的网关地址：

```javascript
const API_BASE_URL = 'https://api.example.com'
```

## 常见集成问题

### 1. CORS 错误

**问题**: 浏览器报 CORS 错误

**解决**: 确保网关服务配置了 CORS，或在网关层面处理跨域请求

### 2. 401 未认证

**问题**: 请求返回 401

**解决**: 
- 检查 token 是否过期
- 检查请求头是否正确添加了 Authorization
- 重新登录获取新 token

### 3. 404 接口不存在

**问题**: 请求返回 404

**解决**:
- 检查网关路由配置是否正确
- 确保对应的微服务已启动
- 检查请求路径是否正确

### 4. 超时错误

**问题**: 请求超时

**解决**:
- 检查后端服务是否正常运行
- 增加 axios 超时时间
- 检查网络连接

## 部署建议

### 前端部署

1. 构建生产版本
```bash
npm run build
```

2. 将 `dist` 目录部署到 Web 服务器（Nginx、Apache 等）

3. 配置 API 代理或修改 API_BASE_URL

### 后端部署

1. 确保所有微服务都已部署
2. 配置网关服务的路由规则
3. 配置 CORS 和认证
4. 配置数据库连接

## 监控和调试

### 浏览器开发者工具

1. **Network 标签**: 查看所有 HTTP 请求
2. **Console 标签**: 查看错误日志
3. **Application 标签**: 查看 localStorage 中的 token

### 后端日志

查看网关和各微服务的日志，了解请求处理情况。

## 性能优化

1. **代码分割**: 使用 Vue Router 的懒加载
2. **缓存**: 合理使用 localStorage 缓存数据
3. **请求优化**: 避免重复请求，使用防抖和节流
4. **资源优化**: 压缩图片和 CSS/JS 文件

## 安全建议

1. **HTTPS**: 生产环境必须使用 HTTPS
2. **Token 管理**: 定期更新 token，实现 token 刷新机制
3. **输入验证**: 前端验证用户输入
4. **XSS 防护**: Vue 3 默认进行 XSS 防护
5. **CSRF 防护**: 后端实现 CSRF token 验证
