<template>
  <div class="doctors">
    <div class="container">
      <h2>医生排班表</h2>
      
      <!-- 搜索和日期筛选 -->
      <div class="filters">
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="搜索医生名称..."
          @input="handleSearch"
        >
        <div class="date-picker-wrapper">
          <div class="date-nav">
            <button @click="changeDate(-1)" class="btn-date-nav" :disabled="isPastDate(-1)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <div class="current-date-display" @click="showDatePicker = !showDatePicker">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span>{{ currentDateDisplay }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <button @click="changeDate(1)" class="btn-date-nav" :disabled="isToday">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          
          <!-- 日期选择面板 -->
          <div v-if="showDatePicker" class="date-picker-panel">
            <div class="date-picker-header">
              <button @click="changeMonth(-1)" class="btn-month-nav" :disabled="isCurrentMonth">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="15 18 9 12 15 6"/>
                </svg>
              </button>
              <span class="month-title">{{ currentMonthTitle }}</span>
              <button @click="changeMonth(1)" class="btn-month-nav">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div class="date-picker-grid">
              <div class="date-picker-weekday">日</div>
              <div class="date-picker-weekday">一</div>
              <div class="date-picker-weekday">二</div>
              <div class="date-picker-weekday">三</div>
              <div class="date-picker-weekday">四</div>
              <div class="date-picker-weekday">五</div>
              <div class="date-picker-weekday">六</div>
              
              <div 
                v-for="day in calendarDays" 
                :key="day.dateStr"
                @click="selectDate(day)"
                :class="['date-picker-day', { 
                  'is-today': day.isToday, 
                  'is-selected': isSelectedDate(day),
                  'is-disabled': day.isPast || day.isFuture,
                  'is-weekend': day.isWeekend
                }]"
              >
                <span class="day-num">{{ day.day }}</span>
                <span class="day-label">{{ day.label }}</span>
              </div>
            </div>
            <div class="date-picker-footer">
              <button @click="selectToday" class="btn-today">今天</button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="loading-container">
        <div class="loading-spinner"></div>
        <p>加载中...</p>
      </div>

      <!-- 空状态 -->
      <div v-else-if="filteredDoctors.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <p>未找到匹配的医生</p>
      </div>

      <!-- 医生列表 -->
      <div v-else class="doctor-list">
        <div v-for="doctor in filteredDoctors" :key="doctor.scheduleId || doctor.docId" class="doctor-card card">
          <div class="doctor-header">
            <div class="avatar">{{ doctor.docName ? doctor.docName.charAt(0) : '医' }}</div>
            <div class="doctor-info">
              <h3>{{ doctor.docName || '未知医生' }}</h3>
              <p class="department">{{ doctor.deptId ? '科室' + doctor.deptId : '科室' }}</p>
              <p class="title">{{ doctor.docTitle || '' }}</p>
            </div>
            <div class="fee-tag">
              <span class="label">挂号费</span>
              <span class="amount">¥{{ doctor.docFee }}</span>
            </div>
          </div>
          
          <!-- 号源情况 -->
          <div class="schedule-status">
            <div class="status-badge" :class="getStatusClass(doctor)">
              <div class="badge-icon">
                <svg v-if="getAvailableNum(doctor) > 10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
                <svg v-else-if="getAvailableNum(doctor) > 0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="23" y1="1" x2="1" y2="23"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                </svg>
              </div>
              <div class="badge-text">
                <span class="status-text">{{ getStatusText(doctor) }}</span>
                <span class="num-text">剩余 {{ getAvailableNum(doctor) }} 个号源</span>
              </div>
            </div>
          </div>

          <div class="doctor-actions">
            <button 
              v-if="isLoggedIn && getAvailableNum(doctor) > 0" 
              @click="selectDoctor(doctor)"
              class="btn btn-primary"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10 9 9 9 8 9"/>
              </svg>
              预约挂号
            </button>
            <button 
              v-else-if="isLoggedIn"
              disabled
              class="btn btn-disabled"
            >
              已满号
            </button>
            <router-link 
              v-else
              to="/login" 
              class="btn btn-outline"
            >
              登录后预约
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择就诊人弹窗 -->
    <div v-if="showPatientModal" class="modal-overlay" @click="closePatientModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择就诊人</h3>
          <button @click="closePatientModal" class="btn-close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="patients.length === 0" class="no-patients">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            <p>暂无就诊人信息</p>
            <button @click="goToAddPatient" class="btn btn-primary">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              添加就诊人
            </button>
          </div>
          <div v-else class="patient-list">
            <div 
              v-for="patient in patients" 
              :key="patient.id"
              @click="confirmBooking(patient)"
              class="patient-item"
            >
              <div class="patient-avatar">{{ patient.name ? patient.name.charAt(0) : '就' }}</div>
              <div class="patient-info">
                <div class="patient-name">{{ patient.name || '未知患者' }}</div>
                <div class="patient-detail">{{ patient.idCard }} · {{ patient.gender === 1 ? '男' : (patient.gender === 0 ? '女' : '未知') }}</div>
              </div>
              <div class="check-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 11 12 14 22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div v-if="patients.length > 0" class="modal-footer">
          <button @click="goToAddPatient" class="btn btn-outline">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            添加新就诊人
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doctorAPI, userAPI, orderAPI } from '../api'

export default {
  name: 'Doctors',
  setup() {
    const router = useRouter()
    const doctors = ref([])
    const loading = ref(false)
    const searchQuery = ref('')
    const currentDate = ref(new Date())
    const showDatePicker = ref(false)
    const selectedDoctor = ref(null)
    const patients = ref([])
    const pickerMonth = ref(new Date().getMonth())
    const pickerYear = ref(new Date().getFullYear())

    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    
    const filteredDoctors = computed(() => {
      return doctors.value.filter(doctor => {
        return doctor && doctor.docName && doctor.docName.includes(searchQuery.value)
      })
    })

    const currentDateDisplay = computed(() => {
      const date = currentDate.value
      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      if (date.toDateString() === today.toDateString()) {
        return '今天 (' + formatDate(today) + ')'
      } else if (date.toDateString() === tomorrow.toDateString()) {
        return '明天 (' + formatDate(tomorrow) + ')'
      }
      
      const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
      return `${date.getMonth() + 1}月${date.getDate()}日 ${weekDays[date.getDay()]} (${formatDate(date)})`
    })

    const currentMonthTitle = computed(() => {
      return `${pickerYear.value}年${pickerMonth.value + 1}月`
    })

    const isToday = computed(() => {
      const today = new Date()
      return currentDate.value.toDateString() === today.toDateString()
    })

    const isCurrentMonth = computed(() => {
      const now = new Date()
      return pickerYear.value === now.getFullYear() && pickerMonth.value === now.getMonth()
    })

    const calendarDays = computed(() => {
      const year = pickerYear.value
      const month = pickerMonth.value
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      
      // 获取当月第一天
      const firstDay = new Date(year, month, 1)
      // 获取当月最后一天
      const lastDay = new Date(year, month + 1, 0)
      // 获取第一天是星期几
      const firstDayWeek = firstDay.getDay()
      // 获取当月天数
      const daysInMonth = lastDay.getDate()
      
      const days = []
      const weekDays = ['', '日', '一', '二', '三', '四', '五', '六']
      
      // 添加上个月的日期
      const prevMonthLastDay = new Date(year, month, 0).getDate()
      for (let i = firstDayWeek - 1; i >= 0; i--) {
        const day = prevMonthLastDay - i
        const dateStr = formatDate(new Date(year, month - 1, day))
        days.push({
          day,
          label: '',
          isToday: false,
          isSelected: false,
          isPast: true,
          isFuture: false,
          isWeekend: false,
          dateStr
        })
      }
      
      // 添加当月的日期
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        const dateStr = formatDate(date)
        const isToday = date.toDateString() === today.toDateString()
        const isSelected = currentDate.value.toDateString() === date.toDateString()
        const isPast = date < today
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        
        let label = ''
        if (isToday) label = '今天'
        else if (day === 2) label = '初二'
        else if (day === 8) label = '初八'
        // 简化版，实际可以使用农历库
        
        days.push({
          day,
          label,
          isToday,
          isSelected,
          isPast,
          isFuture: false,
          isWeekend,
          dateStr
        })
      }
      
      // 添加下个月的日期，确保总共有 42 天（6 行），并且能显示未来 4 周的日期
      const remaining = 42 - days.length
      for (let i = 1; i <= remaining; i++) {
        const date = new Date(year, month + 1, i)
        const dateStr = formatDate(date)
        const isPast = date < today
        const isWeekend = date.getDay() === 0 || date.getDay() === 6
        
        days.push({
          day: i,
          label: '',
          isToday: false,
          isSelected: false,
          isPast,
          isFuture: !isPast,
          isWeekend,
          dateStr
        })
      }
      
      return days
    })

    const formatDate = (date) => {
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    }

    const fetchDoctors = async () => {
      loading.value = true
      try {
        const workDate = formatDate(currentDate.value)
        const response = await doctorAPI.getScheduleDetail(workDate)
        doctors.value = response || []
      } catch (error) {
        console.error('获取医生排班失败:', error)
      } finally {
        loading.value = false
      }
    }

    const changeDate = (days) => {
      const newDate = new Date(currentDate.value)
      newDate.setDate(newDate.getDate() + days)
      
      // 不能选择过去的日期
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      if (newDate >= today) {
        currentDate.value = newDate
        // 更新日历面板的年月
        pickerYear.value = newDate.getFullYear()
        pickerMonth.value = newDate.getMonth()
        fetchDoctors()
      }
    }

    const isPastDate = (days) => {
      const targetDate = new Date(currentDate.value)
      targetDate.setDate(targetDate.getDate() + days)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return targetDate < today
    }

    const changeMonth = (months) => {
      let newMonth = pickerMonth.value + months
      let newYear = pickerYear.value
      
      if (newMonth > 11) {
        newMonth = 0
        newYear++
      } else if (newMonth < 0) {
        newMonth = 11
        newYear--
      }
      
      // 不能选择过去的月份
      const now = new Date()
      if (newYear > now.getFullYear() || (newYear === now.getFullYear() && newMonth >= now.getMonth())) {
        pickerMonth.value = newMonth
        pickerYear.value = newYear
      }
    }

    const selectDate = (day) => {
      if (day.isPast || day.isFuture) return
      
      const selectedDate = new Date(day.dateStr)
      currentDate.value = selectedDate
      showDatePicker.value = false
      fetchDoctors()
    }

    const isSelectedDate = (day) => {
      return currentDate.value.toDateString() === day.dateStr
    }

    const selectToday = () => {
      const today = new Date()
      currentDate.value = today
      pickerYear.value = today.getFullYear()
      pickerMonth.value = today.getMonth()
      showDatePicker.value = false
      fetchDoctors()
    }

    const handleSearch = () => {
      // 搜索由计算属性处理
    }

    const getStatusClass = (doctor) => {
      const availableNum = getAvailableNum(doctor)
      if (availableNum > 10) return 'status-available'
      if (availableNum > 0) return 'status-sufficient'
      return 'status-full'
    }

    const getStatusText = (doctor) => {
      const availableNum = getAvailableNum(doctor)
      if (availableNum > 10) return '充足'
      if (availableNum > 0) return '紧张'
      return '已满'
    }

    const getAvailableNum = (doctor) => {
      return doctor.availableNum || 0
    }

    const selectDoctor = (doctor) => {
      selectedDoctor.value = doctor
      fetchPatients()
      showPatientModal.value = true
    }
    
    const closePatientModal = () => {
      showPatientModal.value = false
      selectedDoctor.value = null
    }
    
    const fetchPatients = async () => {
      try {
        const response = await userAPI.getPatients()
        patients.value = response || []
      } catch (error) {
        console.error('获取就诊人列表失败:', error)
      }
    }
    
    const confirmBooking = async (patient) => {
      if (!selectedDoctor.value) return
      
      console.log('\n[confirmBooking] 开始预约...')
      console.log('  - patientId:', patient.id)
      console.log('  - scheduleId:', selectedDoctor.value.scheduleId)
      console.log('  - patientName:', patient.name)
              
      try {
        // 不要转换为字符串，保持原始数字类型让 Axios 处理
        await orderAPI.create(patient.id, selectedDoctor.value.scheduleId)
        console.log('  - 预约成功!')
        alert('预约成功!')
        closePatientModal()
        
        console.log('  - 准备刷新排班数据...')
        await fetchDoctors() // 刷新号源信息
        console.log('[confirmBooking] 完成\n')
      } catch (error) {
        console.error('预约失败详情:', {
          error,
          response: error.response,
          data: error.response?.data,
          status: error.response?.status
        })
        alert('预约失败:' + (error.response?.data || error.message))
      }
    }

    const goToAddPatient = () => {
      router.push('/patients/add')
      closePatientModal()
    }

    onMounted(() => {
      fetchDoctors()
    })

    const showPatientModal = ref(false)

    return {
      doctors,
      loading,
      searchQuery,
      filteredDoctors,
      handleSearch,
      currentDate,
      currentDateDisplay,
      isToday,
      changeDate,
      isLoggedIn,
      showPatientModal,
      patients,
      selectDoctor,
      closePatientModal,
      getStatusClass,
      getStatusText,
      getAvailableNum,
      confirmBooking,
      goToAddPatient,
      isPastDate,
      showDatePicker,
      pickerMonth,
      pickerYear,
      currentMonthTitle,
      isCurrentMonth,
      calendarDays,
      selectDate,
      isSelectedDate,
      selectToday,
      changeMonth,
      formatDate
    }
  }
}
</script>

<style scoped>
.doctors {
  padding: 40px 0;
}

.doctors h2 {
  font-size: 28px;
  color: #2d3748;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 32px;
  background: white;
  padding: 20px 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.filters input {
  flex: 1;
  min-width: 200px;
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  transition: all 0.3s ease;
}

.filters input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.date-picker-wrapper {
  position: relative;
}

.date-nav {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.current-date-display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;
  justify-content: space-between;
}

.current-date-display:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.current-date-display svg {
  width: 18px;
  height: 18px;
  color: #667eea;
}

.current-date-display span {
  font-weight: 600;
  color: #2d3748;
  font-size: 14px;
}

.date-picker-panel {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 320px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  padding: 20px;
  z-index: 1000;
  animation: datePickerSlideIn 0.3s ease-out;
}

@keyframes datePickerSlideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.date-picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-month-nav {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-month-nav:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: scale(1.05);
}

.btn-month-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-month-nav svg {
  width: 18px;
  height: 18px;
}

.month-title {
  font-weight: 600;
  color: #2d3748;
  font-size: 16px;
}

.date-picker-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 16px;
}

.date-picker-weekday {
  text-align: center;
  font-size: 12px;
  color: #718096;
  padding: 8px 0;
  font-weight: 500;
}

.date-picker-day {
  aspect-ratio: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border: 2px solid transparent;
}

.date-picker-day:hover:not(.is-disabled) {
  background: rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.date-picker-day.is-today {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  border-color: #667eea;
}

.date-picker-day.is-selected {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.date-picker-day.is-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.date-picker-day.is-disabled:hover {
  background: transparent;
  transform: none;
}

.date-picker-day.is-weekend:not(.is-disabled) {
  color: #ef4444;
}

.day-num {
  font-size: 14px;
  font-weight: 600;
}

.day-label {
  font-size: 10px;
  opacity: 0.8;
  margin-top: 2px;
}

.date-picker-footer {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.btn-today {
  padding: 8px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-today:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}

.date-selector {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.btn-date-nav {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-date-nav:hover:not(:disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: scale(1.05);
}

.btn-date-nav:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-date-nav svg {
  width: 20px;
  height: 20px;
}

.current-date {
  font-weight: 600;
  color: #2d3748;
  min-width: 200px;
  text-align: center;
  font-size: 15px;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-container p {
  margin-top: 16px;
  color: #718096;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.empty-state svg {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  opacity: 0.3;
}

.doctor-list {
  display: grid;
  gap: 20px;
}

.doctor-card {
  background: white;
  padding: 24px;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid #e2e8f0;
}

.doctor-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.15);
}

.doctor-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
  flex-shrink: 0;
}

.doctor-info {
  flex: 1;
}

.doctor-info h3 {
  font-size: 20px;
  color: #2d3748;
  margin: 0 0 6px 0;
}

.department {
  color: #667eea;
  font-weight: 500;
  font-size: 14px;
  margin: 0;
}

.title {
  color: #718096;
  font-size: 13px;
  margin: 0;
}

.fee-tag {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 20px;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
  border-radius: 12px;
  border: 1px solid rgba(102, 126, 234, 0.2);
}

.fee-tag .label {
  font-size: 12px;
  color: #718096;
  margin-bottom: 4px;
}

.fee-tag .amount {
  font-size: 20px;
  font-weight: 700;
  color: #667eea;
}

.schedule-status {
  margin-bottom: 20px;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
}

.status-available {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.status-sufficient {
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.status-full {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge-icon svg {
  width: 24px;
  height: 24px;
}

.status-available .badge-icon {
  color: #10b981;
}

.status-sufficient .badge-icon {
  color: #f59e0b;
}

.status-full .badge-icon {
  color: #ef4444;
}

.badge-text {
  display: flex;
  flex-direction: column;
}

.status-text {
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 2px;
}

.num-text {
  font-size: 12px;
  color: #718096;
}

.doctor-actions {
  display: flex;
  gap: 12px;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  text-decoration: none;
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
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-outline:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-disabled {
  background: #e2e8f0;
  color: #a0aec0;
  cursor: not-allowed;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal {
  background: white;
  border-radius: 16px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 20px;
  color: #2d3748;
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.btn-close:hover {
  background: #edf2f7;
}

.btn-close svg {
  width: 20px;
  height: 20px;
  color: #718096;
}

.modal-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
}

.no-patients {
  text-align: center;
  padding: 40px 20px;
}

.no-patients svg {
  width: 64px;
  height: 64px;
  color: #cbd5e0;
  margin-bottom: 16px;
}

.no-patients p {
  color: #718096;
  margin-bottom: 20px;
}

.patient-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.patient-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.3s ease;
}

.patient-item:hover {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
  transform: translateX(4px);
}

.patient-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 18px;
  flex-shrink: 0;
}

.patient-info {
  flex: 1;
}

.patient-name {
  font-weight: 600;
  color: #2d3748;
  font-size: 16px;
  margin-bottom: 4px;
}

.patient-detail {
  color: #718096;
  font-size: 14px;
}

.check-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.check-icon svg {
  width: 20px;
  height: 20px;
  color: #10b981;
}

.modal-footer {
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
  background: #f7fafc;
}

.modal-footer .btn {
  width: 100%;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
    align-items: stretch;
  }
  
  .date-selector {
    justify-content: center;
  }
  
  .current-date {
    min-width: auto;
  }
  
  .doctor-header {
    flex-wrap: wrap;
  }
  
  .fee-tag {
    width: 100%;
  }
  
  .doctor-actions {
    flex-direction: column;
  }
}
</style>
