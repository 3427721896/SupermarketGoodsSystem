import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../api'
import router from '../router'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(JSON.parse(sessionStorage.getItem('swms_current_user') || 'null'))
  const token = ref(sessionStorage.getItem('swms_token') || '')

  const isAdmin = computed(() => currentUser.value?.role === 'admin')

  async function login(username, password, role) {
    const res = await authAPI.login(username, password, role)
    const { user, token: jwt } = res.data
    currentUser.value = user
    token.value = jwt
    sessionStorage.setItem('swms_current_user', JSON.stringify(user))
    sessionStorage.setItem('swms_token', jwt)
    router.push('/dashboard')
  }

  function logout() {
    currentUser.value = null
    token.value = ''
    sessionStorage.removeItem('swms_current_user')
    sessionStorage.removeItem('swms_token')
    router.push('/')
  }

  return { currentUser, token, isAdmin, login, logout }
})
