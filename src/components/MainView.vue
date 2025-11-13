<template>
  <div class="header p-4 flex h-20 z-10 mt-10 items-center justify-center">
    <span>{{ userName  }}</span> <!-- Fallback если данных нет -->
  </div>
  <div class="body gap-5 flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
    <div v-if="currentPage === 'newAd'">
      <NewAdWindow @back="currentPage = 'home'" />
    </div>
    
    <div v-if="currentPage === 'home'" class="views flex flex-col items-center justify-center text-center p-4 gap-4">
      <img :src="logoSrc" alt="PetLocate logo" class="w-32 h-32 object-contain" /> <!-- Используем computed для динамического логотипа -->
      <p class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
      <div class="actions p-4 flex flex-col gap-2 sm:gap-4 w-full justify-center mt-15">
        <Button label="Создать объявление" severity="success" variant="outlined" @click="currentPage = 'newAd'" class="sm:w-auto" />
        <Button label="Карта(скоро)" severity="secondary" variant="outlined" class="w-full sm:w-auto" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue';
import {  retrieveLaunchParams } from '@telegram-apps/sdk';
import NewAdWindow from '../components/NewAdWindow.vue';
import Pl_logo from '../assets/pl_logo.svg';       // Для светлой темы
import Pl_logo_dark from '../assets/pl_logo_dark.svg'; // Для тёмной темы
import '../style.css'; // Глобальные стили

const { initDataRaw } = retrieveLaunchParams();


const initData = ref(null);
const userDaraRow = ref(null);


onMounted(() => {
  const params = retrieveLaunchParams();
  initData.value = params.initData;
  userDaraRow.value = initDataRaw;
  
});

const userName = computed(() => {
  return userDaraRow.value?.user?.first_name || initData.value?.user?.username || 'Unknown';
});

const currentTheme = ref(localStorage.getItem('theme') || 'dark');
const logoSrc = computed(() => {
  return currentTheme.value === 'light' ? Pl_logo_dark : Pl_logo;
});


const currentPage = ref('home');


onMounted(() => {
  if (miniApp.theme) {
    currentTheme.value = miniApp.theme === 'light' ? 'light' : 'dark';
  }
});
</script>

<style scoped>
.body {
  padding: 50px; /* Исправлено: pad -> padding */
  display: flex;
  flex-direction: column;
  height: 90vh;
}

.views {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
