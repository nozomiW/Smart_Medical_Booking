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
        <h1>开启您的健康之旅</h1>
        <p>创建账号，即可享受在线挂号、就诊人管理等全套智慧医疗服务，完全免费。</p>
        <div class="auth-illustration">
          <div class="ill-card">
            <div class="ill-icon">🏥</div>
            <div>
              <div class="ill-title">全科室覆盖</div>
              <div class="ill-sub">内科、外科、儿科等 10+ 科室</div>
            </div>
          </div>
          <div class="ill-card">
            <div class="ill-icon">⚡</div>
            <div>
              <div class="ill-title">实时号源</div>
              <div class="ill-sub">毫秒级同步，不再扑空</div>
            </div>
          </div>
          <div class="ill-card">
            <div class="ill-icon">🔒</div>
            <div>
              <div class="ill-title">数据安全</div>
              <div class="ill-sub">加密存储，隐私保护</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="auth-right">
      <div class="auth-card">
        <div class="auth-card-header">
          <h2>创建账号</h2>
          <p>已有账号？<router-link to="/login" class="auth-link">去登录</router-link></p>
        </div>

        <div v-if="error" class="alert alert-error">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
          {{ error }}
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
          <div class="form-group">
            <label for="phone">手机号</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/></svg>
              </span>
              <input id="phone" v-model="form.phone" type="tel" placeholder="请输入 11 位手机号" required maxlength="11">
            </div>
          </div>

          <div class="form-group">
            <label for="password">密码</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd"/></svg>
              </span>
              <input id="password" v-model="form.password" :type="showPwd ? 'text' : 'password'" placeholder="至少 6 位密码" required minlength="6">
              <button type="button" class="pwd-toggle" @click="showPwd = !showPwd">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
            <div v-if="form.password" class="pwd-strength">
              <div class="pwd-strength-bar">
                <div class="pwd-strength-fill" :style="{ width: pwdStrength.pct + '%', background: pwdStrength.color }"></div>
              </div>
              <span class="pwd-strength-label" :style="{ color: pwdStrength.color }">{{ pwdStrength.label }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <div class="input-wrapper">
              <span class="input-icon">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
              </span>
              <input id="confirmPassword" v-model="form.confirmPassword" :type="showConfirm ? 'text' : 'password'" placeholder="再次输入密码" required>
              <button type="button" class="pwd-toggle" @click="showConfirm = !showConfirm">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </div>

          <button type="submit" class="btn-submit" :disabled="loading">
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '注册中…' : '创建账号' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../api'

export default {
  name: 'Register',
  setup() {
    const router = useRouter()
    const form = ref({ phone: '', password: '', confirmPassword: '' })
    const loading = ref(false)
    const error = ref('')
    const showPwd = ref(false)
    const showConfirm = ref(false)

    const pwdStrength = computed(() => {
      const p = form.value.password
      if (!p) return { pct: 0, color: '#e2e8f0', label: '' }
      if (p.length < 6) return { pct: 25, color: '#dc2626', label: '过短' }
      if (p.length < 8) return { pct: 50, color: '#d97706', label: '较弱' }
      if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { pct: 100, color: '#16a34a', label: '强' }
      return { pct: 75, color: '#0e9e8e', label: '中等' }
    })

    const handleRegister = async () => {
      if (!form.value.phone || !form.value.password || !form.value.confirmPassword) {
        error.value = '请填写所有字段'; return
      }
      if (form.value.password !== form.value.confirmPassword) {
        error.value = '两次密码不一致'; return
      }
      if (form.value.password.length < 6) {
        error.value = '密码至少 6 位'; return
      }
      loading.value = true
      error.value = ''
      try {
        await userAPI.register(form.value.phone, form.value.password)
        router.push('/login')
      } catch (err) {
        error.value = '注册失败，手机号可能已被注册'
      } finally {
        loading.value = false
      }
    }

    return { form, loading, error, showPwd, showConfirm, pwdStrength, handleRegister }
  }
}
</script>

<style scoped>
.auth-page { display: flex; min-height: 100vh; background: var(--surface); }

.auth-left {
  flex: 0 0 42%;
  background: linear-gradient(145deg, var(--ink) 0%, #1a3a4a 60%, #0b5c52 100%);
  display: flex; align-items: center; justify-content: center;
  padding: 60px 56px; position: relative; overflow: hidden;
}
.auth-left::before {
  content: ''; position: absolute;
  width: 500px; height: 500px; border-radius: 50%;
  background: radial-gradient(circle, rgba(14,158,142,0.2) 0%, transparent 70%);
  top: -100px; right: -100px;
}
.auth-left-content { position: relative; z-index: 1; max-width: 380px; }
.brand { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
.brand svg { width: 32px; height: 32px; }
.brand span { font-size: 18px; font-weight: 700; color: white; letter-spacing: -0.02em; }
.auth-left h1 {
  font-size: 32px; font-weight: 700; color: white; line-height: 1.2;
  letter-spacing: -0.03em; margin-bottom: 14px;
  font-family: var(--font-serif); font-style: italic;
}
.auth-left > div > p { font-size: 14px; color: rgba(255,255,255,0.6); line-height: 1.7; margin-bottom: 32px; }
.auth-illustration { display: flex; flex-direction: column; gap: 10px; }
.ill-card {
  display: flex; align-items: center; gap: 14px;
  background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1);
  border-radius: var(--r-lg); padding: 12px 16px;
}
.ill-icon { font-size: 20px; }
.ill-title { font-size: 13px; font-weight: 600; color: white; margin-bottom: 2px; }
.ill-sub { font-size: 12px; color: rgba(255,255,255,0.5); }

.auth-right { flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px 24px; }
.auth-card { width: 100%; max-width: 420px; }
.auth-card-header { margin-bottom: 28px; }
.auth-card-header h2 { font-size: 26px; font-weight: 700; color: var(--ink); letter-spacing: -0.03em; margin-bottom: 6px; }
.auth-card-header p { font-size: 14px; color: var(--gray-500); }
.auth-link { color: var(--accent); font-weight: 600; text-decoration: none; }
.auth-link:hover { text-decoration: underline; }
.auth-form { display: flex; flex-direction: column; gap: 16px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 12px; font-weight: 700; color: var(--gray-500); text-transform: uppercase; letter-spacing: 0.06em; }
.input-wrapper { position: relative; display: flex; align-items: center; }
.input-icon { position: absolute; left: 14px; color: var(--gray-400); display: flex; align-items: center; pointer-events: none; }
.input-wrapper input {
  padding-left: 42px; padding-right: 42px; height: 46px; font-size: 14px;
  border-radius: var(--r-md); border: 1.5px solid var(--gray-200);
  background: white; transition: all var(--t); width: 100%;
}
.input-wrapper input:focus { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow); outline: none; }
.pwd-toggle { position: absolute; right: 12px; background: none; border: none; color: var(--gray-400); cursor: pointer; padding: 4px; display: flex; align-items: center; transition: color var(--t); }
.pwd-toggle:hover { color: var(--gray-700); }
.pwd-strength { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.pwd-strength-bar { flex: 1; height: 4px; background: var(--gray-100); border-radius: var(--r-full); overflow: hidden; }
.pwd-strength-fill { height: 100%; border-radius: var(--r-full); transition: all 0.3s ease; }
.pwd-strength-label { font-size: 12px; font-weight: 600; min-width: 28px; }
.btn-submit {
  height: 48px; background: var(--accent); color: white; border: none;
  border-radius: var(--r-md); font-size: 15px; font-weight: 600; cursor: pointer;
  transition: all var(--t); display: flex; align-items: center; justify-content: center;
  gap: 8px; box-shadow: var(--shadow-accent); margin-top: 4px;
}
.btn-submit:hover:not(:disabled) { background: var(--accent-dark); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

@media (max-width: 768px) {
  .auth-left { display: none; }
  .auth-right { padding: 40px 20px; }
}
</style>