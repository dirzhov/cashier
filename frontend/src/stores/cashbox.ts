import { defineStore } from 'pinia'
import api from '../api'

export type CashItem = {
  id: number
  name: string
  price: number
  qty: number
}

export const useCashboxStore = defineStore('cashbox', {
  state: () => ({
    items: [] as CashItem[]
  }),

  getters: {
    total: (state) =>
      state.items.reduce((sum, i) => sum + i.price * i.qty, 0)
  },

  actions: {
    add(product: { id: number; name: string; price: number }) {
      const item = this.items.find(i => i.id === product.id)
      if (item) item.qty++
      else this.items.push({ ...product, qty: 1 })
    },

    remove(id: number) {
      this.items = this.items.filter(i => i.id !== id)
    },

    clear() {
      this.items = []
    },

    async checkout() {
      await api.post('/sales', {
        items: this.items.map(i => ({
          productId: i.id,
          qty: i.qty
        }))
      })
      this.clear()
    }
  }
})
