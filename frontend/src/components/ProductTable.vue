<template>
  <div>
    <input
      v-model="search"
      placeholder="Поиск товара..."
      class="search"
    />

    <table>
      <thead>
        <tr>
          <th @click="sort('name')">Название</th>
          <th @click="sort('price')">Цена</th>
          <th @click="sort('stock')">Остаток</th>
          <th v-if="isAdmin">Действия</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="p in filtered" :key="p.id">
          <td>{{ p.name }}</td>
          <td>{{ p.price }}</td>
          <td>{{ p.stock }}</td>
          <td v-if="isAdmin">
            <button @click="$emit('edit', p)">✏️</button>
            <button @click="$emit('remove', p.id)">🗑</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import type { Product } from '../stores/products'

defineProps<{
  products: Product[]
}>()

defineEmits<{
  (e: 'edit', product: Product): void
  (e: 'remove', id: number): void
}>()

const auth = useAuthStore()
const isAdmin = computed(() => auth.role === 'ADMIN')

const search = ref('')
const sortKey = ref<'name' | 'price' | 'stock'>('name')
const asc = ref(true)

const sort = (key: typeof sortKey.value) => {
  asc.value = sortKey.value === key ? !asc.value : true
  sortKey.value = key
}

const filtered = computed(() => {
  return [...$props.products]
    .filter(p =>
      p.name.toLowerCase().includes(search.value.toLowerCase())
    )
    .sort((a, b) => {
      const v1 = a[sortKey.value]
      const v2 = b[sortKey.value]
      return asc.value ? v1 - v2 : v2 - v1
    })
})
</script>

<style scoped>
.search {
  margin-bottom: 8px;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  cursor: pointer;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
}
</style>
