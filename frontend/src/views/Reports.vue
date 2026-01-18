<template>
  <div>
    <h2>Отчёты</h2>

    <section class="summary">
      <div>Выручка: {{ summary.revenue }}</div>
      <div>Продаж: {{ summary.salesCount }}</div>
      <div>Товаров: {{ summary.productsCount }}</div>
      <div>Пользователей: {{ summary.usersCount }}</div>
    </section>

    <canvas ref="salesChart" height="120"></canvas>
    <canvas ref="productsChart" height="120"></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Chart from 'chart.js/auto'
import api from '../api'

const summary = ref({
  revenue: 0,
  salesCount: 0,
  productsCount: 0,
  usersCount: 0
})

const salesChart = ref<HTMLCanvasElement | null>(null)
const productsChart = ref<HTMLCanvasElement | null>(null)

onMounted(async () => {
  const summaryRes = await api.get('/reports/summary')
  summary.value = summaryRes.data

  const sales = await api.get('/reports/sales-by-day')
  new Chart(salesChart.value!, {
    type: 'line',
    data: {
      labels: sales.data.map((i: any) => i.day),
      datasets: [
        {
          label: 'Продажи',
          data: sales.data.map((i: any) => i.total)
        }
      ]
    }
  })

  const top = await api.get('/reports/top-products')
  new Chart(productsChart.value!, {
    type: 'bar',
    data: {
      labels: top.data.map((i: any) => i.name),
      datasets: [
        {
          label: 'Топ товары',
          data: top.data.map((i: any) => i.qty)
        }
      ]
    }
  })
})
</script>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
</style>
