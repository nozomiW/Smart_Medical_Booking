// AI Service API 使用示例

// 1. 简单对话请求
POST http://localhost:9006/ai/chat
Content-Type: application/json

{
  "message": "你好，我最近头疼，应该挂什么科？"
}

// 响应示例：
{
  "code": 200,
  "message": "success",
  "data": {
    "reply": "您好！根据您描述的症状，建议您挂神经内科。头疼可能由多种原因引起...",
    "sessionId": null,
    "success": true
  }
}


// 2. 带会话 ID 的多轮对话
POST http://localhost:9006/ai/chat
Content-Type: application/json

{
  "message": "帮我推荐一位内科医生",
  "sessionId": "session_001"
}

// 响应后继续对话
POST http://localhost:9006/ai/chat
Content-Type: application/json

{
  "message": "这位医生的号还有吗？",
  "sessionId": "session_001"
}


// 3. 带系统提示词的对话
POST http://localhost:9006/ai/chat
Content-Type: application/json

{
  "message": "我发烧了怎么办？",
  "systemPrompt": "你是一个专业的医疗助手，请用简洁易懂的语言回答"
}


// 4. 测试接口
GET http://localhost:9006/ai/test

// 响应：
{
  "code": 200,
  "message": "success",
  "data": "AI Service is running!"
}
