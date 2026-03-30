# AI Service - AI 对话服务

## 功能说明

这是一个 AI 对话模块，提供简单的对话框功能。

## 配置说明

### 1. API Key 配置

在 `application.yaml` 中配置 AI 服务的 API Key：

```yaml
ai:
  # 填入您的 API Key
  api-key: YOUR_API_KEY_HERE
  
  # API Base URL（根据实际使用的 AI 服务填写）
  base-url: https://api.example.com/v1
  
  # 模型名称
  model: gpt-3.5-turbo
  
  # 超时时间（毫秒）
  timeout: 30000
```

### 2. API 接口

#### 对话接口
```http
POST /ai/chat
Content-Type: application/json

{
  "message": "你好",
  "sessionId": "session_001",  // 可选，用于多轮对话
  "systemPrompt": "你是一个医疗助手"  // 可选，系统提示词
}
```

响应：
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "您好！有什么可以帮助您的？",
    "sessionId": "session_001",
    "success": true
  }
}
```

#### 测试接口
```http
GET /ai/test
```

## 运行服务

```bash
# 在项目根目录
mvn clean install

# 进入 ai-service 目录
cd ai-service

# 运行服务
mvn spring-boot:run
```

服务启动后访问：http://localhost:9006

## TODO

等待您填入 API Key 后，需要实现以下功能：

1. 在 `AiService.callAiApi()` 方法中实现真实的 AI API 调用
2. 根据您使用的 AI 服务商（如 OpenAI、讯飞、通义千问等）调整请求格式
3. 处理流式响应（如果需要）
4. 添加会话历史管理（可选）

## 技术栈

- Spring Boot 4.0.3
- Spring Cloud Alibaba (Nacos)
- Lombok
- FastJSON
- Hutool（HTTP 工具）
