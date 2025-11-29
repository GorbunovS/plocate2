<script setup>

import './style.css'
import { computed, onMounted } from 'vue';
import { useTgStore } from './store';
import { useUserStore } from './store';
import { useRouter, useRoute } from 'vue-router';
import { useViewport } from 'vue-tg'
import { ClosingConfirmation } from 'vue-tg'
import ProgressBar from 'primevue/progressbar';
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
  viewPort.expand();
  if (viewPort.requestFullscreen) {
    viewPort.requestFullscreen();
  }
});

</script>

<template>
  <div>
    <ClosingConfirmation />

    <router-view>

    </router-view>


    <div v-if="route.name !== 'newAd'"
      class="flex flex-col fixed bottom-0 w-full pb-4 left-0 right-0 z-20 backdrop-blur bg-surface-card dark:bg-surface-700 border-t border-gray-200 dark:border-gray-600 flex justify-between items-center  ">
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
.leaflet-bottom {
  visibility: hidden;
}
</style>
