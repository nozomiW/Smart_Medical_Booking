<template>
  <div class="patients-page">
    <div class="container">
      <div class="page-header">
        <h2>我的就诊人</h2>
        <button @click="showAddForm = true" class="btn-add">添加就诊人</button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="patients.length === 0" class="empty-state">
        <p>暂无就诊人信息</p>
        <button @click="showAddForm = true" class="btn-primary">添加就诊人</button>
      </div>

      <div v-else class="patients-list">
        <div v-for="patient in patients" :key="patient.id" class="patient-card">
          <div class="patient-info">
            <h3>{{ patient.name }}</h3>
            <div class="patient-details">
              <p><span class="label">身份证:</span> {{ maskIdCard(patient.idCard) }}</p>
              <p><span class="label">性别:</span> {{ patient.gender === 1 ? '男' : (patient.gender === 0 ? '女' : '未知') }}</p>
              <p><span class="label">年龄:</span> {{ patient.age }}岁</p>
              <p v-if="patient.phone"><span class="label">电话:</span> {{ patient.phone }}</p>
            </div>
          </div>
          <div class="patient-actions">
            <button @click="editPatient(patient)" class="btn-edit">编辑</button>
            <button @click="deletePatient(patient.id)" class="btn-delete" :disabled="deletingId === patient.id">
              {{ deletingId === patient.id ? '删除中...' : '删除' }}
            </button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>

    <div v-if="showAddForm" class="modal-overlay" @click="closeForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingPatient ? '编辑就诊人' : '添加就诊人' }}</h3>
          <button @click="closeForm" class="btn-close">×</button>
        </div>

        <form @submit.prevent="submitForm" class="modal-body">
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input v-model="form.name" type="text" placeholder="请输入姓名" required>
          </div>

          <div class="form-group">
            <label>身份证号 <span class="required">*</span></label>
            <input v-model="form.idCard" type="text" placeholder="请输入身份证号" required>
          </div>

          <div class="form-group">
            <label>性别 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-item">
                <input v-model.number="form.gender" type="radio" :value="1">
                <span>男</span>
              </label>
              <label class="radio-item">
                <input v-model.number="form.gender" type="radio" :value="0">
                <span>女</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>年龄 <span class="required">*</span></label>
            <input v-model.number="form.age" type="number" placeholder="请输入年龄" min="0" max="150" required>
          </div>

          <div class="form-group">
            <label>联系电话</label>
            <input v-model="form.phone" type="tel" placeholder="请输入联系电话">
          </div>

          <div v-if="formError" class="form-error">{{ formError }}</div>

          <div class="form-actions">
            <button type="button" @click="closeForm" class="btn-cancel">取消</button>
            <button type="submit" class="btn-submit" :disabled="submitting">
              {{ submitting ? '提交中...' : '提交' }}
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
    const showAddForm = ref(false)
    const submitting = ref(false)
    const formError = ref('')
    const deletingId = ref(null)
    const editingPatient = ref(null)

    const form = ref({
      name: '',
      idCard: '',
      gender: 1,
      age: '',
      phone: ''
    })

    const maskIdCard = (idCard) => {
      if (!idCard || idCard.length < 5) return idCard
      return idCard.substring(0, 3) + '****' + idCard.substring(idCard.length - 2)
    }

    const fetchPatients = async () => {
      loading.value = true
      error.value = ''
      try {
        const response = await userAPI.getPatients()
        patients.value = (response || []).map(patient => ({
          ...patient,
          id: patient.id,
          age: Number(patient.age),
          gender: Number(patient.gender)
        }))
      } catch (err) {
        error.value = '加载就诊人列表失败'
        console.error('获取就诊人列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    const resetForm = () => {
      form.value = {
        name: '',
        idCard: '',
        gender: 1,
        age: '',
        phone: ''
      }
      formError.value = ''
      editingPatient.value = null
    }

    const closeForm = () => {
      showAddForm.value = false
      resetForm()
    }

    const editPatient = (patient) => {
      editingPatient.value = patient
      form.value = {
        name: patient.name,
        idCard: patient.idCard,
        gender: Number(patient.gender),
        age: Number(patient.age),
        phone: patient.phone || ''
      }
      showAddForm.value = true
    }

    const submitForm = async () => {
      formError.value = ''

      if (!form.value.name || !form.value.idCard || form.value.age === '') {
        formError.value = '请填写所有必填项'
        return
      }

      if (form.value.age < 0 || form.value.age > 150) {
        formError.value = '年龄必须在0-150之间'
        return
      }

      submitting.value = true
      try {
        const payload = {
          name: form.value.name,
          idCard: form.value.idCard,
          gender: Number(form.value.gender),
          age: Number(form.value.age),
          phone: form.value.phone || ''
        }

        await userAPI.insertPatient(payload)
        alert('就诊人信息已保存')
        closeForm()
        await fetchPatients()
      } catch (err) {
        formError.value = '保存失败，请重试'
        console.error('保存就诊人失败:', err)
      } finally {
        submitting.value = false
      }
    }

    const deletePatient = async (id) => {
      if (!confirm('确定要删除此就诊人吗？')) return
      deletingId.value = id
      try {
        alert('删除功能开发中，请联系客服')
        // 后端实现后使用：await userAPI.deletePatient(id)
      } catch (err) {
        alert('删除失败，请重试')
      } finally {
        deletingId.value = null
      }
    }

    onMounted(() => {
      fetchPatients()
    })

    return {
      patients,
      loading,
      error,
      showAddForm,
      submitting,
      formError,
      deletingId,
      editingPatient,
      form,
      maskIdCard,
      closeForm,
      editPatient,
      submitForm,
      deletePatient
    }
  }
}
</script>

<style scoped>
.patients-page {
  padding: 24px 0;
  min-height: calc(100vh - 180px);
}

.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 0 16px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  font-size: 24px;
  color: #2d3748;
  margin: 0;
}

.btn-add {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  margin-top: 12px;
  color: #718096;
  font-size: 14px;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 8px;
}

.empty-state p {
  color: #718096;
  margin-bottom: 16px;
}

.btn-primary {
  display: inline-block;
  padding: 10px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.patients-list {
  display: grid;
  gap: 16px;
}

.patient-card {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.patient-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.patient-info h3 {
  font-size: 16px;
  color: #2d3748;
  margin: 0 0 12px 0;
  font-weight: 600;
}

.patient-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.patient-details p {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.label {
  font-weight: 600;
  color: #4a5568;
}

.patient-actions {
  display: flex;
  gap: 8px;
}

.btn-edit,
.btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.btn-edit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-delete {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.btn-delete:hover:not(:disabled) {
  background: #ef4444;
  color: white;
}

.btn-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.1);
  color: #c53030;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  font-size: 14px;
  margin-top: 16px;
}

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
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  font-size: 18px;
  color: #2d3748;
  margin: 0;
}

.btn-close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  font-size: 24px;
  color: #718096;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-close:hover {
  color: #2d3748;
}

.modal-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.required {
  color: #ef4444;
}

.form-group input {
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.radio-group {
  display: flex;
  gap: 20px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.radio-item input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.form-error {
  padding: 10px 12px;
  background: rgba(239, 68, 68, 0.1);
  color: #c53030;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  font-size: 13px;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 8px;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel {
  background: #e2e8f0;
  color: #4a5568;
}

.btn-cancel:hover {
  background: #cbd5e0;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .patient-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .patient-details {
    grid-template-columns: 1fr;
  }

  .patient-actions {
    width: 100%;
  }

  .btn-edit,
  .btn-delete {
    flex: 1;
  }
}
</style>
