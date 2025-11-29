<template>
      <div class="header flex h-25 z-10 items-center justify-center">
        
    </div>
<div class="body flex flex-col gap-5 overflow-hidden pb-24">

    <Avatar
     :image="tgStore.userAvatar || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'"
     size="normal" shape="circle" />

     {{ tgStore.userName }}
      <div class="grid w-full  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" v-if="ads">
      <PostWidget v-for="ad in ads" :key="ad.id"
        :url="'PetLocateAds/'+ad.telegram_message_id"
        :width="50"
        dark="true"
        color="FFFFFF"
      />
</div>
    
    <div v-if="currentPage === 'newAd'">
      <NewAdWindow
      @back="currentPage = 'home'"
      />
    </div>
 <div v-if="currentPage === 'home'" class="flex flex-col items-center justify-start text-center p-4 gap-4 h-full">
          <div v-if="ads.length === 0" class="flex flex-col items-center justify-center text-center p-4 gap-4 h-full">
         <img :src="Jook" alt="jook" class="w-32 h-32 object-contain" />
      <p  class="text-lg font-semibold">Добро пожаловать в PetLocate</p>
      <p  class="text-sm text-gray-600 dark:text-gray-400">Мы поможем найти вашего питомца или возможного хозяина</p>
         <div class="actions p-4 flex  flex-col gap-2 sm:gap-4 w-full justify-center ">

      <Button icon="pi pi-plus" label="Добавить объявление"  severity="success" variant="outlined" @click="router.push('/newAd')" class=" sm:w-auto" />

    </div>
    </div>
      <div v-else class="flex space-x-4 flex-row w-full justify-between items-center">
        
      <span  class="text-lg font-semibold"> Мои объявления</span>
      <Button icon="pi pi-plus" size="small" severity="success" rounded @click="router.push('/newAd')"/>
      </div>
      
      <div class="w-full h-[60vh] overflow-y-auto">
       <div class="grid w-full  grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" v-if="ads">
       <PetCard v-for="ad in ads" :key="ad.id" :ad="ad" @stop-search="userStore.deleteThisAd(ad.id)"/>
      </div>
      </div>
    </div>  
    
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { PostWidget } from 'vue-tg';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '../assets/pl_logo.svg';
import Pl_logo_dark from '../assets/pl_logo_dark.svg';
import Jook from '/src/assets/jook.png';



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


<style scoped>




</style>
