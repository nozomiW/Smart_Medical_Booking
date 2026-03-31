<template>
  <div class="page">
    <div class="container">
      <div class="page-header">
        <div>
          <p class="section-label">账户中心</p>
          <h2>我的预约</h2>
        </div>
        <router-link to="/doctors" class="btn-new">
          <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd"/></svg>
          新增预约
        </router-link>
      </div>

      <div v-if="loading" class="page-loading">
        <div class="spinner spinner-dark"></div><span>加载中…</span>
      </div>

      <div v-else-if="orders.length === 0" class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>
        <h3>暂无预约记录</h3><p>前往医生排班页完成预约</p>
        <router-link to="/doctors" class="btn-primary-sm">去预约挂号</router-link>
      </div>

      <div v-else class="orders-wrap">
        <div v-if="pendingOrders.length" class="order-group">
          <div class="group-label"><span class="dot dot-warning"></span>待支付<span class="group-count">{{ pendingOrders.length }}</span></div>
          <div class="order-list">
            <div v-for="o in pendingOrders" :key="o.id" class="order-card">
              <div class="order-card-left">
                <div class="doc-avatar">{{ (o.doctorName||'医').charAt(0) }}</div>
                <div class="order-info">
                  <div class="order-doc">{{ o.doctorName }}</div>
                  <div class="order-meta"><span class="meta-tag">{{ o.deptName }}</span><span class="meta-dot">·</span><span>{{ o.reserveDate }}</span></div>
                  <div class="order-patient">就诊人：{{ o.patientName }}</div>
                </div>
              </div>
              <div class="order-card-right">
                <div class="order-fee">¥{{ formatPrice(o.fee) }}</div>
                <span class="badge badge-warning">待支付</span>
                <div class="order-btns">
                  <button class="btn-icon" @click="viewDetail(o)">详情</button>
                  <button class="btn-pay" @click="payOrder(o.id)" :disabled="payingId===o.id">{{ payingId===o.id?'…':'支付' }}</button>
                  <button class="btn-cancel-sm" @click="cancelOrder(o.id)" :disabled="cancelingId===o.id">取消</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="paidOrders.length" class="order-group">
          <div class="group-label"><span class="dot dot-success"></span>已支付<span class="group-count">{{ paidOrders.length }}</span></div>
          <div class="order-list">
            <div v-for="o in paidOrders" :key="o.id" class="order-card muted">
              <div class="order-card-left">
                <div class="doc-avatar paid">{{ (o.doctorName||'医').charAt(0) }}</div>
                <div class="order-info">
                  <div class="order-doc">{{ o.doctorName }}</div>
                  <div class="order-meta"><span class="meta-tag success">{{ o.deptName }}</span><span class="meta-dot">·</span><span>{{ o.reserveDate }}</span></div>
                  <div class="order-patient">就诊人：{{ o.patientName }}</div>
                </div>
              </div>
              <div class="order-card-right">
                <div class="order-fee">¥{{ formatPrice(o.fee) }}</div>
                <span class="badge badge-success">已支付</span>
                <div class="order-btns"><button class="btn-icon" @click="viewDetail(o)">详情</button></div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="cancelledOrders.length" class="order-group">
          <div class="group-label"><span class="dot dot-muted"></span>已取消<span class="group-count">{{ cancelledOrders.length }}</span></div>
          <div class="order-list">
            <div v-for="o in cancelledOrders" :key="o.id" class="order-card muted cancelled">
              <div class="order-card-left">
                <div class="doc-avatar cancelled">{{ (o.doctorName||'医').charAt(0) }}</div>
                <div class="order-info">
                  <div class="order-doc">{{ o.doctorName }}</div>
                  <div class="order-meta"><span class="meta-tag">{{ o.deptName }}</span><span class="meta-dot">·</span><span>{{ o.reserveDate }}</span></div>
                  <div class="order-patient">就诊人：{{ o.patientName }}</div>
                </div>
              </div>
              <div class="order-card-right">
                <div class="order-fee cancelled-fee">¥{{ formatPrice(o.fee) }}</div>
                <span class="badge badge-neutral">已取消</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>预约详情</h3>
          <button class="btn-close-modal" @click="closeDetailModal"><svg viewBox="0 0 20 20" fill="currentColor" width="18" height="18"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg></button>
        </div>
        <div class="modal-body" v-if="selectedOrder">
          <div class="detail-doc-header">
            <div class="detail-avatar">{{ (selectedOrder.doctorName||'医').charAt(0) }}</div>
            <div><div class="detail-doc-name">{{ selectedOrder.doctorName }}</div><div class="detail-dept">{{ selectedOrder.deptName }}</div></div>
            <span class="badge" :class="'badge-'+getStatusBadge(selectedOrder.orderStatus)">{{ getStatusText(selectedOrder.orderStatus) }}</span>
          </div>
          <div class="detail-rows">
            <div class="detail-row"><span>订单号</span><span class="mono">{{ selectedOrder.orderNo||'ORD'+selectedOrder.id }}</span></div>
            <div class="detail-row"><span>就诊人</span><span>{{ selectedOrder.patientName }}</span></div>
            <div class="detail-row"><span>预约日期</span><span>{{ selectedOrder.reserveDate }}</span></div>
            <div class="detail-row"><span>挂号费</span><span class="fee-value">¥{{ formatPrice(selectedOrder.fee) }}</span></div>
          </div>
        </div>
        <div class="modal-footer"><button class="btn-primary-sm" @click="closeDetailModal">关闭</button></div>
      </div>
    </div>
    <div v-if="error" class="toast-error">{{ error }}</div>
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
    const cancelledOrders = computed(() => orders.value.filter(o => o.orderStatus === -1))
    const formatPrice = (p) => typeof p === 'number' ? p.toFixed(2) : String(p)
    const fetchOrders = async () => {
      loading.value = true; error.value = ''
      try {
        const response = await orderAPI.getList()
        orders.value = (response || []).map(item => {
          const order = item.order || {}
          const orderItem = item.orderItem || {}
          return { id: String(order.id), orderNo: order.orderNo, doctorName: orderItem.docName||'未知医生',
            deptName: orderItem.deptName||'未知科室', reserveDate: orderItem.workDate||'',
            fee: Number(order.amount||0), orderStatus: Number(order.status||0),
            patientName: orderItem.patientName||'', scheduleId: String(orderItem.scheduleId||0) }
        })
      } catch { error.value = '加载失败' } finally { loading.value = false }
    }
    const payOrder = async (id) => {
      if (!confirm('确认支付？')) return
      payingId.value = id
      try { await payAPI.pay(id); await fetchOrders() }
      catch { error.value = '支付失败'; setTimeout(() => error.value='',3000) }
      finally { payingId.value = null }
    }
    const cancelOrder = async (id) => {
      if (!confirm('确定取消？')) return
      cancelingId.value = id
      try { await orderAPI.cancel(String(id)); await fetchOrders() }
      catch { error.value = '取消失败'; setTimeout(() => error.value='',3000) }
      finally { cancelingId.value = null }
    }
    const viewDetail = (o) => { selectedOrder.value = o; showDetailModal.value = true }
    const closeDetailModal = () => { showDetailModal.value = false; selectedOrder.value = null }
    const getStatusText = (s) => ({0:'待支付',1:'已支付',2:'已完成','-1':'已取消'}[String(s)]||'未知')
    const getStatusBadge = (s) => ({0:'warning',1:'success',2:'info','-1':'neutral'}[String(s)]||'neutral')
    onMounted(fetchOrders)
    return { orders, loading, error, payingId, cancelingId, pendingOrders, paidOrders, cancelledOrders,
      formatPrice, payOrder, cancelOrder, viewDetail, closeDetailModal, getStatusText, getStatusBadge,
      showDetailModal, selectedOrder }
  }
}
</script>

<style scoped>
.page { padding: 32px 0 64px; }
.page-header { display:flex; justify-content:space-between; align-items:flex-end; margin-bottom:32px; }
.page-header h2 { font-size:24px; font-weight:700; color:var(--ink); letter-spacing:-0.03em; margin:0; }
.btn-new { display:inline-flex; align-items:center; gap:6px; padding:9px 18px; background:var(--accent); color:white; border-radius:var(--r-md); font-size:14px; font-weight:600; text-decoration:none; transition:all var(--t); box-shadow:var(--shadow-accent); }
.btn-new:hover { background:var(--accent-dark); transform:translateY(-1px); }
.btn-primary-sm { display:inline-flex; align-items:center; gap:6px; padding:9px 20px; background:var(--accent); color:white; border-radius:var(--r-md); font-size:14px; font-weight:600; text-decoration:none; border:none; cursor:pointer; transition:all var(--t); }
.btn-primary-sm:hover { background:var(--accent-dark); }
.orders-wrap { display:flex; flex-direction:column; gap:32px; }
.group-label { display:flex; align-items:center; gap:8px; font-size:12px; font-weight:700; color:var(--gray-500); text-transform:uppercase; letter-spacing:0.06em; margin-bottom:12px; }
.dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.dot-warning { background:var(--warning); }
.dot-success { background:var(--success); }
.dot-muted { background:var(--gray-300); }
.group-count { display:inline-flex; align-items:center; justify-content:center; min-width:20px; height:20px; background:var(--gray-100); border-radius:var(--r-full); font-size:11px; color:var(--gray-500); padding:0 5px; }
.order-list { display:flex; flex-direction:column; gap:10px; }
.order-card { background:white; border:1px solid var(--gray-200); border-radius:var(--r-lg); padding:18px 20px; display:flex; justify-content:space-between; align-items:center; gap:16px; transition:all var(--t); }
.order-card:hover { box-shadow:var(--shadow-md); border-color:var(--gray-300); }
.order-card.muted { opacity:0.8; }
.order-card.cancelled { background:var(--gray-50); }
.order-card-left { display:flex; align-items:center; gap:14px; flex:1; min-width:0; }
.doc-avatar { width:44px; height:44px; border-radius:50%; flex-shrink:0; background:var(--accent); color:white; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; }
.doc-avatar.paid { background:var(--success); }
.doc-avatar.cancelled { background:var(--gray-300); }
.order-doc { font-size:15px; font-weight:600; color:var(--ink); margin-bottom:4px; }
.order-meta { display:flex; align-items:center; gap:6px; margin-bottom:3px; }
.meta-tag { font-size:12px; font-weight:500; color:var(--accent); background:var(--accent-light); padding:2px 8px; border-radius:var(--r-full); }
.meta-tag.success { color:var(--success); background:var(--success-bg); }
.meta-dot { color:var(--gray-300); }
.order-meta span:last-child { font-size:12px; color:var(--gray-500); }
.order-patient { font-size:12px; color:var(--gray-400); }
.order-card-right { display:flex; flex-direction:column; align-items:flex-end; gap:8px; flex-shrink:0; }
.order-fee { font-size:18px; font-weight:700; color:var(--ink); letter-spacing:-0.02em; }
.cancelled-fee { color:var(--gray-400); text-decoration:line-through; }
.order-btns { display:flex; gap:6px; align-items:center; }
.btn-icon { padding:6px 12px; background:var(--gray-50); border:1px solid var(--gray-200); border-radius:var(--r-sm); font-size:12px; font-weight:500; color:var(--gray-600); cursor:pointer; transition:all var(--t); }
.btn-icon:hover { background:var(--gray-100); color:var(--ink); }
.btn-pay { padding:7px 16px; background:var(--success); color:white; border:none; border-radius:var(--r-sm); font-size:13px; font-weight:600; cursor:pointer; transition:all var(--t); }
.btn-pay:hover:not(:disabled) { background:#15803d; transform:translateY(-1px); }
.btn-pay:disabled { opacity:0.6; cursor:not-allowed; }
.btn-cancel-sm { padding:7px 12px; background:white; color:var(--danger); border:1.5px solid rgba(220,38,38,0.3); border-radius:var(--r-sm); font-size:13px; font-weight:500; cursor:pointer; transition:all var(--t); }
.btn-cancel-sm:hover:not(:disabled) { background:var(--danger-bg); border-color:var(--danger); }
.btn-cancel-sm:disabled { opacity:0.6; cursor:not-allowed; }
.detail-doc-header { display:flex; align-items:center; gap:14px; padding:16px; background:var(--gray-50); border-radius:var(--r-md); margin-bottom:20px; }
.detail-avatar { width:48px; height:48px; border-radius:50%; background:var(--accent); color:white; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:700; flex-shrink:0; }
.detail-doc-name { font-size:16px; font-weight:600; color:var(--ink); margin-bottom:3px; }
.detail-dept { font-size:13px; color:var(--gray-500); }
.detail-doc-header .badge { margin-left:auto; }
.detail-rows { display:flex; flex-direction:column; }
.detail-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid var(--gray-100); font-size:14px; }
.detail-row:last-child { border-bottom:none; }
.detail-row span:first-child { color:var(--gray-500); font-weight:500; }
.detail-row span:last-child { color:var(--ink); font-weight:500; }
.mono { font-family:var(--font-mono); font-size:12px; }
.fee-value { font-size:18px; font-weight:700; color:var(--accent); }
.btn-close-modal { background:none; border:none; cursor:pointer; color:var(--gray-400); padding:4px; display:flex; align-items:center; border-radius:var(--r-sm); transition:all var(--t); }
.btn-close-modal:hover { color:var(--ink); background:var(--gray-100); }
.toast-error { position:fixed; bottom:24px; right:24px; background:var(--danger); color:white; padding:12px 20px; border-radius:var(--r-md); font-size:14px; font-weight:500; z-index:300; box-shadow:var(--shadow-lg); }
@media (max-width:768px) {
  .order-card { flex-direction:column; align-items:flex-start; }
  .order-card-right { align-items:flex-start; width:100%; flex-direction:row; justify-content:space-between; flex-wrap:wrap; }
}
</style>