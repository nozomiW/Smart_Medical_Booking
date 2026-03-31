<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div><p class="section-label">账户中心</p><h2>我的就诊人</h2></div>
        <button class="btn-new" @click="openAddForm">添加就诊人</button>
      </div>
      <div v-if="loading" class="page-loading"><div class="spinner spinner-dark"></div><span>加载中…</span></div>
      <div v-else-if="patients.length===0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
        <h3>暂无就诊人</h3><p>添加就诊人后可快速完成预约挂号</p>
        <button class="btn-primary-sm" @click="openAddForm">立即添加</button>
      </div>
      <div v-else class="patients-grid">
        <div v-for="p in patients" :key="p.id" class="patient-card">
          <div class="patient-card-top">
            <div class="patient-avatar" :class="p.gender===1?'male':'female'">{{ (p.name||'患').charAt(0) }}</div>
            <div class="patient-basic">
              <div class="patient-name">{{ p.name }}</div>
              <span class="gender-badge" :class="p.gender===1?'male':'female'">{{ p.gender===1?'男':'女' }}</span>
            </div>
            <div v-if="p.isDefault===1" class="default-badge">默认</div>
          </div>
          <div class="patient-details">
            <div class="detail-item"><span class="detail-label">身份证</span><span class="detail-val mono">{{ maskIdCard(p.idCard) }}</span></div>
            <div class="detail-item"><span class="detail-label">年龄</span><span class="detail-val">{{ p.age }} 岁</span></div>
            <div v-if="p.phone" class="detail-item"><span class="detail-label">电话</span><span class="detail-val mono">{{ p.phone }}</span></div>
          </div>
          <div class="patient-actions">
            <button class="btn-edit" @click="editPatient(p)">编辑</button>
            <button class="btn-del" @click="deletePatient(p.id)" :disabled="deletingId===p.id">{{ deletingId===p.id?'…':'删除' }}</button>
          </div>
        </div>
      </div>
      <div v-if="error" class="toast-error">{{ error }}</div>
    </div>
    <div v-if="showForm" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingPatient?'编辑就诊人':'添加就诊人' }}</h3>
          <button class="btn-close-modal" @click="closeForm"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button>
        </div>
        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-row">
            <div class="form-group"><label>姓名 <span class="req">*</span></label><input v-model="form.name" type="text" placeholder="真实姓名" required></div>
            <div class="form-group"><label>年龄 <span class="req">*</span></label><input v-model.number="form.age" type="number" placeholder="年龄" min="0" max="150" required></div>
          </div>
          <div class="form-group"><label>身份证号 <span class="req">*</span></label><input v-model="form.idCard" type="text" placeholder="18 位身份证号" required maxlength="18"></div>
          <div class="form-group">
            <label>性别 <span class="req">*</span></label>
            <div class="radio-group">
              <label class="radio-item" :class="{active:form.gender===1}" @click="form.gender=1">男</label>
              <label class="radio-item" :class="{active:form.gender===0}" @click="form.gender=0">女</label>
            </div>
          </div>
          <div class="form-group"><label>联系电话</label><input v-model="form.phone" type="tel" placeholder="选填" maxlength="11"></div>
          <div v-if="formError" class="alert alert-error">{{ formError }}</div>
          <div class="form-actions">
            <button type="button" class="btn-ghost-form" @click="closeForm">取消</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              <span v-if="submitting" class="spinner"></span>{{ submitting?'提交中…':'保存' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { userAPI } from '../api'
export default {
  name: 'Patients',
  setup() {
    const patients = ref([])
    const loading = ref(false)
    const error = ref('')
    const showForm = ref(false)
    const submitting = ref(false)
    const formError = ref('')
    const deletingId = ref(null)
    const editingPatient = ref(null)
    const form = ref({ name:'', idCard:'', gender:1, age:'', phone:'' })
    const maskIdCard = (id) => !id||id.length<5?id:id.substring(0,3)+'****'+id.substring(id.length-2)
    const fetchPatients = async () => {
      loading.value=true; error.value=''
      try { const r=await userAPI.getPatients(); patients.value=(r||[]).map(p=>({...p,age:Number(p.age),gender:Number(p.gender)})) }
      catch { error.value='加载失败' } finally { loading.value=false }
    }
    const openAddForm = () => { editingPatient.value=null; form.value={name:'',idCard:'',gender:1,age:'',phone:''}; formError.value=''; showForm.value=true }
    const editPatient = (p) => { editingPatient.value=p; form.value={name:p.name,idCard:p.idCard,gender:Number(p.gender),age:Number(p.age),phone:p.phone||''}; formError.value=''; showForm.value=true }
    const closeForm = () => { showForm.value=false; editingPatient.value=null }
    const submitForm = async () => {
      formError.value=''
      if (!form.value.name||!form.value.idCard||form.value.age==='') { formError.value='请填写所有必填项'; return }
      submitting.value=true
      try { await userAPI.insertPatient({name:form.value.name,idCard:form.value.idCard,gender:Number(form.value.gender),age:Number(form.value.age),phone:form.value.phone||''}); closeForm(); await fetchPatients() }
      catch { formError.value='保存失败，请重试' } finally { submitting.value=false }
    }
    const deletePatient = async (id) => {
      if (!confirm('确定删除？')) return
      deletingId.value=id
      try { alert('删除功能开发中') } finally { deletingId.value=null }
    }
    onMounted(fetchPatients)
    return { patients, loading, error, showForm, submitting, formError, deletingId, editingPatient, form, maskIdCard, openAddForm, editPatient, closeForm, submitForm, deletePatient }
  }
}
</script>

<style scoped>
.page { padding: 32px 0 64px; }
.page-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:32px; }
.page-header h2 { font-size:24px; font-weight:700; color:var(--ink); letter-spacing:-0.03em; margin:0; }
.btn-new { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; background:var(--accent); color:white; border-radius:var(--r-md); font-size:14px; font-weight:600; border:none; cursor:pointer; transition:all var(--t); box-shadow:var(--shadow-accent); }
.btn-new:hover { background:var(--accent-dark); transform:translateY(-1px); }
.btn-primary-sm { display:inline-flex; align-items:center; padding:9px 20px; background:var(--accent); color:white; border-radius:var(--r-md); font-size:14px; font-weight:600; border:none; cursor:pointer; transition:all var(--t); }
.patients-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(290px,1fr)); gap:16px; }
.patient-card { background:white; border:1px solid var(--gray-200); border-radius:var(--r-lg); padding:20px; transition:all var(--t); }
.patient-card:hover { box-shadow:var(--shadow-md); border-color:var(--gray-300); }
.patient-card-top { display:flex; align-items:center; gap:12px; margin-bottom:14px; }
.patient-avatar { width:48px; height:48px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; color:white; flex-shrink:0; }
.patient-avatar.male { background:linear-gradient(135deg,#2563eb,#0e9e8e); }
.patient-avatar.female { background:linear-gradient(135deg,#db2777,#f59e0b); }
.patient-basic { flex:1; min-width:0; }
.patient-name { font-size:16px; font-weight:600; color:var(--ink); margin-bottom:4px; }
.gender-badge { display:inline-block; padding:2px 8px; border-radius:var(--r-full); font-size:11px; font-weight:600; }
.gender-badge.male { background:#dbeafe; color:#1d4ed8; }
.gender-badge.female { background:#fce7f3; color:#be185d; }
.default-badge { margin-left:auto; padding:3px 10px; background:var(--accent-light); color:var(--accent); border-radius:var(--r-full); font-size:11px; font-weight:700; flex-shrink:0; }
.patient-details { display:flex; flex-direction:column; gap:8px; margin-bottom:14px; padding:12px; background:var(--gray-50); border-radius:var(--r-md); }
.detail-item { display:flex; justify-content:space-between; align-items:center; }
.detail-label { font-size:12px; color:var(--gray-400); font-weight:500; }
.detail-val { font-size:13px; color:var(--gray-700); font-weight:500; }
.mono { font-family:var(--font-mono); font-size:12px; }
.patient-actions { display:flex; gap:8px; }
.btn-edit { flex:1; padding:8px; background:var(--accent-light); color:var(--accent); border:none; border-radius:var(--r-md); font-size:13px; font-weight:600; cursor:pointer; transition:all var(--t); }
.btn-edit:hover { background:var(--accent); color:white; }
.btn-del { flex:1; padding:8px; background:white; color:var(--danger); border:1.5px solid rgba(220,38,38,0.2); border-radius:var(--r-md); font-size:13px; font-weight:600; cursor:pointer; transition:all var(--t); }
.btn-del:hover:not(:disabled) { background:var(--danger); color:white; }
.btn-del:disabled { opacity:0.5; cursor:not-allowed; }
.form-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
.form-group { display:flex; flex-direction:column; gap:6px; margin-bottom:14px; }
.form-group label { font-size:12px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.05em; }
.req { color:var(--danger); }
.form-group input { height:44px; font-size:14px; border-radius:var(--r-md); border:1.5px solid var(--gray-200); padding:0 14px; transition:all var(--t); width:100%; }
.form-group input:focus { border-color:var(--accent); box-shadow:0 0 0 3px var(--accent-glow); outline:none; }
.radio-group { display:flex; gap:8px; }
.radio-item { flex:1; padding:9px; text-align:center; border:1.5px solid var(--gray-200); border-radius:var(--r-md); font-size:14px; font-weight:500; color:var(--gray-600); cursor:pointer; transition:all var(--t); user-select:none; }
.radio-item.active { border-color:var(--accent); background:var(--accent-light); color:var(--accent); font-weight:600; }
.form-actions { display:flex; gap:10px; margin-top:4px; }
.btn-ghost-form { flex:1; padding:11px; background:var(--gray-100); color:var(--gray-600); border:none; border-radius:var(--r-md); font-size:14px; font-weight:500; cursor:pointer; transition:all var(--t); }
.btn-ghost-form:hover { background:var(--gray-200); }
.btn-submit { flex:2; padding:11px; background:var(--accent); color:white; border:none; border-radius:var(--r-md); font-size:14px; font-weight:600; cursor:pointer; transition:all var(--t); display:flex; align-items:center; justify-content:center; gap:8px; box-shadow:var(--shadow-accent); }
.btn-submit:hover:not(:disabled) { background:var(--accent-dark); }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; }
.btn-close-modal { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:4px; display:flex; align-items:center; border-radius:var(--r-sm); transition:all var(--t); }
.btn-close-modal:hover { color:var(--ink); background:var(--gray-100); }
.toast-error { position:fixed; bottom:24px; right:24px; background:var(--danger); color:white; padding:12px 20px; border-radius:var(--r-md); font-size:14px; font-weight:500; z-index:300; box-shadow:var(--shadow-lg); }
@media (max-width:600px) { .form-row { grid-template-columns:1fr; } }
</style>