<script setup >

import './style.css'
import { onMounted } from 'vue';
import { useTgStore } from './store';

const tgStore = useTgStore();

onMounted(() => {
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


