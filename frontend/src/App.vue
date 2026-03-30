<template>
  <div class="app">
    <!-- 认证页面不显示导航栏 -->
    <nav v-if="!isAuthPage" class="navbar">
      <div class="container navbar-content">
        <div class="logo" @click="router.push('/')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
          <span>智慧医疗挂号平台</span>
        </div>
        <ul class="nav-links">
          <li>
            <router-link to="/" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>首页</span>
            </router-link>
          </li>
          <li>
            <router-link to="/doctors" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span>医生团队</span>
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/bookings" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              <span>我的预约</span>
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/patients" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              <span>我的就诊人</span>
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/ai-chat" class="nav-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <span>AI 助手</span>
            </router-link>
          </li>
        </ul>
        <div class="user-actions">
          <template v-if="!isLoggedIn">
            <button class="btn btn-outline" @click="router.push('/login')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              登录
            </button>
            <button class="btn btn-primary" @click="router.push('/register')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
              注册
            </button>
          </template>
          <template v-else>
            <div class="user-menu">
              <div class="user-info">
                <div class="avatar">{{ userInitial }}</div>
                <div class="user-details">
                  <span class="user-name">{{ userName }}</span>
                </div>
              </div>
              <button class="btn btn-logout" @click="handleLogout" title="退出登录">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>
    <main :class="['main-content', { 'full-height': isAuthPage }]">
      <router-view />
    </main>
    <footer v-if="!isAuthPage" class="footer">
      <div class="container">
        <p>&copy; 2026 智慧医疗挂号系统 | 为您提供便捷的医疗服务</p>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const userId = ref(null)

    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    const userName = computed(() => {
      const phone = localStorage.getItem('phone')
      return phone ? phone.substring(0, 3) + '****' + phone.substring(7) : '用户'
    })
    const userInitial = computed(() => {
      const phone = localStorage.getItem('phone')
      return phone ? phone.charAt(0) : '用'
    })
    const isAuthPage = computed(() => {
      const currentRoute = router.currentRoute.value.path
      return ['/login', '/register'].includes(currentRoute)
    })

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('phone')
      router.push('/')
    }

    onMounted(() => {
      userId.value = localStorage.getItem('userId')
    })

    return { 
      isLoggedIn, 
      userName, 
      userInitial,
      isAuthPage,
      handleLogout,
      router 
    }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: #f7fafc;
}

.navbar {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  padding: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.logo:hover {
  opacity: 0.8;
}

.logo svg {
  width: 32px;
  height: 32px;
  color: #667eea;
}

.logo span {
  font-size: 20px;
  font-weight: 600;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 8px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  color: #4a5568;
  text-decoration: none;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-item:hover {
  background: #edf2f7;
  color: #667eea;
}

.nav-item.router-link-active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
}

.nav-item svg {
  width: 20px;
  height: 20px;
}

.user-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn svg {
  width: 18px;
  height: 18px;
}

.btn-outline {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
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

.btn-logout {
  background: transparent;
  color: #718096;
  border: 1px solid #e2e8f0;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-logout:hover {
  background: #fed7d7;
  color: #c53030;
  border-color: #feb2b2;
  transform: scale(1.05);
}

.btn-logout svg {
  width: 20px;
  height: 20px;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.main-content {
  flex: 1;
  padding: 0;
  min-height: calc(100vh - 180px);
}

.main-content.full-height {
  min-height: 100vh;
  padding: 0;
}

.footer {
  background: white;
  border-top: 1px solid #e2e8f0;
  padding: 24px;
  margin-top: auto;
}

.footer p {
  margin: 0;
  color: #718096;
  font-size: 14px;
  text-align: center;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-content {
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  }
  
  .nav-links {
    width: 100%;
    justify-content: center;
  }
  
  .nav-item {
    flex-direction: column;
    text-align: center;
    gap: 4px;
    padding: 8px 12px;
    font-size: 12px;
  }
  
  .user-actions {
    width: 100%;
    justify-content: center;
  }
  
  .btn {
    padding: 8px 16px;
    font-size: 13px;
  }
  
  .logo span {
    font-size: 18px;
  }
  
  .logo svg {
    width: 28px;
    height: 28px;
  }
}
</style>
