<template>
  <div class="bookings">
    <div class="container">
      <div class="page-header">
        <h2>我的预约</h2>
        <router-link to="/doctors" class="btn-new">新增预约</router-link>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>加载中...</p>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <p>暂无预约记录</p>
        <router-link to="/doctors" class="btn-primary">去预约</router-link>
      </div>

      <div v-else class="orders-container">
        <!-- 待支付订单 -->
        <div v-if="pendingOrders.length > 0" class="order-section">
          <h3 class="section-title">待支付</h3>
          <div class="order-list">
            <div v-for="order in pendingOrders" :key="order.id" class="order-item">
              <div class="order-main">
                <div class="doctor-info">
                  <h4>{{ order.doctorName }}</h4>
                  <p>{{ order.deptName }}</p>
                </div>
                <div class="order-time">
                  <p class="date">{{ order.reserveDate }}</p>
                  <p class="time">{{ order.reserveTime }}</p>
                </div>
                <div class="order-fee">¥{{ formatPrice(order.fee) }}</div>
              </div>
              <div class="order-actions">
                <button @click="viewDetail(order)" class="btn-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  详情
                </button>
                <button @click="payOrder(order.id)" class="btn-pay" :disabled="payingId === order.id">
                  {{ payingId === order.id ? '支付中...' : '支付' }}
                </button>
                <button @click="cancelOrder(order.id)" class="btn-cancel" :disabled="cancelingId === order.id">
                  {{ cancelingId === order.id ? '取消中...' : '取消' }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 已支付订单 -->
        <div v-if="paidOrders.length > 0" class="order-section">
          <h3 class="section-title">已支付</h3>
          <div class="order-list">
            <div v-for="order in paidOrders" :key="order.id" class="order-item paid">
              <div class="order-main">
                <div class="doctor-info">
                  <h4>{{ order.doctorName }}</h4>
                  <p>{{ order.deptName }}</p>
                </div>
                <div class="order-time">
                  <p class="date">{{ order.reserveDate }}</p>
                  <p class="time">{{ order.reserveTime }}</p>
                </div>
                <div class="order-fee">¥{{ formatPrice(order.fee) }}</div>
              </div>
              <div class="order-actions">
                <button @click="viewDetail(order)" class="btn-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  详情
                </button>
              </div>
              <div class="order-status">已支付</div>
            </div>
          </div>
        </div>

        <!-- 已完成订单 -->
        <div v-if="completedOrders.length > 0" class="order-section">
          <h3 class="section-title">已完成</h3>
          <div class="order-list">
            <div v-for="order in completedOrders" :key="order.id" class="order-item completed">
              <div class="order-main">
                <div class="doctor-info">
                  <h4>{{ order.doctorName }}</h4>
                  <p>{{ order.deptName }}</p>
                </div>
                <div class="order-time">
                  <p class="date">{{ order.reserveDate }}</p>
                  <p class="time">{{ order.reserveTime }}</p>
                </div>
                <div class="order-fee">¥{{ formatPrice(order.fee) }}</div>
              </div>
              <div class="order-actions">
                <button @click="viewDetail(order)" class="btn-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  详情
                </button>
              </div>
              <div class="order-status">已完成</div>
            </div>
          </div>
        </div>

        <!-- 已取消订单 -->
        <div v-if="cancelledOrders.length > 0" class="order-section">
          <h3 class="section-title">已取消</h3>
          <div class="order-list">
            <div v-for="order in cancelledOrders" :key="order.id" class="order-item cancelled">
              <div class="order-main">
                <div class="doctor-info">
                  <h4>{{ order.doctorName }}</h4>
                  <p>{{ order.deptName }}</p>
                </div>
                <div class="order-time">
                  <p class="date">{{ order.reserveDate }}</p>
                  <p class="time">{{ order.reserveTime }}</p>
                </div>
                <div class="order-fee">¥{{ formatPrice(order.fee) }}</div>
              </div>
              <div class="order-actions">
                <button @click="viewDetail(order)" class="btn-detail">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  详情
                </button>
              </div>
              <div class="order-status">已取消</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 订单详情弹窗 -->
      <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
        <div class="modal-detail" @click.stop>
          <div class="modal-header">
            <h3>订单详情</h3>
            <button @click="closeDetailModal" class="btn-close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div v-if="selectedOrder" class="detail-content">
              <div class="detail-section">
                <h4>基本信息</h4>
                <div class="detail-row">
                  <span class="label">订单号：</span>
                  <span class="value">{{ selectedOrder.orderNo || 'ORD' + selectedOrder.id }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">就诊人：</span>
                  <span class="value">{{ selectedOrder.patientName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">状态：</span>
                  <span class="value" :class="['status-tag', 'status-' + getStatusClass(selectedOrder.orderStatus)]">
                    {{ getStatusText(selectedOrder.orderStatus) }}
                  </span>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>医生信息</h4>
                <div class="detail-row">
                  <span class="label">医生姓名：</span>
                  <span class="value">{{ selectedOrder.doctorName }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">科室：</span>
                  <span class="value">{{ selectedOrder.deptName }}</span>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>预约时间</h4>
                <div class="detail-row">
                  <span class="label">预约日期：</span>
                  <span class="value">{{ selectedOrder.reserveDate }}</span>
                </div>
                <div class="detail-row">
                  <span class="label">预约时间：</span>
                  <span class="value">{{ selectedOrder.reserveTime }}</span>
                </div>
              </div>
              
              <div class="detail-section">
                <h4>费用信息</h4>
                <div class="detail-row">
                  <span class="label">挂号费：</span>
                  <span class="value amount">¥{{ formatPrice(selectedOrder.fee) }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button @click="closeDetailModal" class="btn btn-primary">关闭</button>
          </div>
        </div>
      </div>

      <div v-if="error" class="error-message">{{ error }}</div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { orderAPI, payAPI } from '../api'

export default {
  name: 'Bookings',
  setup() {
    const orders = ref([])
    const loading = ref(false)
    const error = ref('')
    const payingId = ref(null)
    const cancelingId = ref(null)
    const showDetailModal = ref(false)
    const selectedOrder = ref(null)

    const pendingOrders = computed(() => orders.value.filter(o => o.orderStatus === 0))
    const paidOrders = computed(() => orders.value.filter(o => o.orderStatus === 1))
    const completedOrders = computed(() => orders.value.filter(o => o.orderStatus === 2))
    const cancelledOrders = computed(() => orders.value.filter(o => o.orderStatus === -1))

    const formatPrice = (price) => {
      if (typeof price === 'number') {
        return price.toFixed(2)
      }
      return String(price)
    }

    const fetchOrders = async () => {
      loading.value = true
      error.value = ''
      try {
        const response = await orderAPI.getList()
        // 适配后端返回的数据结构
        orders.value = (response || []).map(item => {
          const order = item.order || {}
          const orderItem = item.orderItem || {}
          
          return {
            id: String(order.id),
            doctorName: orderItem.docName || '未知医生',
            deptName: orderItem.deptName || '未知科室',
            reserveDate: orderItem.workDate || '',
            reserveTime: '待定',
            fee: Number(order.amount || 0),
            orderStatus: Number(order.status || 0),
            patientName: orderItem.patientName || '',
            scheduleId: String(orderItem.scheduleId || 0)
          }
        })
      } catch (err) {
        error.value = '加载预约列表失败'
        console.error('获取预约列表失败:', err)
      } finally {
        loading.value = false
      }
    }

    const payOrder = async (id) => {
      if (!confirm('确认支付此预约？')) return
      payingId.value = id
      try {
        await payAPI.pay(id)
        alert('支付成功')
        await fetchOrders()
      } catch (err) {
        alert('支付失败，请重试')
        console.error('支付错误:', err)
      } finally {
        payingId.value = null
      }
    }

    const cancelOrder = async (id) => {
      if (!confirm('确定要取消此预约吗？')) return
      cancelingId.value = id
      try {
        await orderAPI.cancel(String(id))
        alert('预约已取消')
        await fetchOrders()
      } catch (err) {
        console.error('取消失败详情:', err)
        alert('取消失败，请重试')
      } finally {
        cancelingId.value = null
      }
    }

    const viewDetail = async (order) => {
      selectedOrder.value = order
      showDetailModal.value = true
    }

    const closeDetailModal = () => {
      showDetailModal.value = false
      selectedOrder.value = null
    }

    const getStatusText = (status) => {
      const statusMap = {
        0: '待支付',
        1: '已支付',
        2: '已完成',
        '-1': '已取消'
      }
      return statusMap[String(status)] || '未知'
    }

    const getStatusClass = (status) => {
      const classMap = {
        0: 'pending',
        1: 'paid',
        2: 'completed',
        '-1': 'cancelled'
      }
      return classMap[String(status)] || ''
    }

    onMounted(() => {
      fetchOrders()
    })

    return {
      orders,
      loading,
      error,
      payingId,
      cancelingId,
      pendingOrders,
      paidOrders,
      completedOrders,
      cancelledOrders,
      formatPrice,
      payOrder,
      cancelOrder,
      viewDetail,
      closeDetailModal,
      getStatusText,
      getStatusClass,
      showDetailModal,
      selectedOrder
    }
  }
}
</script>

<style scoped>
.bookings {
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

.btn-new {
  padding: 8px 16px;
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

.btn-new:hover {
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

.orders-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.order-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #e2e8f0;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s ease;
}

.order-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.order-item.paid,
.order-item.completed,
.order-item.cancelled {
  opacity: 0.8;
}

.order-main {
  display: flex;
  align-items: center;
  gap: 20px;
  flex: 1;
}

.doctor-info h4 {
  font-size: 15px;
  color: #2d3748;
  margin: 0 0 4px 0;
  font-weight: 600;
}

.doctor-info p {
  font-size: 13px;
  color: #667eea;
  margin: 0;
}

.order-time {
  text-align: center;
  min-width: 100px;
}

.order-time .date {
  font-size: 13px;
  color: #718096;
  margin: 0;
}

.order-time .time {
  font-size: 14px;
  color: #2d3748;
  margin: 4px 0 0 0;
  font-weight: 600;
}

.order-fee {
  font-size: 16px;
  color: #ef4444;
  font-weight: 700;
  min-width: 60px;
  text-align: right;
}

.order-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-detail {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: #f7fafc;
  color: #4a5568;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-detail svg {
  width: 16px;
  height: 16px;
}

.btn-detail:hover {
  background: #edf2f7;
  border-color: #cbd5e0;
}

.btn-pay {
  padding: 8px 16px;
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-pay:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3);
}

.btn-pay:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  padding: 8px 16px;
  background: #fff;
  color: #e53e3e;
  border: 1px solid #e53e3e;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-cancel:hover:not(:disabled) {
  background: #fff5f5;
  border-color: #c53030;
}

.btn-cancel:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 订单详情弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
}

.modal-detail {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
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
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #718096;
  transition: all 0.3s ease;
}

.btn-close:hover {
  color: #2d3748;
  transform: rotate(90deg);
}

.btn-close svg {
  width: 24px;
  height: 24px;
}

.modal-body {
  padding: 24px;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: #f7fafc;
  padding: 16px;
  border-radius: 8px;
}

.detail-section h4 {
  font-size: 14px;
  color: #4a5568;
  margin: 0 0 12px 0;
  font-weight: 600;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 8px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
}

.detail-row .label {
  color: #718096;
  font-weight: 500;
}

.detail-row .value {
  color: #2d3748;
  font-weight: 500;
  text-align: right;
}

.detail-row .value.amount {
  color: #e53e3e;
  font-size: 18px;
  font-weight: 600;
}

.status-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-pending {
  background: #fefcbf;
  color: #975a16;
}

.status-paid {
  background: #c6f6d5;
  color: #22543d;
}

.status-completed {
  background: #bee3f8;
  color: #2c5282;
}

.status-cancelled {
  background: #fed7d7;
  color: #742a2a;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e2e8f0;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .order-main {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .order-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .order-actions {
    width: 100%;
  }

  .btn-pay,
  .btn-cancel {
    flex: 1;
  }

  .order-fee {
    text-align: left;
  }
}
</style>
