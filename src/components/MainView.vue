<template>
  <div class="body">
    <div class="header">
      <div class="logo">
        <img :src="logoSrc" alt="logo">  <!-- Динамический :src -->
      </div>
    </div>
    <div  v-if="currentPage==='newAd'" class="newAdWindow">
    
    <NewAdWindow />
    </div>
    <div class="views" v-if="currentPage === 'home'">
      Добро пожаловать в PetLocate<br>
      Мы поможем найти вашего питомца или возможного хозяина
    </div>
    
    <div class="actions" >
      <Button v-if="currentPage === 'home'" label="Создать объявление" severity="success" variant="outlined" @click="currentPage='newAd'" />
      <Button v-if="currentPage === 'home'"label="Карта(скоро)" severity="secondary" variant="outlined" />
      <Button v-if="currentPage !== 'home'" label="Назад" severity="success" @click="currentPage='home'"  variant="outlined" />

    </div>
  </div>
</template>

<script setup >
import { ref, computed } from 'vue';
import NewAdWindow from '../components/NewAdWindow.vue'
import Pl_logo from '/src/assets/pl_logo.svg';       // Для светлой темы
import Pl_logo_dark from '/src/assets/pl_logo_dark.svg'; // Для тёмной темы
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
  align-items: center;
  justify-content: center;
  text-align: center;
}

.actions  {
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px;
}

.newAdWindow {
  flex: 1;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px;
}
</style>
