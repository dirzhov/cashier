import { defineStore } from 'pinia'
import api from '../api'
import router from '../router'

type Role = 'ADMIN' | 'CASHIER'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') as string | null,
    email: localStorage.getItem('email') as string | null,
    role: localStorage.getItem('role') as Role | null
  }),

  getters: {
    isAuth: (state) => !!state.token
  },

  actions: {
    async login(email: string, password: string) {
      const { data } = await api.post('/auth/login', {
        email,
        password
      })

      this.token = data.token
      this.email = data.user.email
      this.role = data.user.role

      localStorage.setItem('token', <string> this.token)
      localStorage.setItem('email', this.email!)
      localStorage.setItem('role', this.role!)

      router.push('/')
    },

    logout() {
      this.token = null
      this.email = null
      this.role = null

      localStorage.clear()
      router.push('/login')
    }
  }
})
