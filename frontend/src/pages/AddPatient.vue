<template>
  <div class="add-patient">
    <div class="container">
      <div class="form-card">
        <div class="form-header">
          <router-link to="/doctors" class="back-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
          </router-link>
          <h2>添加就诊人</h2>
          <div style="width: 40px"></div>
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label>姓名 <span class="required">*</span></label>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="请输入就诊人姓名"
              required
            >
          </div>

          <div class="form-group">
            <label>身份证号 <span class="required">*</span></label>
            <input 
              v-model="form.idCard" 
              type="text" 
              placeholder="请输入身份证号"
              required
            >
          </div>

          <div class="form-group">
            <label>性别 <span class="required">*</span></label>
            <div class="radio-group">
              <label class="radio-item">
                <input v-model="form.gender" type="radio" :value="1">
                <span>男</span>
              </label>
              <label class="radio-item">
                <input v-model="form.gender" type="radio" :value="0">
                <span>女</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>年龄 <span class="required">*</span></label>
            <input 
              v-model.number="form.age" 
              type="number" 
              placeholder="请输入年龄"
              min="0"
              max="150"
              required
            >
          </div>

          <div class="form-group">
            <label>联系电话</label>
            <input 
              v-model="form.phone" 
              type="tel" 
              placeholder="请输入联系电话"
            >
          </div>

          <div v-if="error" class="alert alert-error">
            {{ error }}
          </div>

          <button type="submit" class="btn btn-primary" :disabled="loading">
            <svg v-if="!loading" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="12 5 12 19"/>
              <polyline points="5 12 19 12"/>
            </svg>
            <span v-if="loading" class="spinner"></span>
            {{ loading ? '添加中...' : '添加就诊人' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userAPI } from '../api'

export default {
  name: 'AddPatient',
  setup() {
    const router = useRouter()
    const form = ref({
      name: '',
      idCard: '',
      gender: 1,
      age: '',
      phone: ''
    })
    const loading = ref(false)
    const error = ref('')

    const handleSubmit = async () => {
      if (!form.value.name || !form.value.idCard || !form.value.age) {
        error.value = '请填写所有必填项'
        return
      }

      loading.value = true
      error.value = ''
      try {
        await userAPI.insertPatient(form.value)
        alert('就诊人添加成功')
        router.back()
      } catch (err) {
        error.value = '添加失败，请重试'
        console.error('添加就诊人错误:', err)
      } finally {
        loading.value = false
      }
    }

    return { form, loading, error, handleSubmit }
  }
}
</script>

<style scoped>
.add-patient {
  min-height: 100vh;
  padding: 40px 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%);
}

.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 0 20px;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 40px;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.back-btn {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: white;
  text-decoration: none;
}

.back-btn:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateX(-2px);
}

.back-btn svg {
  width: 20px;
  height: 20px;
}

.form-header h2 {
  font-size: 24px;
  color: #2d3748;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #2d3748;
  font-size: 15px;
}

.required {
  color: #ef4444;
}

.form-group input {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.radio-group {
  display: flex;
  gap: 24px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #4a5568;
}

.radio-item input {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.alert {
  padding: 12px 16px;
  border-radius: 10px;
  font-size: 14px;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  color: #c53030;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 16px;
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

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .add-patient {
    padding: 20px 0;
  }

  .form-card {
    padding: 24px;
  }

  .form-header {
    margin-bottom: 24px;
  }

  .form-header h2 {
    font-size: 20px;
  }
}
</style>
