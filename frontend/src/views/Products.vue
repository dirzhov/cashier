<template>
  <div class="products">
    <h2>Товары</h2>

    <!-- Поиск -->
    <input
      v-model="search"
      data-testid="product-search"
      placeholder="Поиск по названию"
      class="search"
    />

    <!-- Форма добавления (только ADMIN) -->
    <div v-if="isAdmin" class="form">
      <input v-model="form.name" placeholder="Название" />
      <input v-model.number="form.price" type="number" placeholder="Цена" />
      <input v-model.number="form.stock" type="number" placeholder="Остаток" />
      <button @click="save" data-testid="save">
        {{ form.id ? 'Сохранить' : 'Добавить товар' }}
      </button>
      <button v-if="form.id" @click="reset" data-testid="cancel">Отмена</button>
    </div>

    <!-- Таблица -->
    <table>
      <thead>
        <tr>
          <th>Фото</th>
          <th @click="sortBy('name')">Название</th>
          <th @click="sortBy('price')">Цена</th>
          <th @click="sortBy('stock')">Остаток</th>
          <th v-if="isAdmin">Загрузка фото</th>
          <th v-if="isAdmin">Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td>
            <img
              v-if="p.image"
              :src="p.image"
              width="60"
            />
          </td>
          <td>{{ p.name }}</td>
          <td>${{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <td v-if="isAdmin">
            <input type="file" @change="upload($event, p.id)" />
          </td>
          <td v-if="isAdmin">
            <button class="action-btn" @click="edit(p)">✏️</button>
            <button class="action-btn" @click="remove(p.id)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api'
import { useAuthStore } from '../stores/auth'

interface Product {
  id: number
  name: string
  price: number
  stock: number
}

const auth = useAuthStore()
const isAdmin = computed(() => auth.role === 'ADMIN')

const products = ref<Product[]>([])
const search = ref('')
const sortKey = ref<keyof Product>('name')
const sortAsc = ref(true)

const form = ref<Partial<Product>>({
  name: '',
  price: 0,
  stock: 0
})

const load = async () => {
  products.value = (await api.get('/products')).data
}

const save = async () => {
  if (form.value.id) {
    await api.put(`/products/${form.value.id}`, form.value)
  } else {
    await api.post('/products', form.value)
  }
  reset()
  load()
}

const edit = (p: Product) => {
  form.value = { ...p }
}

const remove = async (id: number) => {
  if (confirm('Удалить товар?')) {
    await api.delete(`/products/${id}`)
    load()
  }
}

const reset = () => {
  form.value = { name: '', price: 0, stock: 0 }
}

const sortBy = (key: keyof Product) => {
  if (sortKey.value === key) {
    sortAsc.value = !sortAsc.value
  } else {
    sortKey.value = key
    sortAsc.value = true
  }
}

const filtered = computed(() => {
  return products.value
    .filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort((a, b) => {
      const v1 = a[sortKey.value]
      const v2 = b[sortKey.value]
      return (v1 > v2 ? 1 : -1) * (sortAsc.value ? 1 : -1)
    })
})

const upload = async (e: Event, id: number) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const form = new FormData()
  form.append('file', file)

  const res = await api.post(`/products/${id}/image`, form)
  const index = products.value.findIndex(p => p.id === id)
  products.value[index] = res.data
}

onMounted(load)
</script>

<style scoped>
.products {
  max-width: 900px;
  margin: 0 auto;
}

.search {
  margin-bottom: 12px;
  padding: 6px;
  width: 100%;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.products .action-btn {
  width: 40px;
  height: 34px;
  margin-right: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  cursor: pointer;
  background: #f3f3f3;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

button {
  cursor: pointer;
}
</style>
