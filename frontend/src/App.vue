<template>
  <div>
    <header class="header">
      <nav>
        <router-link to="/">Товары</router-link>
        <router-link to="/cashbox">Касса</router-link>
        <router-link v-if="auth.role === 'ADMIN'" to="/reports">
          Отчёты
        </router-link>
      </nav>

      <button v-if="auth.isAuth" @click="auth.logout" data-testid="logout-btn">
        Выход
      </button>
    </header>

    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

nav {
  display: flex;
  gap: 12px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
