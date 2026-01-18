import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Login from '../views/Login.vue'
import Products from '../views/Products.vue'
import Cashbox from '../views/Cashbox.vue'
import Reports from '../views/Reports.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'products',
    component: Products
  },
  {
    path: '/cashbox',
    name: 'cashbox',
    component: Cashbox
  },
  {
    path: '/reports',
    name: 'reports',
    component: Reports,
    meta: { role: 'ADMIN' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.public) return true

  if (!auth.isAuth) {
    return { name: 'login' }
  }

  if (to.meta.role && auth.role !== to.meta.role) {
    return { name: 'products' }
  }

  return true
})

export default router
