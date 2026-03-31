<template>
  <div class="auth-page">
    <div class="auth-left">
      <div class="auth-left-content">
        <div class="brand">
          <svg viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#0e9e8e"/>
            <path d="M14 7v14M7 14h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          <span>智慧医疗</span>
        </div>
        <h1>欢迎回来</h1>
        <p>登录后可查看预约记录、管理就诊人信息，享受完整的智慧医疗服务。</p>
        <ul class="auth-perks">
          <li v-for="p in perks" :key="p">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>
            {{ p }}
          </li>
        </ul>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <h2>登录账号</h2>
          <p>还没有账号？<router-link to="/register" class="auth-link">立即注册</router-link></p>
        </div>

        <div v-if="error" class="alert alert-error">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <label for="phone">手机号</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              </span>
              <input id="phone" v-model="form.phone" type="tel" placeholder="请输入手机号" required maxlength="11">
            </div>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              </span>
              <input id="password" v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="请输入密码" required>
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                <svg v-if="!showPwd" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
                <svg v-else viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.064 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '登录中…' : '登录' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../api'

export default {
  name: 'Login',
  setup() {
    const router = useRouter()
    const form = ref({ phone: '', password: '' })
    const loading = ref(false)
    const error = ref('')
    const showPwd = ref(false)

    const perks = ['实时号源查询', '一键预约挂号', '就诊人信息管理', '预约记录随时查看']

    const handleLogin = async () => {
      if (!form.value.phone || !form.value.password) { error.value = '请输入手机号和密码'; return }
      loading.value = true
      error.value = ''
      try {
        const response = await userAPI.login(form.value.phone, form.value.password)
        const token = typeof response === 'string' ? response : response.token
        localStorage.setItem('token', token)
        localStorage.setItem('userId', form.value.phone)
        localStorage.setItem('phone', form.value.phone)
        router.push('/')
      } catch (err) {
        error.value = '手机号或密码错误，请重试'
      } finally {
        loading.value = false
      }
    }

    return { form, loading, error, showPwd, perks, handleLogin }
  }
}
</script>

<style scoped>
.auth-page {
  display: flex;
  min-height: 100vh;
  background: var(--surface);
}

/* Left panel */
.auth-left {
  flex: 0 0 42%;
  background: linear-gradient(145deg, var(--ink) 0%, #1a3a4a 60%, #0b5c52 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 56px;
  position: relative;
  overflow: hidden;
}

.auth-left::before {
  content: '';
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,158,142,0.2) 0%, transparent 70%);
  top: -100px;
  right: -100px;
}

.auth-left::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(14,158,142,0.15) 0%, transparent 70%);
  bottom: -80px;
  left: -60px;
}

.auth-left-content {
  position: relative;
  z-index: 1;
  max-width: 380px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 48px;
}

.brand svg { width: 32px; height: 32px; }

.brand span {
  font-size: 18px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.02em;
}

.auth-left h1 {
  font-size: 38px;
  font-weight: 700;
  color: white;
  line-height: 1.2;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
  font-family: var(--font-serif);
  font-style: italic;
}

.auth-left p {
  font-size: 15px;
  color: rgba(255,255,255,0.6);
  line-height: 1.7;
  margin-bottom: 36px;
}

.auth-perks {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.auth-perks li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: rgba(255,255,255,0.8);
  font-weight: 500;
}

.auth-perks li svg { color: var(--accent); flex-shrink: 0; }

/* Right panel */
.auth-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
}

.auth-card {
  width: 100%;
  max-width: 420px;
}

.auth-card-header {
  margin-bottom: 36px;
}

.auth-card-header h2 {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.03em;
  margin-bottom: 8px;
}

.auth-card-header p {
  font-size: 14px;
  color: var(--gray-500);
}

.auth-link {
  color: var(--accent);
  font-weight: 600;
  text-decoration: none;
}
.auth-link:hover { text-decoration: underline; }

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  color: var(--gray-400);
  display: flex;
  align-items: center;
  pointer-events: none;
}

.input-wrapper input {
  padding-left: 42px;
  padding-right: 42px;
  height: 48px;
  font-size: 15px;
  border-radius: var(--r-md);
  border: 1.5px solid var(--gray-200);
  background: white;
  transition: all var(--t);
  width: 100%;
}

.input-wrapper input:focus {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
  outline: none;
}

.pwd-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--gray-400);
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  transition: color var(--t);
}
.pwd-toggle:hover { color: var(--gray-700); }

.btn-submit {
  height: 50px;
  background: var(--accent);
  color: white;
  border: none;
  border-radius: var(--r-md);
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--t);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: var(--shadow-accent);
  margin-top: 4px;
}

.btn-submit:hover:not(:disabled) {
  background: var(--accent-dark);
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(14,158,142,0.32);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .auth-left { display: none; }
  .auth-right { padding: 40px 20px; }
}
</style>
