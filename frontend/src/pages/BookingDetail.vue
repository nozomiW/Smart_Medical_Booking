<template>
  <div class="booking-detail">
    <div class="container">
      <router-link to="/doctors" class="back-link">← 返回医生列表</router-link>
      
      <div v-if="loading" class="loading-container">
        <div class="loading"></div>
      </div>

      <div v-else-if="doctor" class="detail-content">
        <div class="doctor-header-section">
          <div class="avatar-large">{{ doctor.name.charAt(0) }}</div>
          <div class="doctor-info-section">
            <h2>{{ doctor.name }}</h2>
            <p class="department">{{ doctor.dept }}</p>
            <p class="title">{{ doctor.title }}</p>
            <p class="fee">挂号费: ¥{{ doctor.fee }}</p>
          </div>
        </div>

        <div class="grid grid-2">
          <div class="info-card card">
            <h3>医生信息</h3>
            <p><strong>简介:</strong> {{ doctor.intro }}</p>
          </div>

          <div class="booking-card card">
            <h3>选择预约时间</h3>
            <div class="form-group">
              <label>选择日期</label>
              <input v-model="bookingForm.date" type="date" @change="loadSchedules">
            </div>
            <div class="form-group">
              <label>选择时间</label>
              <select v-model="bookingForm.scheduleId" :disabled="schedules.length === 0">
                <option value="">请先选择日期</option>
                <option v-for="schedule in schedules" :key="schedule.id" :value="schedule.id">
                  {{ schedule.workTime }} (剩余号源: {{ schedule.availableNumber }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>选择就诊人</label>
              <select v-model="bookingForm.patientId" :disabled="patients.length === 0">
                <option value="">请选择就诊人</option>
                <option v-for="patient in patients" :key="patient.id" :value="patient.id">
                  {{ patient.name }} ({{ patient.idCard }})
                </option>
              </select>
            </div>
            <button class="btn btn-primary" @click="submitBooking" :disabled="submitting || !bookingForm.scheduleId || !bookingForm.patientId">
              {{ submitting ? '预约中...' : '确认预约' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { doctorAPI, orderAPI, userAPI } from '../api'

export default {
  name: 'BookingDetail',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const doctor = ref(null)
    const schedules = ref([])
    const patients = ref([])
    const loading = ref(false)
    const submitting = ref(false)
    const bookingForm = ref({ date: '', scheduleId: '', patientId: '' })

    const fetchDoctor = async () => {
      loading.value = true
      try {
        const response = await doctorAPI.searchOnline()
        const doctors = response || []
        doctor.value = doctors.find(d => d.id == route.params.id)
      } catch (error) {
        console.error('获取医生详情失败:', error)
      } finally {
        loading.value = false
      }
    }

    const loadSchedules = async () => {
      if (!bookingForm.value.date) {
        schedules.value = []
        return
      }

      try {
        const response = await doctorAPI.getScheduleDetail(bookingForm.value.date)
        // 过滤出当前医生的排班
        const allSchedules = response || []
        schedules.value = allSchedules.filter(s => s.doctorId == route.params.id)
      } catch (error) {
        console.error('获取排班失败:', error)
        schedules.value = []
      }
    }

    const fetchPatients = async () => {
      try {
        const response = await userAPI.getPatients()
        patients.value = response || []
      } catch (error) {
        console.error('获取就诊人列表失败:', error)
      }
    }

    const submitBooking = async () => {
      if (!bookingForm.value.scheduleId || !bookingForm.value.patientId) {
        alert('请选择预约时间和就诊人')
        return
      }

      submitting.value = true
      try {
        await orderAPI.create(bookingForm.value.patientId, bookingForm.value.scheduleId)
        alert('预约成功')
        router.push('/bookings')
      } catch (error) {
        alert('预约失败，请重试')
        console.error('预约错误:', error)
      } finally {
        submitting.value = false
      }
    }

    onMounted(() => {
      fetchDoctor()
      fetchPatients()
    })

    return { doctor, schedules, patients, loading, bookingForm, submitting, loadSchedules, submitBooking }
  }
}
</script>

<style scoped>
.booking-detail {
  padding: 20px 0;
}

.back-link {
  display: inline-block;
  margin-bottom: 24px;
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.loading-container {
  text-align: center;
  padding: 60px 20px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.doctor-header-section {
  display: flex;
  gap: 24px;
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  font-weight: bold;
  flex-shrink: 0;
}

.doctor-info-section h2 {
  font-size: 24px;
  color: var(--gray-900);
  margin-bottom: 8px;
}

.department {
  color: var(--primary);
  font-weight: 500;
  font-size: 16px;
  margin-bottom: 4px;
}

.title {
  color: var(--gray-600);
  font-size: 14px;
  margin-bottom: 8px;
}

.fee {
  font-size: 16px;
  color: var(--danger);
  font-weight: 600;
}

.info-card h3,
.booking-card h3 {
  font-size: 18px;
  color: var(--gray-900);
  margin-bottom: 16px;
}

.info-card p {
  color: var(--gray-700);
  font-size: 14px;
  margin-bottom: 8px;
}

.booking-card button {
  width: 100%;
}

@media (max-width: 768px) {
  .doctor-header-section {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar-large {
    width: 100px;
    height: 100px;
    font-size: 40px;
  }
}
</style>
