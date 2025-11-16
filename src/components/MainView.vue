<template>
      <div class="header flex h-20 z-10 items-center justify-center">
        <span class="">PetLocate</span>
    </div>
  <div class="body gap-5 flex flex-col min-h-screen text-gray-900 dark:text-gray-100">
    <div v-if="currentPage === 'newAd'">
      <NewAdWindow
      @back="currentPage = 'home'"
      />
    </div>
    <div v-if="currentPage === 'home'" class="views flex flex flex-col items-center  justify-center text-center p-4 gap-4">
      <img v-if="ads.length < 1 " :src="Jook" alt="jook" class="w-32 h-32 object-contain" />
      <span  class="text-lg font-semibold"> Мои объявления</span>
       <div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" v-if="ads">
       <PetCard v-for="ad in ads" :key="ad.id" :ad="ad" @stop-search="userStore.deleteThisAd(ad.id)"/>
      </div>

      <p  v-if="ads.length < 1 " class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
      <p v-if="ads.length < 1 " class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
         <div class="actions p-4 flex  flex-col gap-2 sm:gap-4 w-full justify-center ">

      <Button label="Создать объявление" severity="success" variant="outlined" @click="currentPage = 'newAd'" class=" sm:w-auto" />

    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '../assets/pl_logo.svg';
import Pl_logo_dark from '../assets/pl_logo_dark.svg';
import Jook from '/src/assets/jook.png';
import '../style.css';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';



const userStore = useUserStore();
const { ads } = storeToRefs(userStore);


const currentPage = ref('home')
const currentTheme = ref(localStorage.getItem('theme') || 'dark');


const logoSrc = computed(() => {
  return currentTheme.value === 'light' ? Pl_logo_dark : Pl_logo;
});
</script>


<style scoped>




</style>
