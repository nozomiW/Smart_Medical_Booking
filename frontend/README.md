# 智能医疗预约系统 - 前端

Vue 3 + JavaScript 构建的医疗预约系统前端应用。

## 功能特性

- 🏥 医生列表浏览和搜索
- 👨‍⚕️ 在线预约挂号
- 📅 预约时间选择
- 💳 预约支付
- 👤 用户登录注册
- 📋 预约记录管理

## 项目结构

```
frontend/
├── src/
│   ├── pages/           # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── Doctors.vue        # 医生列表
│   │   ├── BookingDetail.vue  # 预约详情
│   │   ├── Bookings.vue       # 我的预约
│   │   ├── Login.vue          # 登录页
│   │   └── Register.vue       # 注册页
│   ├── api/
│   │   └── index.js     # API 接口封装
│   ├── router/
│   │   └── index.js     # 路由配置
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── vite.config.js       # Vite 配置
└── .gitignore
```

## 快速开始

### 安装依赖

```bash
cd frontend
npm install
```

### 开发模式

```bash
npm run dev
```

访问 `http://localhost:5173`

### 生产构建

```bash
npm run build
```

## API 配置

前端直接连接到网关服务 `http://localhost:9001`，所有请求都会自动添加以下头部：

- `Authorization: Bearer {token}` - JWT 认证令牌
- `X-User-Id: {userId}` - 用户 ID

## 后端接口映射

网关服务将请求转发到各个微服务：

| 路径前缀 | 微服务 | 端口 |
|---------|--------|------|
| `/user/**` | user-service | 8081 |
| `/doctor/**` | doctor-service | 8082 |
| `/order/**` | order-service | 8083 |
| `/pay/**` | pay-service | 8084 |

## 主要 API 端点

### 用户服务
- `POST /user/login` - 登录
- `POST /user/register` - 注册
- `POST /user/patient/insert` - 添加就诊人
- `GET /user/patient/list` - 获取就诊人列表

### 医生服务
- `GET /doctor/search/online` - 获取在线医生列表
- `GET /doctor/schedule/detail` - 获取排班详情
- `GET /doctor/schedule/detail/id` - 按 ID 获取排班

### 订单服务
- `POST /order/create` - 创建预约
- `GET /order/list` - 获取预约列表
- `GET /order/detail` - 获取预约详情

### 支付服务
- `POST /pay` - 支付预约

## 技术栈

- Vue 3 - 渐进式 JavaScript 框架
- Vue Router 4 - 路由管理
- Axios - HTTP 客户端
- Vite - 前端构建工具
- CSS 3 - 样式

## 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 许可证

MIT
