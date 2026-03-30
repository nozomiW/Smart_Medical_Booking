<template>
  <div class="home">
    <div class="container">
      <!-- CTA 区域 - 未登录显示 -->
      <section v-if="!isLoggedIn" class="cta-banner">
        <div class="cta-content">
          <h2>欢迎使用智慧医疗挂号平台</h2>
          <p>登录后享受更多便捷服务</p>
          <div class="cta-buttons">
            <router-link to="/login" class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              立即登录
            </router-link>
            <router-link to="/register" class="btn btn-outline">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              免费注册
            </router-link>
          </div>
        </div>
      </section>

      <!-- 英雄横幅 -->
      <section class="hero">
        <div class="hero-content">
          <h2>{{ isLoggedIn ? '欢迎回来' : '欢迎来到智能医疗预约系统' }}</h2>
          <p>快速便捷地预约您需要的医疗服务</p>
          <router-link to="/doctors" class="btn btn-primary btn-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            查看医生团队
          </router-link>
        </div>
      </section>

      <!-- 特色服务 -->
      <section class="features">
        <h3>为什么选择我们</h3>
        <div class="grid grid-3">
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
              </svg>
            </div>
            <h4>快速预约</h4>
            <p>只需几步即可完成预约，节省您的宝贵时间</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h4>专业医生</h4>
            <p>汇集各科室优秀医生，为您提供专业服务</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h4>隐私保护</h4>
            <p>严格保护您的个人信息和医疗隐私</p>
          </div>
        </div>
      </section>

      <!-- 数据统计 -->
      <section class="stats">
        <div class="stat-item">
          <div class="stat-number">500+</div>
          <div class="stat-label">注册医生</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">10000+</div>
          <div class="stat-label">成功预约</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">98%</div>
          <div class="stat-label">用户满意度</div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Home',
  setup() {
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    
    return { isLoggedIn }
  }
}
</script>

<style scoped>
.home {
  padding: 40px 0;
}

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
}

.cta-content {
  text-align: center;
  color: white;
}

.cta-content h2 {
  font-size: 32px;
  margin: 0 0 12px 0;
}

.cta-content p {
  font-size: 18px;
  margin: 0 0 24px 0;
  opacity: 0.95;
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  border: none;
  font-size: 15px;
}

.btn svg {
  width: 20px;
  height: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.btn-outline:hover {
  background: white;
  color: #667eea;
  transform: translateY(-2px);
}

.btn-lg {
  padding: 14px 28px;
  font-size: 16px;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 60px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 16px;
  margin-bottom: 60px;
}

.hero-content h2 {
  font-size: 36px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 16px;
}

.hero-content p {
  font-size: 18px;
  color: #718096;
  margin-bottom: 24px;
}

/* Features */
.features {
  margin-bottom: 60px;
}

.features h3 {
  font-size: 28px;
  text-align: center;
  margin-bottom: 40px;
  color: #2d3748;
}

.grid-3 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
}

.feature-card {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.15);
}

.feature-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
}

.feature-icon svg {
  width: 32px;
  height: 32px;
}

.feature-card h4 {
  font-size: 20px;
  color: #2d3748;
  margin-bottom: 12px;
}

.feature-card p {
  color: #718096;
  font-size: 15px;
  line-height: 1.6;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  text-align: center;
}

.stat-item {
  background: white;
  padding: 32px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.stat-label {
  color: #718096;
  font-size: 15px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .cta-banner {
    padding: 30px 20px;
  }
  
  .cta-content h2 {
    font-size: 24px;
  }
  
  .cta-content p {
    font-size: 16px;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .hero {
    padding: 40px 20px;
  }
  
  .hero-content h2 {
    font-size: 28px;
  }
  
  .hero-content p {
    font-size: 16px;
  }
  
  .features h3 {
    font-size: 24px;
  }
  
  .grid-3 {
    grid-template-columns: 1fr;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
