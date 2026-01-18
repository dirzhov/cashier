<template>
  <div class="login">
    <h2>Вход</h2>

    <form @submit.prevent="login">
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Пароль"
        required
      />

      <button type="submit">Войти</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')

const login = async () => {
  error.value = ''
  try {
    await auth.login(email.value, password.value)
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Ошибка входа'
  }
}
</script>

<style scoped>
.login {
  max-width: 320px;
  margin: 80px auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
}

button {
  width: 100%;
}

.error {
  color: red;
  margin-top: 8px;
}
</style>
