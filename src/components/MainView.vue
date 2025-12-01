<template>
  <div class="header mb-4 flex items-center justify-center pt-4">
  </div>


  <div class="body h-[70vh] flex flex-col gap-5 pb-32 px-4"> 
    
    <div v-if="currentPage === 'newAd'">
      <NewAdWindow @back="currentPage = 'home'" />
    </div>

    <div v-if="currentPage === 'home'" class="flex flex-col items-center justify-start text-center gap-4">
      <img :src="pl_logo" alt="jook" class="w-40 object-contain" />

      <div v-if="ads.length === 0" class="flex flex-col items-center justify-center text-center gap-4">
        <p class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
        <p class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
        <div class="actions flex flex-col gap-2 sm:gap-4 w-full justify-center">
          <Button icon="pi pi-plus" label="Добавить объявление" severity="success" variant="outlined"
            @click="router.push('/newAd')" class="sm:w-auto" />
        </div>
      </div>

      <div v-else class="flex flex-col w-full gap-4">
        <div class="flex flex-row w-full justify-between items-center px-1">
          <span class="text-lg font-semibold">Мои объявления</span>
          <Button icon="pi pi-plus" size="small" severity="success" rounded @click="router.push('/newAd')" />
        </div>
        
        <div class="w-full h-[50vh] overflow-y-auto mb-4">
          <!-- Grid просто заполняет пространство -->
          <div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" v-if="ads">
            <PetCard v-for="ad in ads" :key="ad.id" :ad="ad" @stop-search="userStore.deleteThisAd(ad.id)" />
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '../assets/pl_logo.svg';
import Pl_logo_dark from '../assets/pl_logo_dark.svg';
import pl_logo from '/src/assets/pl_logo.png';

import '../style.css';
import { useUserStore } from '../store';
import { useTgStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';
import router from '../router';

const tgStore = useTgStore()
const userStore = useUserStore();
const { ads } = storeToRefs(userStore);

const currentPage = ref('home')
const currentTheme = ref(localStorage.getItem('theme') || 'dark');

const logoSrc = computed(() => {
  return currentTheme.value === 'light' ? Pl_logo_dark : Pl_logo;
});
</script>

<style scoped></style>
