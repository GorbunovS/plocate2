<template>
  <div class="body">
    <div class="header">
      <div class="logo">
        <img :src="logoSrc" alt="logo">  <!-- Динамический :src -->
      </div>
    </div>
    <div class="views">
      Добро пожаловать в PetLocate<br>
      Мы поможем найти вашего питомца или возможного хозяина
    </div>
    <div class="actions">
      <Button label="Создать объявление" severity="success" variant="outlined" />
      <Button label="Карта(скоро)" severity="secondary" variant="outlined" />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Pl_logo from '/src/assets/pl_logo.svg';       // Для светлой темы
import Pl_logo_dark from '/src/assets/pl_logo_dark.svg'; // Для тёмной темы
import '../style.css';

// Реактивная переменная для темы (по умолчанию 'dark', как в твоём CSS)
const currentTheme = ref(localStorage.getItem('theme') || 'dark');

// Computed для выбора логотипа
const logoSrc = computed(() => {
  return currentTheme.value === 'light' ? Pl_logo_dark : Pl_logo;
});


</script>

<style scoped>
/* Твои стили из предыдущих сообщений */
.body {
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.views {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px;
}
</style>
