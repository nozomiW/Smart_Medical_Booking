<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <p class="section-label">智能服务</p>
          <h2>AI 健康助手</h2>
        </div>
        <button class="btn-clear-history" @click="clearChat" title="清空记录">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
          </svg>
          清空记录
        </button>
      </div>

      <div class="chat-shell">
        <!-- 消息区 -->
        <div class="message-area" ref="messageListRef">
          <!-- 欢迎屏 -->
          <div v-if="messages.length === 0" class="welcome-screen">
            <div class="welcome-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="32" height="32">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <h3 class="welcome-title">您好，我是 AI 健康助手</h3>
            <p class="welcome-sub">解答健康问题 · 提供就医建议 · 协助预约医生 · 智能推荐</p>
            <div class="suggestion-grid">
              <button
                v-for="s in suggestions"
                :key="s.text"
                class="suggestion-chip"
                @click="sendSuggestion(s.text)"
              >
                <span class="chip-icon">{{ s.icon }}</span>
                <span>{{ s.label }}</span>
              </button>
            </div>
          </div>

          <!-- 消息列表 -->
          <template v-else>
            <div
              v-for="(msg, i) in messages"
              :key="i"
              :class="['msg-row', msg.role]"
            >
              <div class="msg-avatar">
                <template v-if="msg.role === 'user'">
                  <span class="avatar-user">{{ userInitial }}</span>
                </template>
                <template v-else>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </template>
              </div>
              <div class="msg-body">
                <div class="msg-bubble" v-html="renderMarkdown(msg.content)"></div>
                <div class="msg-time">{{ msg.time }}</div>
              </div>
            </div>

            <!-- 打字中 -->
            <div v-if="loading" class="msg-row ai">
              <div class="msg-avatar">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" width="18" height="18">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="msg-body">
                <div class="msg-bubble typing-bubble">
                  <span class="dot"></span>
                  <span class="dot"></span>
                  <span class="dot"></span>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- 输入区 -->
        <div class="input-dock">
          <div class="input-row">
            <textarea
              v-model="inputMessage"
              @keydown.enter.exact.prevent="sendMessage"
              @input="autoResize"
              placeholder="请输入您的问题…（Enter 发送，Shift+Enter 换行）"
              :disabled="loading"
              rows="1"
              ref="textareaRef"
              class="chat-textarea"
            ></textarea>
            <button
              class="btn-send"
              @click="sendMessage"
              :disabled="!inputMessage.trim() || loading"
            >
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
              发送
            </button>
          </div>
          <p class="input-disclaimer">AI 建议仅供参考，具体诊疗请遵医嘱</p>
        </div>
      </div>
    </div>

    <!-- 订单创建成功通知 -->
    <div v-if="orderCreatedToast" class="toast-order-created">
      <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      <span>挂号成功！</span>
      <router-link to="/bookings" class="toast-link">查看我的预约 →</router-link>
      <button class="toast-close" @click="orderCreatedToast = false">✕</button>
    </div>
    <div v-if="errorMsg" class="toast-error">{{ errorMsg }}</div>
  </div>
</template>

<script>
import { ref, nextTick, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { aiAPI } from '../api'
import { marked } from 'marked'

export default {
  name: 'AIChat',
  setup() {
    const router = useRouter()
    const messageListRef = ref(null)
    const textareaRef = ref(null)
    const inputMessage = ref('')
    const messages = ref([])
    const loading = ref(false)
    const errorMsg = ref('')
    const orderCreatedToast = ref(false)
    
    // 生成 sessionId：优先使用 userId，保证每个用户独立对话
    const generateSessionId = () => {
      const userId = localStorage.getItem('userId')
      if (userId) {
        return 'user-' + userId
      }
      // 如果没有 userId，使用临时会话
      return 'chat-' + Date.now()
    }
    const sessionId = ref(generateSessionId())

    const userInitial = computed(() => {
      const phone = localStorage.getItem('phone')
      return phone ? phone.charAt(2) : '我'
    })

    const suggestions = [
      { icon: '🩺', label: '头痛应该挂什么科？', text: '我最近头痛，应该挂什么科？' },
      { icon: '🌡️', label: '发烧了怎么办？', text: '发烧 38.5 度需要去医院吗？' },
      { icon: '📅', label: '帮我预约医生', text: '我想预约心内科的号' },
      { icon: '👨‍⚕️', label: '推荐擅长高血压的医生', text: '帮我推荐擅长治疗高血压的医生' },
    ]

    const autoResize = () => {
      nextTick(() => {
        if (textareaRef.value) {
          textareaRef.value.style.height = 'auto'
          textareaRef.value.style.height = Math.min(textareaRef.value.scrollHeight, 120) + 'px'
        }
      })
    }

    const scrollToBottom = () => {
      nextTick(() => {
        if (messageListRef.value) {
          messageListRef.value.scrollTop = messageListRef.value.scrollHeight
        }
      })
    }

    const now = () => new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })

    const sendSuggestion = (text) => {
      inputMessage.value = text
      sendMessage()
    }

    const sendMessage = async () => {
      const message = inputMessage.value.trim()
      if (!message || loading.value) return

      messages.value.push({ role: 'user', content: message, time: now() })
      inputMessage.value = ''
      autoResize()
      scrollToBottom()
      loading.value = true

      try {
        // 获取用户 ID（从 localStorage）
        const token = localStorage.getItem('token')
        const userId = localStorage.getItem('userId')
        
        const response = await aiAPI.chat(
          { message, sessionId: sessionId.value },
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'X-User-Id': userId
            }
          }
        )
        const data = response.data || response
        messages.value.push({
          role: 'ai',
          content: (data.success !== false && data.reply) ? data.reply : (data.errorMessage || '抱歉，服务暂时不可用'),
          time: now()
        })
        // 处理工具调用结果
        if (data.toolAction && data.toolAction.type === 'ORDER_CREATED') {
          orderCreatedToast.value = true
          setTimeout(() => { orderCreatedToast.value = false }, 8000)
        }
      } catch (err) {
        // 判断是否是超时错误
        const isTimeout = err.code === 'ECONNABORTED' || err.message?.includes('timeout');
        
        messages.value.push({
          role: 'ai',
          content: err.response?.status === 401 
            ? '请先登录后再使用 AI 助手' 
            : isTimeout
              ? 'AI 正在思考中，请稍后再试（处理复杂问题可能需要较长时间）'
              : '抱歉，出现了一些问题，请稍后再试',
          time: now()
        })
        if (err.response?.status === 401) {
          setTimeout(() => router.push('/login'), 1500)
        }
      } finally {
        loading.value = false
        scrollToBottom()
      }
    }

    const clearChat = () => {
      if (!messages.value.length) return
      if (confirm('确定要清空聊天记录吗？')) {
        messages.value = []
        sessionId.value = 'chat-' + Date.now()
      }
    }

    const renderMarkdown = (text) => {
      if (!text) return ''
      return marked.parse(text)
    }

    onMounted(() => {
      nextTick(() => textareaRef.value?.focus())
    })

    return {
      messageListRef, textareaRef, inputMessage, messages, loading, errorMsg,
      orderCreatedToast, userInitial, suggestions,
      autoResize, sendSuggestion, sendMessage, clearChat, renderMarkdown
    }
  }
}
</script>

<style scoped>
.page { padding: 32px 0 64px; }

/* ── Header ── */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 28px;
}
.page-header h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.03em;
  margin: 0;
}
.btn-clear-history {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--r-md);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-600);
  cursor: pointer;
  transition: all var(--t);
}
.btn-clear-history:hover {
  border-color: var(--danger);
  color: var(--danger);
  background: var(--danger-bg);
}

/* ── Chat shell ── */
.chat-shell {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--r-xl);
  box-shadow: var(--shadow-md);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 220px);
  min-height: 480px;
  overflow: hidden;
}

/* ── Message area ── */
.message-area {
  flex: 1;
  overflow-y: auto;
  padding: 28px 32px;
  background: var(--surface);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* ── Welcome ── */
.welcome-screen {
  margin: auto;
  text-align: center;
  max-width: 560px;
  padding: 40px 0;
}
.welcome-icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: var(--accent-light);
  border-radius: var(--r-xl);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent);
}
.welcome-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ink);
  margin: 0 0 8px;
  letter-spacing: -0.02em;
}
.welcome-sub {
  font-size: 14px;
  color: var(--gray-400);
  margin: 0 0 32px;
}
.suggestion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.suggestion-chip {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: white;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--r-lg);
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  cursor: pointer;
  transition: all var(--t);
  text-align: left;
}
.suggestion-chip:hover {
  border-color: var(--accent);
  background: var(--accent-light);
  color: var(--accent);
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}
.chip-icon { font-size: 18px; flex-shrink: 0; }

/* ── Message rows ── */
.msg-row {
  display: flex;
  gap: 12px;
  animation: msgIn 0.22s ease;
}
.msg-row.user { flex-direction: row-reverse; }

@keyframes msgIn {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Avatars ── */
.msg-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-light);
  color: var(--accent);
  margin-top: 2px;
}
.msg-row.user .msg-avatar {
  background: var(--accent);
  color: white;
}
.avatar-user {
  font-size: 14px;
  font-weight: 700;
}

/* ── Bubble ── */
.msg-body {
  max-width: 68%;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.msg-row.user .msg-body { align-items: flex-end; }

.msg-bubble {
  padding: 12px 16px;
  border-radius: var(--r-lg);
  font-size: 14px;
  line-height: 1.65;
  word-break: break-word;
  border: 1px solid transparent;
}
.msg-row.ai .msg-bubble {
  background: white;
  border-color: var(--gray-200);
  color: var(--ink);
  border-bottom-left-radius: var(--r-sm);
  box-shadow: var(--shadow-sm);
}
.msg-row.user .msg-bubble {
  background: var(--accent);
  color: white;
  border-bottom-right-radius: var(--r-sm);
  box-shadow: var(--shadow-accent);
}

/* markdown inside AI bubble */
.msg-bubble :deep(p) { margin: 0 0 10px; }
.msg-bubble :deep(p:last-child) { margin-bottom: 0; }
.msg-bubble :deep(h1),.msg-bubble :deep(h2),.msg-bubble :deep(h3) { margin: 14px 0 6px; font-weight: 600; }
.msg-bubble :deep(ul),.msg-bubble :deep(ol) { padding-left: 20px; margin: 6px 0; }
.msg-bubble :deep(li) { margin: 3px 0; }
.msg-bubble :deep(code) { background: var(--gray-100); padding: 1px 5px; border-radius: 4px; font-family: var(--font-mono); font-size: 0.88em; }
.msg-bubble :deep(pre) { background: var(--gray-100); padding: 10px 14px; border-radius: var(--r-md); overflow-x: auto; margin: 8px 0; }
.msg-bubble :deep(pre code) { background: transparent; padding: 0; }
.msg-bubble :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 12px; color: var(--gray-500); margin: 8px 0; font-style: italic; }
.msg-bubble :deep(hr) { border: none; border-top: 1px solid var(--gray-200); margin: 12px 0; }
.msg-bubble :deep(strong) { font-weight: 600; }

.msg-time {
  font-size: 11px;
  color: var(--gray-400);
  padding: 0 4px;
}

/* ── Typing dots ── */
.typing-bubble {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 14px 18px;
}
.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gray-300);
  animation: bounce 1.3s infinite ease;
}
.dot:nth-child(2) { animation-delay: 0.18s; }
.dot:nth-child(3) { animation-delay: 0.36s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-6px); background: var(--accent); }
}

/* ── Input dock ── */
.input-dock {
  padding: 16px 24px 14px;
  background: white;
  border-top: 1px solid var(--gray-100);
  flex-shrink: 0;
}
.input-row {
  display: flex;
  gap: 10px;
  align-items: flex-end;
  margin-bottom: 8px;
}
.chat-textarea {
  flex: 1;
  padding: 11px 14px;
  border: 1.5px solid var(--gray-200);
  border-radius: var(--r-md);
  resize: none;
  font-family: var(--font-sans);
  font-size: 14px;
  line-height: 1.55;
  color: var(--ink);
  background: var(--gray-50);
  transition: border-color var(--t), box-shadow var(--t), background var(--t);
  max-height: 120px;
  min-height: 44px;
  width: auto;
}
.chat-textarea:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  background: white;
}
.chat-textarea:disabled {
  background: var(--gray-100);
  cursor: not-allowed;
}
.btn-send {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 11px 20px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t);
  flex-shrink: 0;
  box-shadow: var(--shadow-accent);
  height: 44px;
}
.btn-send:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(14,158,142,0.30);
}
.btn-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
.input-disclaimer {
  font-size: 11px;
  color: var(--gray-400);
  text-align: center;
}

/* ── Toast Order Created ── */
.toast-order-created {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--success);
  color: white;
  padding: 12px 16px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 500;
  z-index: 300;
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  gap: 10px;
  animation: msgIn 0.3s ease;
}
.toast-link {
  color: white;
  text-decoration: underline;
  font-weight: 600;
  white-space: nowrap;
}
.toast-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 13px;
  opacity: 0.8;
  padding: 0 2px;
  line-height: 1;
}
.toast-close:hover { opacity: 1; }

/* ── Toast ── */
.toast-error {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--danger);
  color: white;
  padding: 12px 20px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 500;
  z-index: 300;
  box-shadow: var(--shadow-lg);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .page { padding: 16px 0 40px; }
  .chat-shell { height: calc(100vh - 160px); }
  .message-area { padding: 20px 16px; }
  .msg-body { max-width: 82%; }
  .suggestion-grid { grid-template-columns: 1fr; }
  .input-dock { padding: 12px 16px 10px; }
  .btn-send span { display: none; }
}
</style> 