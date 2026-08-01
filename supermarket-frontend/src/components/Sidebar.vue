<template>
  <aside class="sidebar" :class="{ collapsed: collapsed && !mobileExpanded }">
    <div class="sidebar-header">
      <div class="sidebar-logo">🏪</div>
      <div class="sidebar-title">
        <h2>仓库管理系统</h2>
        <small>SWMS v1.0</small>
      </div>
    </div>
    <nav class="sidebar-nav">
      <div v-for="section in visibleSections" :key="section.title" class="nav-section">
        <div class="nav-section-title">{{ section.title }}</div>
        <div
          v-for="item in section.items"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentPage === item.id }"
          @click="$emit('navigate', item.id)"
        >
          <span class="nav-item-icon">{{ item.icon }}</span>
          <span class="nav-item-label">{{ item.label }}</span>
        </div>
      </div>
    </nav>
    <div class="sidebar-footer">
      <span>👤 {{ currentUser?.name }}（{{ currentUser?.role === 'admin' ? '管理员' : '员工' }}）</span>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const props = defineProps({
  collapsed: Boolean,
  mobileExpanded: Boolean,
  currentPage: String
})

defineEmits(['navigate'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.currentUser)
const isAdmin = computed(() => authStore.isAdmin)

const navSections = [
  {
    title: '主菜单',
    items: [{ id: 'dashboard', icon: '📊', label: '控制台', adminOnly: false }]
  },
  {
    title: '基础数据',
    items: [
      { id: 'goods', icon: '📦', label: '商品管理', adminOnly: false },
      { id: 'categories', icon: '🏷️', label: '分类管理', adminOnly: false },
      { id: 'warehouses', icon: '🏭', label: '仓库管理', adminOnly: true },
      { id: 'suppliers', icon: '🚚', label: '供应商管理', adminOnly: true }
    ]
  },
  {
    title: '出入库',
    items: [
      { id: 'inbound', icon: '📥', label: '入库管理', adminOnly: false },
      { id: 'outbound', icon: '📤', label: '出库管理', adminOnly: false },
      { id: 'inventory', icon: '📋', label: '库存查询', adminOnly: false }
    ]
  },
  {
    title: '系统管理',
    items: [{ id: 'employees', icon: '👥', label: '员工管理', adminOnly: true }]
  }
]

const visibleSections = computed(() => {
  return navSections.map(section => ({
    ...section,
    items: section.items.filter(item => !item.adminOnly || isAdmin.value)
  })).filter(section => section.items.length > 0)
})
</script>
