<template>
  <div class="dashboard-body">
    <Sidebar
      :collapsed="collapsed"
      :mobileExpanded="mobileExpanded"
      :currentPage="currentPage"
      @navigate="navigateTo"
    />
    <div class="main-wrapper" :class="{ expanded: collapsed }">
      <Topbar
        :title="pageTitle"
        @toggleSidebar="toggleSidebar"
      />
      <main class="content">
        <router-view />
      </main>
    </div>
    <!-- 模态框 -->
    <div class="modal-overlay" :class="{ show: modalVisible }" @click.self="closeModal">
      <div class="modal-box">
        <div class="modal-header">
          <h3>{{ modalTitle }}</h3>
          <button class="modal-close" @click="closeModal">✕</button>
        </div>
        <div class="modal-body" v-html="modalBody"></div>
        <div class="modal-footer" v-html="modalFooter"></div>
      </div>
    </div>
    <!-- 确认对话框 -->
    <div class="confirm-overlay" :class="{ show: confirmVisible }" @click.self="closeConfirm">
      <div class="confirm-box">
        <div class="confirm-icon">⚠️</div>
        <p>{{ confirmMsg }}</p>
        <div class="confirm-actions">
          <button class="btn-cancel" @click="closeConfirm">取消</button>
          <button class="btn-danger" @click="onConfirmOk">确认</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import Sidebar from '../components/Sidebar.vue'
import Topbar from '../components/Topbar.vue'

const router = useRouter()
const route = useRoute()

const collapsed = ref(false)
const mobileExpanded = ref(false)
const modalVisible = ref(false)
const modalTitle = ref('')
const modalBody = ref('')
const modalFooter = ref('')
const confirmVisible = ref(false)
const confirmMsg = ref('')
let confirmCallback = null

const pageTitleMap = {
  Dashboard: '控制台', Goods: '商品管理', Categories: '分类管理',
  Warehouses: '仓库管理', Suppliers: '供应商管理', Inbound: '入库管理',
  Outbound: '出库管理', Inventory: '库存查询', Employees: '员工管理'
}

const currentPage = computed(() => route.name || 'Dashboard')
const pageTitle = computed(() => pageTitleMap[currentPage.value] || '控制台')

function toggleSidebar() {
  if (window.innerWidth <= 768) {
    mobileExpanded.value = !mobileExpanded.value
  } else {
    collapsed.value = !collapsed.value
  }
}

function navigateTo(pageId) {
  const routeMap = {
    dashboard: '/dashboard', goods: '/dashboard/goods', categories: '/dashboard/categories',
    warehouses: '/dashboard/warehouses', suppliers: '/dashboard/suppliers',
    inbound: '/dashboard/inbound', outbound: '/dashboard/outbound',
    inventory: '/dashboard/inventory', employees: '/dashboard/employees'
  }
  router.push(routeMap[pageId] || '/dashboard')
}

function openModal(title, body, footer) {
  modalTitle.value = title
  modalBody.value = body
  modalFooter.value = footer || ''
  modalVisible.value = true
}

function closeModal() { modalVisible.value = false }

function showConfirm(msg, cb) {
  confirmMsg.value = msg
  confirmCallback = cb
  confirmVisible.value = true
}

function closeConfirm() { confirmVisible.value = false; confirmCallback = null }

function onConfirmOk() {
  if (confirmCallback) confirmCallback()
  closeConfirm()
}

// Expose to child components via provide
import { provide } from 'vue'
provide('openModal', openModal)
provide('closeModal', closeModal)
provide('showConfirm', showConfirm)
provide('formatMoney', (val) => '¥' + Number(val).toFixed(2))
provide('stockStatusBadge', (stock, minStock) => {
  if (stock === 0) return '<span class="badge badge-danger">缺货</span>'
  if (stock <= minStock) return '<span class="badge badge-warning">库存不足</span>'
  return '<span class="badge badge-success">正常</span>'
})
provide('stockRowClass', (stock, minStock) => {
  if (stock === 0) return 'row-out-stock'
  if (stock <= minStock) return 'row-low-stock'
  return ''
})
</script>
