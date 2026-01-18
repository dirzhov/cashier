import { defineStore } from 'pinia'
import api from '../api'

export type Product = {
  id: number
  name: string
  price: number
  stock: number
}

export const useProductsStore = defineStore('products', {
  state: () => ({
    items: [] as Product[],
    loading: false
  }),

  actions: {
    async fetchAll() {
      this.loading = true
      const { data } = await api.get('/products')
      this.items = data
      this.loading = false
    },

    async create(product: Omit<Product, 'id'>) {
      const { data } = await api.post('/products', product, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      this.items.push(data)
    },

    async update(product: Product) {
      const { data } = await api.put(`/products/${product.id}`, product, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const index = this.items.findIndex(p => p.id === product.id)
      if (index !== -1) this.items[index] = data
    },

    async remove(id: number) {
      await api.delete(`/products/${id}`)
      this.items = this.items.filter(p => p.id !== id)
    }
  }
})
