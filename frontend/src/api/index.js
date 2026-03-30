import axios from 'axios'

const API_BASE_URL = 'http://localhost:9001'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000
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
  // POST /user/login
  login: (phone, password) => api.post('/user/login', { phone, password }),

  // POST /user/register
  register: (phone, password) => api.post('/user/register', { phone, password }),

  // POST /user/patient/insert  请求头: X-User-Id
  insertPatient: (patient) => api.post('/user/patient/insert', patient),

  // GET /user/patient/list  请求头: X-User-Id
  getPatients: () => api.get('/user/patient/list')
}

/**
 * 医生服务 API  /doctor-service:8082
 */
export const doctorAPI = {
  // GET /doctor/search/online
  searchOnline: () => api.get('/doctor/search/online'),

  // GET /doctor/schedule/detail?workDate=YYYY-MM-DD
  getScheduleDetail: (workDate) => api.get('/doctor/schedule/detail', { params: { workDate } }),

  // GET /doctor/schedule/detail/id?scheduleId=xxx
  getScheduleDetailById: (scheduleId) => api.get('/doctor/schedule/detail/id', { params: { scheduleId: String(scheduleId) } })
}

/**
 * 订单服务 API  /order-service:8083
 * 注意: 所有 ID 用字符串传输，避免 JS Number 精度丢失
 */
export const orderAPI = {
  // POST /order/create?patientId=xxx&scheduleId=xxx  请求头: X-User-Id
  create: (patientId, scheduleId) => api.post('/order/create', null, {
    params: {
      patientId: String(patientId),
      scheduleId: String(scheduleId)
    }
  }),

  // GET /order/list  请求头: X-User-Id
  getList: () => api.get('/order/list'),

  // GET /order/detail?orderId=xxx
  getDetail: (orderId) => api.get('/order/detail', { params: { orderId: String(orderId) } }),

  // POST /order/cancel?orderId=xxx  请求头: X-User-Id  状态标记为 -1
  cancel: (orderId) => api.post('/order/cancel', null, { params: { orderId: String(orderId) } })
}

/**
 * 支付服务 API  /pay-service:8084
 */
export const payAPI = {
  // POST /pay?orderId=xxx  请求头: X-User-Id
  pay: (orderId) => api.post('/pay', null, { params: { orderId: BigInt(orderId).toString() } })
}

export default api
