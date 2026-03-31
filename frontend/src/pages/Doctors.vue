<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div><p class="section-label">医生排班</p><h2>选择医生</h2></div>
      </div>
      <div class="toolbar">
        <div class="search-wrap">
          <svg class="search-icon" viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"/></svg>
          <input v-model="searchQuery" type="text" placeholder="搜索医生姓名…" class="search-input">
        </div>
        <div class="date-nav-wrap">
          <div class="date-nav">
            <button class="date-arrow" @click="changeDate(-1)" :disabled="isPastDate(-1)"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></button>
            <button class="date-display" @click="showDatePicker=!showDatePicker">
              <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"/></svg>
              {{ currentDateDisplay }}
            </button>
            <button class="date-arrow" @click="changeDate(1)" :disabled="isToday"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg></button>
          </div>
          <div v-if="showDatePicker" class="date-picker-panel">
            <div class="dp-header">
              <button class="dp-nav" @click="changeMonth(-1)" :disabled="isCurrentMonth"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd"/></svg></button>
              <span class="dp-month-title">{{ currentMonthTitle }}</span>
              <button class="dp-nav" @click="changeMonth(1)"><svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg></button>
            </div>
            <div class="dp-grid">
              <div class="dp-weekday" v-for="w in ['日','一','二','三','四','五','六']" :key="w">{{ w }}</div>
              <div v-for="d in calendarDays" :key="d.dateStr" @click="selectDate(d)"
                :class="['dp-day',{today:d.isToday,selected:isSelectedDate(d),disabled:d.isPast||d.isFuture,weekend:d.isWeekend}]">{{ d.day }}</div>
            </div>
            <div class="dp-footer"><button class="dp-today-btn" @click="selectToday">今天</button></div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="page-loading"><div class="spinner spinner-dark"></div><span>加载排班中…</span></div>
      <div v-else-if="filteredDoctors.length===0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
        <h3>当日暂无排班</h3><p>请选择其他日期</p>
      </div>
      <div v-else class="doctor-grid">
        <div v-for="d in filteredDoctors" :key="d.scheduleId||d.docId" class="doctor-card">
          <div class="doc-top">
            <div class="doc-avatar">{{ d.docName?d.docName.charAt(0):'医' }}</div>
            <div class="doc-info">
              <div class="doc-name">{{ d.docName||'未知医生' }}</div>
              <div class="doc-meta"><span class="doc-title-tag">{{ d.docTitle||'主治医师' }}</span><span class="doc-dept">{{ d.deptName||'科室'+d.deptId }}</span></div>
            </div>
            <div class="doc-fee-box"><span class="fee-label">挂号费</span><span class="fee-amount">¥{{ d.docFee }}</span></div>
          </div>
          <div class="doc-status-row">
            <span class="num-badge" :class="getStatusClass(d)">{{ getStatusText(d) }}</span>
            <span class="num-text">剩余 <b>{{ getAvailableNum(d) }}</b> 个</span>
            <div class="num-track"><div class="num-fill" :class="getStatusClass(d)" :style="getNumFillStyle(d)"></div></div>
          </div>
          <div class="doc-action">
            <button v-if="isLoggedIn&&getAvailableNum(d)>0" class="btn-book" @click="selectDoctor(d)">立即预约</button>
            <button v-else-if="isLoggedIn" class="btn-full" disabled>号源已满</button>
            <router-link v-else to="/login" class="btn-login-hint">登录后预约</router-link>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPatientModal" class="modal-overlay" @click="closePatientModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>选择就诊人</h3>
          <button class="btn-close-modal" @click="closePatientModal"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button>
        </div>
        <div class="modal-body">
          <div v-if="patients.length===0" class="empty-state" style="padding:24px 0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="width:40px;height:40px"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
            <h3>暂无就诊人</h3><p>请先添加就诊人</p>
            <button class="btn-book" style="margin-top:8px" @click="goToAddPatient">去添加</button>
          </div>
          <div v-else class="patient-pick-list">
            <div v-for="pt in patients" :key="pt.id" class="patient-pick-item" @click="confirmBooking(pt)">
              <div class="pick-avatar" :class="pt.gender===1?'male':'female'">{{ (pt.name||'患').charAt(0) }}</div>
              <div class="pick-info">
                <div class="pick-name">{{ pt.name }}</div>
                <div class="pick-sub">{{ maskIdCard(pt.idCard) }} · {{ pt.gender===1?'男':'女' }}</div>
              </div>
              <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16" class="pick-arrow"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/></svg>
            </div>
          </div>
        </div>
        <div v-if="patients.length>0" class="modal-footer"><button class="btn-ghost-sm" @click="goToAddPatient">添加新就诊人</button></div>
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
    const showPatientModal = ref(false)
    const pickerMonth = ref(new Date().getMonth())
    const pickerYear = ref(new Date().getFullYear())
    const isLoggedIn = computed(() => !!localStorage.getItem('token'))
    const filteredDoctors = computed(() => doctors.value.filter(d => d&&d.docName&&d.docName.includes(searchQuery.value)))
    const formatDate = (d) => d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')
    const currentDateDisplay = computed(() => {
      const d=currentDate.value, t=new Date()
      const tm=new Date(t); tm.setDate(tm.getDate()+1)
      if (d.toDateString()===t.toDateString()) return '今天'
      if (d.toDateString()===tm.toDateString()) return '明天'
      const wk=['周日','周一','周二','周三','周四','周五','周六']
      return (d.getMonth()+1)+'月'+d.getDate()+'日 '+wk[d.getDay()]
    })
    const currentMonthTitle = computed(() => pickerYear.value+'年'+(pickerMonth.value+1)+'月')
    const isToday = computed(() => currentDate.value.toDateString()===new Date().toDateString())
    const isCurrentMonth = computed(() => { const n=new Date(); return pickerYear.value===n.getFullYear()&&pickerMonth.value===n.getMonth() })
    const calendarDays = computed(() => {
      const y=pickerYear.value, m=pickerMonth.value
      const today=new Date(); today.setHours(0,0,0,0)
      const firstDow=new Date(y,m,1).getDay()
      const daysInMonth=new Date(y,m+1,0).getDate()
      const prevLast=new Date(y,m,0).getDate()
      const days=[]
      for(let i=firstDow-1;i>=0;i--) { const day=prevLast-i; days.push({day,isToday:false,isPast:true,isFuture:false,isWeekend:false,dateStr:formatDate(new Date(y,m-1,day))}) }
      for(let day=1;day<=daysInMonth;day++) { const dt=new Date(y,m,day); const isT=dt.toDateString()===today.toDateString(); const isP=dt<today&&!isT; days.push({day,isToday:isT,isPast:isP,isFuture:false,isWeekend:dt.getDay()===0||dt.getDay()===6,dateStr:formatDate(dt)}) }
      const rem=42-days.length
      for(let i=1;i<=rem;i++) { const dt=new Date(y,m+1,i); days.push({day:i,isToday:false,isPast:dt<today,isFuture:true,isWeekend:false,dateStr:formatDate(dt)}) }
      return days
    })
    const fetchDoctors = async () => {
      loading.value=true
      try { const r=await doctorAPI.getScheduleDetail(formatDate(currentDate.value)); doctors.value=r||[] }
      catch(e) { console.error(e) } finally { loading.value=false }
    }
    const changeDate = (n) => {
      const nd=new Date(currentDate.value); nd.setDate(nd.getDate()+n)
      const t=new Date(); t.setHours(0,0,0,0)
      if(nd>=t) { currentDate.value=nd; pickerYear.value=nd.getFullYear(); pickerMonth.value=nd.getMonth(); fetchDoctors() }
    }
    const isPastDate = (n) => { const t=new Date(currentDate.value); t.setDate(t.getDate()+n); const now=new Date(); now.setHours(0,0,0,0); return t<now }
    const changeMonth = (n) => {
      let m=pickerMonth.value+n, y=pickerYear.value
      if(m>11){m=0;y++} else if(m<0){m=11;y--}
      const now=new Date()
      if(y>now.getFullYear()||(y===now.getFullYear()&&m>=now.getMonth())) { pickerMonth.value=m; pickerYear.value=y }
    }
    const selectDate = (d) => { if(d.isPast||d.isFuture) return; currentDate.value=new Date(d.dateStr); showDatePicker.value=false; fetchDoctors() }
    const isSelectedDate = (d) => currentDate.value.toDateString()===new Date(d.dateStr).toDateString()
    const selectToday = () => { const t=new Date(); currentDate.value=t; pickerYear.value=t.getFullYear(); pickerMonth.value=t.getMonth(); showDatePicker.value=false; fetchDoctors() }
    const getAvailableNum = (d) => d.availableNum||0
    const getStatusClass = (d) => { const n=getAvailableNum(d); if(n>10) return 'status-ok'; if(n>0) return 'status-low'; return 'status-full' }
    const getStatusText = (d) => { const n=getAvailableNum(d); if(n>10) return '充足'; if(n>0) return '紧张'; return '已满' }
    const getNumFillStyle = (d) => {
      const n=getAvailableNum(d)
      const max=20
      const pct=Math.min(100,Math.round(n/max*100))
      return { width: pct+'%' }
    }
    const maskIdCard = (id) => !id||id.length<5?id:id.substring(0,3)+'****'+id.substring(id.length-2)
    const fetchPatients = async () => { try { const r=await userAPI.getPatients(); patients.value=r||[] } catch(e){console.error(e)} }
    const selectDoctor = (d) => { selectedDoctor.value=d; fetchPatients(); showPatientModal.value=true }
    const closePatientModal = () => { showPatientModal.value=false; selectedDoctor.value=null }
    const confirmBooking = async (pt) => {
      if(!selectedDoctor.value) return
      try { await orderAPI.create(pt.id, selectedDoctor.value.scheduleId); alert('预约成功！'); closePatientModal(); await fetchDoctors() }
      catch(e) { alert('预约失败：'+(e.response?.data||e.message)) }
    }
    const goToAddPatient = () => { router.push('/patients'); closePatientModal() }
    onMounted(fetchDoctors)
    return { doctors, loading, searchQuery, filteredDoctors, currentDate, currentDateDisplay, isToday,
      changeDate, isPastDate, isLoggedIn, showPatientModal, patients, selectedDoctor, selectDoctor,
      closePatientModal, getStatusClass, getStatusText, getAvailableNum, getNumFillStyle, confirmBooking,
      goToAddPatient, showDatePicker, pickerMonth, pickerYear, currentMonthTitle, isCurrentMonth,
      calendarDays, selectDate, isSelectedDate, selectToday, changeMonth, maskIdCard }
  }
}
</script>

<style scoped>
.page { padding: 32px 0 64px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size:24px; font-weight:700; color:var(--ink); letter-spacing:-0.03em; margin:0; }

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 16px; margin-bottom: 28px;
  background: white; padding: 14px 18px;
  border-radius: var(--r-lg); border: 1px solid var(--gray-200);
  position: relative;
}
.search-wrap { position: relative; flex: 1; max-width: 320px; }
.search-icon { position:absolute; left:12px; top:50%; transform:translateY(-50%); color:var(--gray-400); pointer-events:none; }
.search-input { width:100%; padding:9px 12px 9px 36px; border:1.5px solid var(--gray-200); border-radius:var(--r-md); font-size:14px; transition:all var(--t); }
.search-input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); outline:none; }

.date-nav-wrap { position: relative; }
.date-nav { display:flex; align-items:center; gap:4px; }
.date-arrow { width:34px; height:34px; border:1.5px solid var(--gray-200); background:white; border-radius:var(--r-md); cursor:pointer; display:flex; align-items:center; justify-content:center; color:var(--gray-500); transition:all var(--t); padding:0; }
.date-arrow:hover:not(:disabled) { border-color:var(--accent); color:var(--accent); }
.date-arrow:disabled { opacity:0.35; cursor:not-allowed; }
.date-display { display:flex; align-items:center; gap:8px; padding:8px 16px; border:1.5px solid var(--gray-200); background:white; border-radius:var(--r-md); font-size:14px; font-weight:600; color:var(--ink); cursor:pointer; transition:all var(--t); white-space:nowrap; }
.date-display:hover { border-color:var(--accent); color:var(--accent); }

.date-picker-panel { position:absolute; top:calc(100% + 8px); right:0; width:300px; background:white; border-radius:var(--r-lg); box-shadow:var(--shadow-lg); border:1px solid var(--gray-200); padding:16px; z-index:50; animation:slideUp 0.18s ease; }
.dp-header { display:flex; justify-content:space-between; align-items:center; margin-bottom:14px; }
.dp-month-title { font-size:15px; font-weight:600; color:var(--ink); }
.dp-nav { width:30px; height:30px; border:1px solid var(--gray-200); background:white; border-radius:var(--r-sm); cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all var(--t); padding:0; }
.dp-nav:hover:not(:disabled) { border-color:var(--accent); color:var(--accent); }
.dp-nav:disabled { opacity:0.35; cursor:not-allowed; }
.dp-grid { display:grid; grid-template-columns:repeat(7,1fr); gap:2px; margin-bottom:12px; }
.dp-weekday { text-align:center; font-size:11px; font-weight:600; color:var(--gray-400); padding:4px 0; text-transform:uppercase; }
.dp-day { aspect-ratio:1; display:flex; align-items:center; justify-content:center; border-radius:var(--r-sm); font-size:13px; font-weight:500; cursor:pointer; transition:all var(--t); color:var(--gray-700); }
.dp-day:hover:not(.disabled) { background:var(--accent-light); color:var(--accent); }
.dp-day.today { background:var(--accent-light); color:var(--accent); font-weight:700; }
.dp-day.selected { background:var(--accent); color:white; font-weight:700; }
.dp-day.disabled { opacity:0.3; cursor:not-allowed; }
.dp-day.weekend:not(.disabled):not(.selected) { color:#dc2626; }
.dp-footer { text-align:center; padding-top:10px; border-top:1px solid var(--gray-100); }
.dp-today-btn { padding:6px 20px; background:var(--accent); color:white; border:none; border-radius:var(--r-md); font-size:13px; font-weight:600; cursor:pointer; transition:all var(--t); }
.dp-today-btn:hover { background:var(--accent-dark); }

.doctor-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:16px; }
.doctor-card { background:white; border:1px solid var(--gray-200); border-radius:var(--r-lg); padding:20px; transition:all var(--t); }
.doctor-card:hover { box-shadow:var(--shadow-md); border-color:var(--gray-300); transform:translateY(-2px); }
.doc-top { display:flex; align-items:flex-start; gap:14px; margin-bottom:16px; }
.doc-avatar { width:52px; height:52px; border-radius:50%; background:linear-gradient(135deg,var(--accent),#2563eb); color:white; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; flex-shrink:0; }
.doc-info { flex:1; min-width:0; }
.doc-name { font-size:16px; font-weight:700; color:var(--ink); margin-bottom:5px; }
.doc-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.doc-title-tag { font-size:12px; font-weight:600; background:var(--accent-light); color:var(--accent); padding:2px 8px; border-radius:var(--r-full); }
.doc-dept { font-size:12px; color:var(--gray-500); }
.doc-fee-box { display:flex; flex-direction:column; align-items:flex-end; flex-shrink:0; }
.fee-label { font-size:11px; color:var(--gray-400); font-weight:500; margin-bottom:2px; }
.fee-amount { font-size:20px; font-weight:700; color:var(--ink); letter-spacing:-0.03em; }

.doc-status-row { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
.num-badge { display:inline-flex; align-items:center; padding:3px 10px; border-radius:var(--r-full); font-size:12px; font-weight:700; flex-shrink:0; }
.num-badge.status-ok { background:var(--success-bg); color:var(--success); }
.num-badge.status-low { background:var(--warning-bg); color:var(--warning); }
.num-badge.status-full { background:var(--danger-bg); color:var(--danger); }
.num-text { font-size:13px; color:var(--gray-500); }
.num-text b { color:var(--ink); }
.num-track { flex:1; height:4px; background:var(--gray-100); border-radius:var(--r-full); overflow:hidden; }
.num-fill { height:100%; border-radius:var(--r-full); transition:width 0.4s ease; }
.num-fill.status-ok { background:var(--success); }
.num-fill.status-low { background:var(--warning); }
.num-fill.status-full { background:var(--danger); }

.doc-action {}
.btn-book { width:100%; padding:11px; background:var(--accent); color:white; border:none; border-radius:var(--r-md); font-size:14px; font-weight:600; cursor:pointer; transition:all var(--t); box-shadow:var(--shadow-accent); }
.btn-book:hover { background:var(--accent-dark); transform:translateY(-1px); }
.btn-full { width:100%; padding:11px; background:var(--gray-100); color:var(--gray-400); border:none; border-radius:var(--r-md); font-size:14px; font-weight:500; cursor:not-allowed; }
.btn-login-hint { display:block; width:100%; padding:11px; text-align:center; border:1.5px solid var(--gray-200); color:var(--gray-600); border-radius:var(--r-md); font-size:14px; font-weight:500; text-decoration:none; transition:all var(--t); }
.btn-login-hint:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-light); }

.patient-pick-list { display:flex; flex-direction:column; gap:8px; }
.patient-pick-item { display:flex; align-items:center; gap:14px; padding:14px; border:1.5px solid var(--gray-200); border-radius:var(--r-lg); cursor:pointer; transition:all var(--t); }
.patient-pick-item:hover { border-color:var(--accent); background:var(--accent-light); }
.pick-avatar { width:40px; height:40px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:700; color:white; flex-shrink:0; }
.pick-avatar.male { background:linear-gradient(135deg,#2563eb,#0e9e8e); }
.pick-avatar.female { background:linear-gradient(135deg,#db2777,#f59e0b); }
.pick-info { flex:1; }
.pick-name { font-size:15px; font-weight:600; color:var(--ink); margin-bottom:3px; }
.pick-sub { font-size:12px; color:var(--gray-400); font-family:var(--font-mono); }
.pick-arrow { color:var(--gray-300); flex-shrink:0; }
.btn-ghost-sm { width:100%; padding:10px; background:transparent; border:1.5px solid var(--gray-200); border-radius:var(--r-md); font-size:14px; font-weight:500; color:var(--gray-600); cursor:pointer; transition:all var(--t); }
.btn-ghost-sm:hover { border-color:var(--accent); color:var(--accent); }
.btn-close-modal { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:4px; display:flex; align-items:center; border-radius:var(--r-sm); transition:all var(--t); }
.btn-close-modal:hover { color:var(--ink); background:var(--gray-100); }
@media (max-width:768px) { .toolbar { flex-direction:column; align-items:stretch; } .search-wrap { max-width:100%; } .date-picker-panel { right:0; left:0; width:auto; } }
</style>