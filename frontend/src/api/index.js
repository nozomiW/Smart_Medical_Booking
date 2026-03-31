import axios from 'axios'

const API_BASE_URL = 'http://localhost:9001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000  // 120 秒，等待 AI 响应
})

// 请求拦截器 - 添加 JWT token 和 User-Id
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    const userId = localStorage.getItem('userId')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    if (userId) {
      config.headers['X-User-Id'] = userId
    }
    return config
  },
  error => Promise.reject(error)
)

// 响应拦截器
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('phone')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

/**
 * 用户服务 API  /user-service:8081
 */
export const userAPI = {
  login: (phone, password) => api.post('/user/login', { phone, password }),
  register: (phone, password) => api.post('/user/register', { phone, password }),
  insertPatient: (patient) => api.post('/user/patient/insert', patient),
  getPatients: () => api.get('/user/patient/list')
}

/**
 * 医生服务 API  /doctor-service:8082
 */
export const doctorAPI = {
  searchOnline: () => api.get('/doctor/search/online'),
  getScheduleDetail: (workDate) => api.get('/doctor/schedule/detail', { params: { workDate } }),
  getScheduleDetailById: (scheduleId) => api.get('/doctor/schedule/detail/id', { params: { scheduleId } })
}

/**
 * 订单服务 API  /order-service:8083
 * ID 均为字符串，后端存储为 VARCHAR，无精度丢失问题
 */
export const orderAPI = {
  create: (patientId, scheduleId) => api.post('/order/create', null, {
    params: { patientId, scheduleId }
  }),
  getList: () => api.get('/order/list'),
  getDetail: (orderId) => api.get('/order/detail', { params: { orderId } }),
  cancel: (orderId) => api.post('/order/cancel', null, { params: { orderId } })
}

/**
 * 支付服务 API  /pay-service:8084
 */
export const payAPI = {
  pay: (orderId) => api.post('/pay', null, { params: { orderId } })
}

/**
 * AI 服务 API  /ai-service:9006 (通过网关访问)
 */
export const aiAPI = {
  chat: (data) => api.post('/ai/chat', data),
  test: () => api.get('/ai/test')
}

export default api
