<template>
  <header class="header">
    <h1 class="logo">POS</h1>

    <nav>
      <router-link to="/">Товары</router-link>
      <router-link to="/cashbox">Касса</router-link>
      <router-link v-if="auth.role === 'ADMIN'" to="/reports">
        Отчёты
      </router-link>
    </nav>

    <div class="user">
      <span>{{ auth.email }}</span>
      <button @click="auth.logout">Выход</button>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  border-bottom: 1px solid #ddd;
}

.logo {
  font-weight: bold;
}

nav {
  display: flex;
  gap: 12px;
  margin-right: auto;
}

.user {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
