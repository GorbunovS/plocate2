<template>
      <div class="header p-4 flex h-20 z-10 mt-10 items-center justify-center">
        <span class="">PetLocate</span>
    </div>
  <div class="body gap-5 flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
    <div v-if="currentPage === 'newAd'">
      <NewAdWindow
      @back="currentPage = 'home'"
      />
    </div>
    
    <div v-if="currentPage === 'home'" class="views flex flex flex-col items-center justify-center text-center p-4 gap-4">
      <img :src="Jook" alt="jook" class="w-32 h-32 object-contain" />
      <p class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
      <p class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
         <div class="actions p-4 flex flex-col gap-2 sm:gap-4 w-full justify-center mt-15">
      <Button label="Создать объявление" severity="success" variant="outlined" @click="currentPage = 'newAd'" class=" sm:w-auto" />
      <Button  label="Карта(скоро)" severity="secondary" variant="outlined" class="w-full sm:w-auto" />
    </div>
    </div>
  </div>
</template>
<script setup >
import { ref, computed , onMounted} from 'vue';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '../assets/pl_logo.svg';       // Для светлой темы
import Pl_logo_dark from '../assets/pl_logo_dark.svg'; // Для тёмной темы
import Jook from '/src/assets/jook.png';
import '../style.css';

 const currentPage = ref('home')
const currentTheme = ref(localStorage.getItem('theme') || 'dark');

import { retrieveLaunchParams } from '@telegram-apps/sdk';


const initData = ref(null);
const initDataRaw = ref(null);

onMounted(() => {
  const params = retrieveLaunchParams();
  initData.value = params.initData;
  initDataRaw.value = params.initDataRaw;
});

const userName = computed(() => {
  return initData.value?.user?.first_name 
    || initData.value?.user?.username 
    || 'Unknown';
});

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


</style>
