import axios from 'axios'
import { useAuthStore } from '../stores/auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 10000
})

api.interceptors.request.use(config => {
  const authStore = useAuthStore()
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`
  }
  return config
})

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
    }
    return Promise.reject(error)
  }
)

export default api

// ========== Auth API ==========
export const authAPI = {
  login: (username, password, role) => api.post('/auth/login', { username, password, role })
}

// ========== Users API ==========
export const userAPI = {
  getAll: () => api.get('/users'),
  save: (user) => api.post('/users', user),
  delete: (id) => api.delete(`/users/${id}`)
}

// ========== Categories API ==========
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  save: (cat) => api.post('/categories', cat),
  delete: (id) => api.delete(`/categories/${id}`)
}

// ========== Suppliers API ==========
export const supplierAPI = {
  getAll: () => api.get('/suppliers'),
  save: (sup) => api.post('/suppliers', sup),
  delete: (id) => api.delete(`/suppliers/${id}`)
}

// ========== Warehouses API ==========
export const warehouseAPI = {
  getAll: () => api.get('/warehouses'),
  save: (wh) => api.post('/warehouses', wh),
  delete: (id) => api.delete(`/warehouses/${id}`)
}

// ========== Goods API ==========
export const goodsAPI = {
  getAll: () => api.get('/goods'),
  save: (goods) => api.post('/goods', goods),
  delete: (id) => api.delete(`/goods/${id}`),
  getStats: () => api.get('/goods/stats')
}

// ========== Inbound API ==========
export const inboundAPI = {
  getAll: () => api.get('/inbound'),
  save: (record) => api.post('/inbound', record),
  delete: (id) => api.delete(`/inbound/${id}`)
}

// ========== Outbound API ==========
export const outboundAPI = {
  getAll: () => api.get('/outbound'),
  save: (record) => api.post('/outbound', record),
  delete: (id) => api.delete(`/outbound/${id}`)
}
