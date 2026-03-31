<template>
  <div class="app">
    <nav v-if="!isAuthPage" class="navbar">
      <div class="nav-inner">
        <div class="logo" @click="router.push('/')">
          <div class="logo-mark">
            <svg viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#0e9e8e"/>
              <path d="M14 7v14M7 14h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="logo-text">智慧医疗</span>
        </div>

        <ul class="nav-links">
          <li>
            <router-link to="/" class="nav-item">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/></svg>
              首页
            </router-link>
          </li>
          <li>
            <router-link to="/doctors" class="nav-item">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
              医生团队
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/bookings" class="nav-item">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              我的预约
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/patients" class="nav-item">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/></svg>
              就诊人
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/ai-chat" class="nav-item">
              <svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clip-rule="evenodd"/></svg>
              AI 助手
            </router-link>
          </li>
        </ul>

        <div class="nav-actions">
          <template v-if="!isLoggedIn">
            <button class="btn-ghost btn-sm" @click="router.push('/login')">登录</button>
            <button class="btn-accent btn-sm" @click="router.push('/register')">免费注册</button>
          </template>
          <template v-else>
            <div class="user-pill">
              <div class="user-avatar">{{ userInitial }}</div>
              <span class="user-phone">{{ userName }}</span>
              <button class="logout-btn" @click="handleLogout" title="退出">
                <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd"/></svg>
              </button>
            </div>
          </template>
        </div>
      </div>
    </nav>

    <main class="main" :class="{ 'main-auth': isAuthPage }">
      <router-view />
    </main>

    <footer v-if="!isAuthPage" class="footer">
      <div class="container">
        <div class="footer-inner">
          <div class="footer-brand">
            <div class="logo-mark small">
              <svg viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#0e9e8e"/>
                <path d="M14 7v14M7 14h14" stroke="white" stroke-width="2.5" stroke-linecap="round"/>
              </svg>
            </div>
            <span>智慧医疗挂号平台</span>
          </div>
          <p class="footer-copy">&copy; 2026 Smart Medical Booking. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'App',
  setup() {
    const router = useRouter()
    const route = useRoute()

    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    const userName = computed(() => {
      const phone = localStorage.getItem('phone')
      return phone ? phone.substring(0, 3) + '****' + phone.substring(7) : '用户'
    })
    const userInitial = computed(() => {
      const phone = localStorage.getItem('phone')
      return phone ? phone.charAt(2) : '用'
    })
    const isAuthPage = computed(() => ['/login', '/register'].includes(route.path))

    const handleLogout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('phone')
      router.push('/')
    }

    return { isLoggedIn, userName, userInitial, isAuthPage, handleLogout, router }
  }
}
</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ── Navbar ── */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gray-200);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  flex-shrink: 0;
}

.logo-mark svg { display: block; }
.logo-mark.small svg { width: 22px; height: 22px; }

.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -0.02em;
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  color: var(--gray-600);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  border-radius: var(--r-md);
  transition: all var(--t);
  white-space: nowrap;
}

.nav-item svg { width: 16px; height: 16px; flex-shrink: 0; }

.nav-item:hover {
  color: var(--accent);
  background: var(--accent-light);
}

.nav-item.router-link-active {
  color: var(--accent);
  background: var(--accent-light);
  font-weight: 600;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.btn-ghost {
  padding: 7px 16px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 500;
  background: transparent;
  border: 1.5px solid var(--gray-200);
  color: var(--gray-700);
  cursor: pointer;
  transition: all var(--t);
}
.btn-ghost:hover { background: var(--gray-100); border-color: var(--gray-300); }

.btn-accent {
  padding: 7px 16px;
  border-radius: var(--r-md);
  font-size: 14px;
  font-weight: 600;
  background: var(--accent);
  color: white;
  border: none;
  cursor: pointer;
  transition: all var(--t);
  box-shadow: 0 2px 8px rgba(14,158,142,0.25);
}
.btn-accent:hover { background: var(--accent-dark); transform: translateY(-1px); }

.user-pill {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 5px 5px 5px 12px;
  background: var(--gray-50);
  border: 1px solid var(--gray-200);
  border-radius: var(--r-full);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-phone {
  font-size: 13px;
  font-weight: 500;
  color: var(--gray-700);
  font-family: var(--font-mono);
}

.logout-btn {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: var(--gray-400);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--t);
  padding: 0;
}
.logout-btn:hover { background: var(--danger-bg); color: var(--danger); }

/* ── Main ── */
.main {
  flex: 1;
  padding: 0;
}

.main-auth {
  min-height: 100vh;
}

/* ── Footer ── */
.footer {
  border-top: 1px solid var(--gray-200);
  background: white;
  padding: 20px 0;
  margin-top: auto;
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-600);
}

.footer-copy {
  font-size: 13px;
  color: var(--gray-400);
}

@media (max-width: 768px) {
  .nav-inner { padding: 0 16px; }
  .nav-links { display: none; }
  .logo-text { display: none; }
  .footer-inner { flex-direction: column; text-align: center; }
}
</style>
