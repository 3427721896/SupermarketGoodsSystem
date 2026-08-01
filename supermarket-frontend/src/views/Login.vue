<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="login-icon">🏪</div>
        <h1>超市货物仓库管理系统</h1>
        <p>Supermarket Warehouse Management System</p>
      </div>
      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-icon-wrapper">
            <span class="input-icon">👤</span>
            <input type="text" id="username" v-model="username" placeholder="请输入用户名" required autocomplete="off">
          </div>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-icon-wrapper">
            <span class="input-icon">🔒</span>
            <input type="password" id="password" v-model="password" placeholder="请输入密码" required>
          </div>
        </div>
        <div class="form-group">
          <label>登录身份</label>
          <div class="role-selector">
            <label class="role-option">
              <input type="radio" name="role" value="admin" v-model="role" checked>
              <span class="role-card">
                <span class="role-icon">🔧</span>
                <span class="role-name">管理员</span>
                <span class="role-desc">全部功能权限</span>
              </span>
            </label>
            <label class="role-option">
              <input type="radio" name="role" value="employee" v-model="role">
              <span class="role-card">
                <span class="role-icon">👨‍💼</span>
                <span class="role-name">员工</span>
                <span class="role-desc">日常操作权限</span>
              </span>
            </label>
          </div>
        </div>
        <div class="form-error">{{ errorMsg }}</div>
        <button type="submit" class="btn-login">登 录</button>
      </form>
      <div class="login-footer">
        <p>默认账号：admin / 123456（管理员）| employee / 123456（员工）</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const username = ref('')
const password = ref('')
const role = ref('admin')
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  if (!username.value || !password.value) {
    errorMsg.value = '请输入用户名和密码'
    return
  }
  try {
    await authStore.login(username.value, password.value, role.value)
  } catch (e) {
    errorMsg.value = e.response?.data?.message || '用户名或密码错误'
  }
}
</script>
