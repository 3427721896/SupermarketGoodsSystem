<template>
  <header class="topbar">
    <button class="menu-toggle" @click="$emit('toggleSidebar')" title="折叠菜单">☰</button>
    <div class="topbar-title">{{ title }}</div>
    <div class="topbar-actions">
      <span class="topbar-time">{{ currentTime }}</span>
      <span class="topbar-role-badge" :class="isAdmin ? 'badge-admin' : 'badge-employee'">
        {{ isAdmin ? '管理员' : '员工' }}
      </span>
      <button class="btn-logout" @click="handleLogout">退出登录</button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '../stores/auth'

defineProps({ title: String })
defineEmits(['toggleSidebar'])

const authStore = useAuthStore()
const isAdmin = authStore.isAdmin
const currentTime = ref('')

let timer = null

function updateClock() {
  const now = new Date()
  currentTime.value = now.toLocaleString('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  })
}

onMounted(() => {
  updateClock()
  timer = setInterval(updateClock, 1000)
})

onUnmounted(() => clearInterval(timer))

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    authStore.logout()
  }
}
</script>
