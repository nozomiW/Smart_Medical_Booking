<template>
  <div class="ai-chat-page">
    <div class="chat-container">
      <!-- 聊天头部 -->
      <div class="chat-header">
        <div class="header-content">
          <h2>AI 健康助手</h2>
          <p class="subtitle">您的私人医疗顾问，提供专业健康建议</p>
        </div>
        <div class="header-actions">
          <button @click="clearChat" class="btn-clear" title="清空聊天记录">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 消息列表 -->
      <div class="message-list" ref="messageListRef">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="welcome-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <h3>您好！我是您的 AI 健康助手</h3>
          <p>我可以帮您解答健康问题、提供就医建议、协助预约医生等</p>
          <div class="suggestions">
            <button @click="sendSuggestion('我最近头痛，应该挂什么科？')" class="suggestion-btn">
              🤔 头痛应该挂什么科？
            </button>
            <button @click="sendSuggestion('发烧 38.5 度需要去医院吗？')" class="suggestion-btn">
              🌡️ 发烧了怎么办？
            </button>
            <button @click="sendSuggestion('如何预约心内科专家？')" class="suggestion-btn">
              📅 如何预约专家号？
            </button>
            <button @click="sendSuggestion('体检前需要注意什么？')" class="suggestion-btn">
              🏥 体检注意事项
            </button>
          </div>
        </div>

        <div v-else>
          <div 
            v-for="(message, index) in messages" 
            :key="index" 
            :class="['message', message.role]"
          >
            <div class="message-avatar">
              <span v-if="message.role === 'user'">👤</span>
              <span v-else>🤖</span>
            </div>
            <div class="message-content">
              <div class="message-text">{{ message.content }}</div>
              <div class="message-time">{{ message.time }}</div>
            </div>
          </div>

          <div v-if="loading" class="message ai">
            <div class="message-avatar">🤖</div>
            <div class="message-content">
              <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <div class="input-wrapper">
          <textarea
            v-model="inputMessage"
            @keydown.enter.exact.prevent="sendMessage"
            placeholder="请输入您的问题...（Enter 发送，Shift+Enter 换行）"
            :disabled="loading"
            rows="1"
            ref="textareaRef"
          ></textarea>
          <button 
            @click="sendMessage" 
            :disabled="!inputMessage.trim() || loading"
            class="btn-send"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            <span>发送</span>
          </button>
        </div>
        <div class="input-tips">
          <span>AI 建议仅供参考，具体诊疗请遵医嘱</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { aiAPI } from '../api'

export default {
  name: 'AIChat',
  setup() {
    const router = useRouter()
    const messageListRef = ref(null)
    const textareaRef = ref(null)
    const inputMessage = ref('')
    const messages = ref([])
    const loading = ref(false)
    const sessionId = ref('chat-' + Date.now())

    // 自动调整文本框高度
    const autoResizeTextarea = () => {
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.style.height = 'auto'
          textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
        }
      })
    }

    // 滚动到底部
    const scrollToBottom = () => {
      nextTick(() => {
        if (messageListRef.value) {
          messageListRef.value.scrollTop = messageListRef.value.scrollHeight
        }
      })
    }

    // 获取当前时间
    const getCurrentTime = () => {
      const now = new Date()
      return now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    }

    // 发送建议问题
    const sendSuggestion = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    // 发送消息
    const sendMessage = async () => {
      const message = inputMessage.value.trim()
      if (!message || loading.value) return

      // 添加用户消息
      messages.value.push({
        role: 'user',
        content: message,
        time: getCurrentTime()
      })

      inputMessage.value = ''
      autoResizeTextarea()
      scrollToBottom()
      loading.value = true

      try {
        // 调用 AI API
        const response = await aiAPI.chat({
          message: message,
          sessionId: sessionId.value
        })

        console.log('AI 响应:', response)

        // 后端返回格式：{ code: 200, message: 'success', data: { reply, sessionId, success, errorMessage } }
        const responseData = response.data || response
        
        // 添加 AI 回复
        if (responseData.success !== false && responseData.reply) {
          messages.value.push({
            role: 'ai',
            content: responseData.reply,
            time: getCurrentTime()
          })
        } else {
          messages.value.push({
            role: 'ai',
            content: responseData.errorMessage || '抱歉，服务暂时不可用',
            time: getCurrentTime()
          })
        }
      } catch (error) {
        console.error('AI 对话失败:', error)
        console.error('错误详情:', error.response?.data || error.message)
        messages.value.push({
          role: 'ai',
          content: error.response?.status === 401 
            ? '请先登录' 
            : '抱歉，出现了一些问题，请稍后再试',
          time: getCurrentTime()
        })

        if (error.response?.status === 401) {
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        }
      } finally {
        loading.value = false
        scrollToBottom()
      }
    }

    // 清空聊天记录
    const clearChat = () => {
      if (confirm('确定要清空聊天记录吗？')) {
        messages.value = []
        sessionId.value = 'chat-' + Date.now()
      }
    }

    // 页面挂载时聚焦到输入框
    onMounted(() => {
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.focus()
        }
      })
    })

    return {
      messageListRef,
      textareaRef,
      inputMessage,
      messages,
      loading,
      sendSuggestion,
      sendMessage,
      clearChat
    }
  }
}
</script>

<style scoped>
.ai-chat-page {
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 20px;
}

.chat-container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  overflow: hidden;
}

/* 头部 */
.chat-header {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}

.header-content h2 {
  font-size: 24px;
  margin: 0 0 8px 0;
}

.subtitle {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-clear {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-clear:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-clear svg {
  width: 20px;
  height: 20px;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: #f7fafc;
}

.welcome-message {
  text-align: center;
  padding: 60px 20px;
}

.welcome-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.welcome-icon svg {
  width: 40px;
  height: 40px;
}

.welcome-message h3 {
  font-size: 24px;
  color: #2d3748;
  margin: 0 0 12px 0;
}

.welcome-message p {
  color: #718096;
  font-size: 16px;
  margin: 0 0 32px 0;
}

.suggestions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  max-width: 800px;
  margin: 0 auto;
}

.suggestion-btn {
  padding: 16px 20px;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  color: #4a5568;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.suggestion-btn:hover {
  border-color: #667eea;
  background: #f0f4ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
}

/* 消息气泡 */
.message {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.user {
  flex-direction: row-reverse;
}

.message-avatar {
  font-size: 24px;
  flex-shrink: 0;
}

.message-content {
  max-width: 70%;
}

.message-text {
  padding: 16px 20px;
  border-radius: 16px;
  line-height: 1.6;
  word-break: break-word;
}

.message.ai .message-text {
  background: white;
  color: #2d3748;
  border-bottom-left-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.message.user .message-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 12px;
  color: #a0aec0;
  margin-top: 6px;
  text-align: right;
}

.message.user .message-time {
  text-align: left;
}

/* 打字动画 */
.typing-indicator {
  display: flex;
  gap: 4px;
  padding: 16px 20px;
}

.typing-indicator span {
  width: 8px;
  height: 8px;
  background: #a0aec0;
  border-radius: 50%;
  animation: typing 1.4s infinite;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-8px);
  }
}

/* 输入区域 */
.input-area {
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}

.input-wrapper {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
}

textarea {
  flex: 1;
  padding: 14px 18px;
  border: 2px solid #e2e8f0;
  border-radius: 16px;
  resize: none;
  font-family: inherit;
  font-size: 15px;
  line-height: 1.5;
  transition: all 0.3s ease;
  max-height: 120px;
  min-height: 48px;
}

textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea:disabled {
  background: #f7fafc;
  cursor: not-allowed;
}

.btn-send {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.btn-send:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.btn-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-send svg {
  width: 20px;
  height: 20px;
}

.input-tips {
  text-align: center;
  font-size: 12px;
  color: #a0aec0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-chat-page {
    padding: 10px;
  }

  .chat-container {
    height: calc(100vh - 100px);
    border-radius: 16px;
  }

  .chat-header {
    padding: 20px;
  }

  .chat-header h2 {
    font-size: 20px;
  }

  .message-content {
    max-width: 85%;
  }

  .suggestions {
    grid-template-columns: 1fr;
  }

  .btn-send span {
    display: none;
  }
}
</style>
