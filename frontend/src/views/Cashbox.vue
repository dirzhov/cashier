<template>
  <div class="cashbox">
    <h2>Касса</h2>

    <table v-if="cashbox.items.length">
      <thead>
        <tr>
          <th>Товар</th>
          <th>Цена</th>
          <th>Кол-во</th>
          <th>Сумма</th>
          <th></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in cashbox.items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.price }}</td>
          <td>
            <input
              type="number"
              min="1"
              v-model.number="item.qty"
              @change="cashbox.recalculate"
            />
          </td>
          <td>{{ item.price * item.qty }}</td>
          <td>
            <button @click="cashbox.remove(item.id)">✕</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty">Корзина пуста</p>

    <div class="total">
      <strong>Итого:</strong> {{ cashbox.total }}
    </div>

    <button
      class="checkout"
      :disabled="!cashbox.items.length"
      @click="checkout"
    >
      Оплатить и распечатать PDF-чек
    </button>
  </div>
</template>

<script setup lang="ts">
import { useCashboxStore } from '../stores/cashbox'
import { generateReceipt } from '../utils/receipt'

const cashbox = useCashboxStore()

const checkout = async () => {
  await cashbox.checkout()
  generateReceipt(cashbox.items, cashbox.total)
}
</script>

<style scoped>
.cashbox {
  max-width: 800px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}

th,
td {
  border: 1px solid #ccc;
  padding: 6px;
  text-align: left;
}

input[type='number'] {
  width: 60px;
}

button {
  padding: 6px 10px;
  cursor: pointer;
}

.checkout {
  margin-top: 12px;
  padding: 10px 16px;
  font-weight: bold;
}

.total {
  margin-top: 8px;
  font-size: 18px;
}

.empty {
  color: #777;
  margin: 16px 0;
}
</style>
