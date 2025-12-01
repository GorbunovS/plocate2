<script setup>
import './style.css'
import { computed, onMounted } from 'vue';
import { useTgStore, useUserStore } from './store'; // Объединил импорты для чистоты
import { useRouter, useRoute } from 'vue-router';
import { useViewport, ClosingConfirmation } from 'vue-tg'
import ProgressBar from 'primevue/progressbar';

// ... (остальной ваш код без изменений) ...

const route = useRoute();
const currentPage = computed(() => route.name);
const router = useRouter();
const handleNavigation = (page) => {
  router.push(page);
}

const userStore = useUserStore();
const tgStore = useTgStore();
const viewPort = useViewport()
const currentUserId = computed(() => tgStore.userId)

onMounted(() => {
  userStore.getUserAds(currentUserId.value);
  tgStore.initializeAuth();
  
  // Проверка на null перед вызовом, хорошая практика для Mini Apps
  if (viewPort) {
    viewPort.expand();
    if (viewPort.requestFullscreen) {
      viewPort.requestFullscreen();
    }
  }
});
</script>

<template>
  <!-- 
    Добавляем классы:
    1. min-h-screen: чтобы фон был минимум на всю высоту экрана
    2. app-background: наш кастомный класс для картинки
  -->
  <div class="min-h-screen  app-background">
    <ClosingConfirmation />

    <router-view></router-view>

    <div v-if="route.name !== 'newAd'"
      class="flex flex-col fixed bottom-0 w-full pb-4 left-0 right-0 z-20 backdrop-blur bg-surface-card/80 dark:bg-surface-700/80 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center">
      
      <ProgressBar v-if="userStore.loading" class="w-full" mode="indeterminate" style="height: 6px"></ProgressBar>
      
      <ButtonGroup class="w-full flex justify-between px-6 py-2">
        <Button icon="pi pi-home" :severity="currentPage === 'home' ? 'success' : 'secondary'" text size="large"
          @click="handleNavigation('/')" />
        <Button icon="pi pi-plus" severity="secondary" text size="large" @click="handleNavigation('newAd')" />
        <Button icon="pi pi-globe" :severity="currentPage === 'descover' ? 'success' : 'secondary'" text size="large"
          @click="handleNavigation('descover')" />
      </ButtonGroup>

    </div>
  </div>
</template>

<style>
/* Ваши старые стили */
.leaflet-bottom {
  visibility: hidden;
}

/* Новый стиль для фона */
.app-background {
  /* Укажите правильный путь к файлу. Если он в src/assets: */
  background-image: url('./assets/pattern.png');
  background-repeat: repeat;
  background-attachment: fixed; 
  background-size: 700px 700px;
}
</style>
