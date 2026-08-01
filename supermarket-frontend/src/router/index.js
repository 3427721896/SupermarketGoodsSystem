import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { guest: true }
  },
  {
    path: '/dashboard',
    component: () => import('../views/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'goods',
        name: 'Goods',
        component: () => import('../views/GoodsManage.vue')
      },
      {
        path: 'categories',
        name: 'Categories',
        component: () => import('../views/CategoryManage.vue')
      },
      {
        path: 'warehouses',
        name: 'Warehouses',
        component: () => import('../views/WarehouseManage.vue'),
        meta: { adminOnly: true }
      },
      {
        path: 'suppliers',
        name: 'Suppliers',
        component: () => import('../views/SupplierManage.vue'),
        meta: { adminOnly: true }
      },
      {
        path: 'inbound',
        name: 'Inbound',
        component: () => import('../views/InboundManage.vue')
      },
      {
        path: 'outbound',
        name: 'Outbound',
        component: () => import('../views/OutboundManage.vue')
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: () => import('../views/InventoryQuery.vue')
      },
      {
        path: 'employees',
        name: 'Employees',
        component: () => import('../views/EmployeeManage.vue'),
        meta: { adminOnly: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.currentUser) {
    next('/')
  } else if (to.meta.guest && authStore.currentUser) {
    next('/dashboard')
  } else if (to.meta.adminOnly && authStore.currentUser?.role !== 'admin') {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
