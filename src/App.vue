<script setup >

import './style.css'
import { computed, onMounted } from 'vue';
import { useTgStore } from './store';
import { useUserStore } from './store';

const userStore = useUserStore();
const tgStore = useTgStore();

  
const currentUserId = computed (()=>tgStore.userId )

onMounted(() => {
  userStore.getUserAds(currentUserId.value);
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


