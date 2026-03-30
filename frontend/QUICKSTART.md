# 前端快速启动指南

## 环境要求

- Node.js 16+ 
- npm 或 yarn

## 安装步骤

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将在 `http://localhost:5173` 启动

### 3. 后端服务配置

确保以下服务正在运行：

- **网关服务**: `http://localhost:9001`
  - 用户服务: `http://localhost:8081`
  - 医生服务: `http://localhost:8082`
  - 订单服务: `http://localhost:8083`
  - 支付服务: `http://localhost:8084`

## 功能流程

### 1. 用户注册和登录

```
首页 → 注册 → 输入手机号和密码 → 注册成功
首页 → 登录 → 输入手机号和密码 → 登录成功
```

### 2. 浏览医生和预约

```
首页 → 医生列表 → 搜索医生 → 选择医生 → 预约详情
→ 选择日期和时间 → 选择就诊人 → 确认预约
```

### 3. 管理预约

```
我的预约 → 查看预约列表 → 支付预约 或 取消预约
```

## API 接口说明

### 认证

所有需要认证的请求都会自动添加以下头部：

```
Authorization: Bearer {token}
X-User-Id: {userId}
```

### 用户相关

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/user/login` | 用户登录 |
| POST | `/user/register` | 用户注册 |
| POST | `/user/patient/insert` | 添加就诊人 |
| GET | `/user/patient/list` | 获取就诊人列表 |

### 医生相关

| 方法 | 端点 | 说明 |
|------|------|------|
| GET | `/doctor/search/online` | 获取在线医生列表 |
| GET | `/doctor/schedule/detail` | 获取排班详情 |
| GET | `/doctor/schedule/detail/id` | 按 ID 获取排班 |

### 订单相关

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/order/create` | 创建预约 |
| GET | `/order/list` | 获取预约列表 |
| GET | `/order/detail` | 获取预约详情 |

### 支付相关

| 方法 | 端点 | 说明 |
|------|------|------|
| POST | `/pay` | 支付预约 |

## 常见问题

### Q: 登录后页面显示 404？
A: 确保网关服务运行在 `http://localhost:9001`，并且所有微服务都已启动。

### Q: 预约时找不到医生？
A: 确保医生服务已启动，并且数据库中有医生数据。

### Q: 支付失败？
A: 检查支付服务是否正常运行，以及订单状态是否为待支付。

## 生产构建

```bash
npm run build
```

构建输出将在 `dist` 目录中。

## 项目结构

```
frontend/
├── src/
│   ├── pages/           # 页面组件
│   ├── api/             # API 接口
│   ├── router/          # 路由配置
│   ├── App.vue          # 根组件
│   ├── main.js          # 入口文件
│   └── style.css        # 全局样式
├── index.html           # HTML 模板
├── package.json         # 项目依赖
├── vite.config.js       # Vite 配置
└── README.md            # 项目文档
```

## 技术栈

- **框架**: Vue 3
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **构建工具**: Vite
- **样式**: CSS 3

## 支持

如有问题，请检查浏览器控制台的错误信息，或查看网络请求的响应内容。
