<script setup >

import './style.css'
import { onMounted } from 'vue';
import { useTgStore } from './store';
import { useUserStore } from './store';

const userStore = useUserStore();
const tgStore = useTgStore();

onMounted(() => {
  userStore.getUserAds();
  tgStore.initializeAuth();
});

</script>

<template>
  <div>
    <router-view></router-view>
  </div>

  
</template>

<style>
.leaflet-bottom{
  visibility: hidden;
}


</style>


