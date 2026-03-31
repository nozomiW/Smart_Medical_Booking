<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-blob blob-1"></div>
        <div class="hero-blob blob-2"></div>
        <div class="grid-lines"></div>
      </div>
      <div class="container hero-content">
        <div class="hero-badge">智慧医疗 · 便捷挂号</div>
        <h1 class="hero-title">
          预约挂号，<br>
          <span class="hero-title-accent">从未如此简单</span>
        </h1>
        <p class="hero-desc">专业医生团队，实时号源查询，一键完成预约。让您的就医体验更高效、更舒适。</p>
        <div class="hero-actions">
          <router-link to="/doctors" class="cta-primary">
            <svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clip-rule="evenodd"/>
            </svg>
            立即预约挂号
          </router-link>
          <router-link v-if="!isLoggedIn" to="/register" class="cta-secondary">免费注册账号</router-link>
          <router-link v-else to="/bookings" class="cta-secondary">查看我的预约</router-link>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-num">500<sup>+</sup></span>
            <span class="stat-label">注册医生</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">10K<sup>+</sup></span>
            <span class="stat-label">成功预约</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-num">98<sup>%</sup></span>
            <span class="stat-label">满意度</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">为什么选择我们</p>
          <h2 class="section-title">专为患者设计的就医体验</h2>
        </div>
        <div class="features-grid">
          <div class="feature-card" v-for="f in features" :key="f.title">
            <div class="feature-icon" :style="{ background: f.bg }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" :style="{ color: f.color }">
                <path v-if="f.icon === 'bolt'" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                <path v-if="f.icon === 'shield'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path v-if="f.icon === 'clock'" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 5v5l4 2"/>
                <path v-if="f.icon === 'doc'" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 0v6h6"/>
              </svg>
            </div>
            <div class="feature-body">
              <h3>{{ f.title }}</h3>
              <p>{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Steps -->
    <section class="steps">
      <div class="container">
        <div class="section-header">
          <p class="section-eyebrow">操作指引</p>
          <h2 class="section-title">三步完成预约</h2>
        </div>
        <div class="steps-row">
          <div class="step" v-for="(s, i) in steps" :key="s.title">
            <div class="step-num">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3>{{ s.title }}</h3>
            <p>{{ s.desc }}</p>
          </div>
          <div class="step-arrow" v-for="n in 2" :key="n">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Banner -->
    <section v-if="!isLoggedIn" class="cta-band">
      <div class="container cta-band-inner">
        <div>
          <h2>准备好开始了吗？</h2>
          <p>注册账号，立即享受便捷的在线挂号服务</p>
        </div>
        <div class="cta-band-actions">
          <router-link to="/register" class="cta-primary">免费注册</router-link>
          <router-link to="/login" class="cta-band-login">已有账号，去登录</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Home',
  setup() {
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))

    const features = [
      { icon: 'bolt', title: '极速预约', desc: '实时号源同步，毫秒级响应，几步操作即可锁定心仪医生的号源。', color: '#0e9e8e', bg: '#e0f7f5' },
      { icon: 'shield', title: '隐私保护', desc: '严格加密存储个人与医疗信息，全程保护您的数据安全。', color: '#2563eb', bg: '#dbeafe' },
      { icon: 'clock', title: '随时随地', desc: '7×24 小时在线，随时查询排班、发起预约或管理就诊人。', color: '#d97706', bg: '#fef3c7' },
      { icon: 'doc', title: '记录管理', desc: '预约历史一目了然，支持查看详情、取消或重新预约。', color: '#16a34a', bg: '#dcfce7' },
    ]

    const steps = [
      { title: '选择医生', desc: '按日期筛选，查看各科室医生实时排班与剩余号源。' },
      { title: '填写信息', desc: '选择就诊人，确认预约信息，一键提交。' },
      { title: '完成就诊', desc: '按时到院就诊，完成支付，享受专业医疗服务。' },
    ]

    return { isLoggedIn, features, steps }
  }
}
</script>

<style scoped>
.home {
  background: var(--surface);
}

/* Hero */
.hero {
  position: relative;
  overflow: hidden;
  background: white;
  padding: 80px 0 72px;
  border-bottom: 1px solid var(--gray-100);
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.hero-blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.45;
}

.blob-1 {
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, #e0f7f5 0%, transparent 70%);
  top: -180px;
  right: -100px;
}

.blob-2 {
  width: 360px;
  height: 360px;
  background: radial-gradient(circle, #dbeafe 0%, transparent 70%);
  bottom: -120px;
  left: -80px;
}

.grid-lines {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(var(--gray-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--gray-100) 1px, transparent 1px);
  background-size: 48px 48px;
  opacity: 0.4;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 680px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 14px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: var(--r-full);
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 24px;
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: clamp(36px, 5vw, 56px);
  font-weight: 700;
  line-height: 1.15;
  color: var(--ink);
  letter-spacing: -0.03em;
  margin-bottom: 20px;
}

.hero-title-accent {
  color: var(--accent);
}

.hero-desc {
  font-size: 17px;
  color: var(--gray-500);
  line-height: 1.7;
  max-width: 520px;
  margin-bottom: 36px;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 48px;
}

.cta-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 24px;
  background: var(--accent);
  color: white;
  border-radius: var(--r-md);
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  transition: all var(--t);
  box-shadow: var(--shadow-accent);
}
.cta-primary:hover {
  background: var(--accent-dark);
  transform: translateY(-2px);
  box-shadow: 0 10px 32px rgba(14,158,142,0.32);
}

.cta-secondary {
  display: inline-flex;
  align-items: center;
  padding: 13px 20px;
  color: var(--gray-700);
  border: 1.5px solid var(--gray-200);
  border-radius: var(--r-md);
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  background: white;
  transition: all var(--t);
}
.cta-secondary:hover {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-light);
}

.hero-stats {
  display: flex;
  align-items: center;
  gap: 24px;
}

.stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-num {
  font-size: 28px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.04em;
  line-height: 1;
  font-family: var(--font-serif);
}

.stat-num sup {
  font-size: 16px;
  font-family: var(--font-sans);
}

.stat-label {
  font-size: 12px;
  color: var(--gray-400);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-divider {
  width: 1px;
  height: 36px;
  background: var(--gray-200);
}

/* Features */
.features {
  padding: 80px 0;
}

.section-header {
  text-align: center;
  margin-bottom: 52px;
}

.section-eyebrow {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--accent);
  margin-bottom: 10px;
}

.section-title {
  font-size: clamp(24px, 3vw, 34px);
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.03em;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.feature-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--r-lg);
  padding: 28px 24px;
  display: flex;
  gap: 18px;
  align-items: flex-start;
  transition: all var(--t);
}

.feature-card:hover {
  border-color: var(--accent);
  box-shadow: var(--shadow-md);
  transform: translateY(-3px);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--r-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.feature-icon svg {
  width: 22px;
  height: 22px;
}

.feature-body h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 6px;
}

.feature-body p {
  font-size: 13px;
  color: var(--gray-500);
  line-height: 1.6;
}

/* Steps */
.steps {
  padding: 80px 0;
  background: white;
  border-top: 1px solid var(--gray-100);
  border-bottom: 1px solid var(--gray-100);
}

.steps-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  gap: 0;
  align-items: start;
}

.step {
  padding: 0 24px;
  text-align: center;
}

.step-num {
  font-size: 42px;
  font-weight: 700;
  font-family: var(--font-serif);
  color: var(--accent-light);
  -webkit-text-stroke: 1.5px var(--accent);
  line-height: 1;
  margin-bottom: 16px;
}

.step h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  margin-bottom: 8px;
}

.step p {
  font-size: 13px;
  color: var(--gray-500);
  line-height: 1.6;
}

.step-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  color: var(--gray-300);
}

.step-arrow svg {
  width: 24px;
  height: 24px;
}

/* CTA band */
.cta-band {
  padding: 64px 0;
  background: linear-gradient(135deg, var(--ink) 0%, var(--ink-muted) 100%);
}

.cta-band-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
}

.cta-band h2 {
  font-size: 26px;
  color: white;
  margin-bottom: 6px;
}

.cta-band p {
  color: rgba(255,255,255,0.6);
  font-size: 15px;
}

.cta-band-actions {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.cta-band-login {
  color: 
  rgba(255,255,255,0.7);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color var(--t);
}
.cta-band-login:hover { color: white; }

@media (max-width: 768px) {
  .hero { padding: 56px 0 48px; }
  .steps-row { grid-template-columns: 1fr; gap: 32px; }
  .step-arrow { display: none; }
  .cta-band-inner { flex-direction: column; text-align: center; }
  .hero-stats { gap: 16px; }
}
</style>
