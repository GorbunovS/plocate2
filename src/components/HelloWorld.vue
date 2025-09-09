<template> 
      <img src="./assets/pl_logo.svg" class="logo vue" alt="Vue logo" />
  

  <button  @click="goPopApp"> Start </button>
</template>
<script setup lang="ts">

import { useRouter } from 'vue-router';

const router = useRouter();

const goPopApp = () => {
  router.push('/popup');
}
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>