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
 * 用户服务 API
 * 后端接口: user-service:8081
 */
export const userAPI = {
  // POST /user/login - 用户登录
  // 请求: { phone, password }
  // 响应: { token, userId } (JSON字符串)
  login: (phone, password) => api.post('/user/login', { phone, password }),
  
  // POST /user/register - 用户注册
  // 请求: { phone, password }
  // 响应: 注册成功消息
  register: (phone, password) => api.post('/user/register', { phone, password }),
  
  // POST /user/patient/insert - 添加就诊人
  // 请求头: X-User-Id
  // 请求: { name, idCard, gender, age, phone? }
  // 响应: 添加成功消息
  insertPatient: (patient) => api.post('/user/patient/insert', patient),
  
  // GET /user/patient/list - 获取就诊人列表
  // 请求头: X-User-Id
  // 响应: Patient[] 数组
  getPatients: () => api.get('/user/patient/list')
}

/**
 * 医生服务 API
 * 后端接口: doctor-service:8082
 */
export const doctorAPI = {
  // GET /doctor/search/online - 获取在线医生列表
  // 响应: Doctor[] 数组
  searchOnline: () => api.get('/doctor/search/online'),
  
  // GET /doctor/schedule/detail - 获取排班详情
  // 参数: workDate (YYYY-MM-DD格式)
  // 响应: Schedule[] 数组
  getScheduleDetail: (workDate) => api.get('/doctor/schedule/detail', { params: { workDate } }),
  
  // GET /doctor/schedule/detail/id - 按ID获取排班详情
  // 参数: scheduleId
  // 响应: ScheduleDetailDTO 对象
  getScheduleDetailById: (scheduleId) => api.get('/doctor/schedule/detail/id', { params: { scheduleId } })
}

/**
 * 订单服务 API
 * 后端接口：order-service:8083
 */
export const orderAPI = {
  // POST /order/create - 创建预约
  // 请求头：X-User-Id
  // 参数：patientId, scheduleId
  // 响应：{ code, message, data }
  create: (patientId, scheduleId) => api.post('/order/create', null, { 
    params: { 
      patientId,
      scheduleId
    } 
  }),
  
  // GET /order/list - 获取预约列表
  // 请求头: X-User-Id
  // 响应: Order[] 数组
  // 注意: 响应中的 ID 字段会保持为字符串
  getList: () => api.get('/order/list'),
  
  // GET /order/detail - 获取预约详情
  // 参数：orderId
  // 响应：OrderDetailDTO 对象
  getDetail: (orderId) => api.get('/order/detail', { params: { orderId } })
}

/**
 * 支付服务 API
 * 后端接口: pay-service:8084
 */
export const payAPI = {
  // POST /pay - 支付预约
  // 请求头：X-User-Id
  // 参数：orderId
  // 响应：{ code, message }
  pay: (orderId) => api.post('/pay', null, { params: { orderId } })
}

export default api
