<template>
  <div class="body m-4 flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
    <div class="header p-4 flex h-50  justify-center">
      <div class="logo">
        <img :src="logoSrc" alt="logo" class="h-12 w-auto" />
      </div>
    </div>
    
    <div v-if="currentPage === 'newAd'" class="newAdWindow flex flex-col items-center justify-center text-center p-4 gap-4">
      <NewAdWindow />
    </div>
    
    <div v-if="currentPage === 'home'" class="views flex flex-col items-center justify-center text-center p-4 gap-4">
      <img :src="Jook" alt="jook" class="w-32 h-32 object-contain" />
      <p class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
    </div>
    
    <div class="actions p-4 flex flex-1 flex-col gap-2 sm:flex-row sm:gap-4 justify-center mb-4 ">
      <Button v-if="currentPage === 'home'" label="Создать объявление" severity="success" variant="outlined" @click="currentPage = 'newAd'" class="w-full sm:w-auto" />
      <Button v-if="currentPage === 'newAd'" label="Далее" severity="success" variant="outlined" @click="currentPage = 'newAd'" class="w-full sm:w-auto" />
      <Button v-if="currentPage === 'home'" label="Карта(скоро)" severity="secondary" variant="outlined" class="w-full sm:w-auto" />
      <Button v-if="currentPage !== 'home'" label="Назад" severity="success" variant="outlined" @click="currentPage = 'home'" class="w-full sm:w-auto" />
    </div>
  </div>
</template>
<script setup >
import { ref, computed } from 'vue';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '/src/assets/pl_logo.svg';       // Для светлой темы
import Pl_logo_dark from '/src/assets/pl_logo_dark.svg'; // Для тёмной темы
import Jook from '/src/assets/jook.png';
import '../style.css';

 const currentPage = ref('home')
const currentTheme = ref(localStorage.getItem('theme') || 'dark');


const logoSrc = computed(() => {
  return currentTheme.value === 'light' ? Pl_logo_dark : Pl_logo;
});


</script>

<style scoped>
/* Твои стили из предыдущих сообщений */
.body {
  pad: 50px;
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



.newAdWindow {
  flex: 1;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px;
}
</style>
