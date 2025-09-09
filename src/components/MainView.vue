<template> 
<div class="header">
  <div class="logo">
    <img :src="Pl_logo" alt="logo">

  </div>
</div>

  <div class="body">

    <Button label="Success" severity="success" variant="outlined" />
  </div>

</template>
<script setup lang="ts">


import Pl_logo from '/src/assets/pl_logo.svg';





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