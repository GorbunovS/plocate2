<template>
  <div class="app">
  <div class="header">
    <div class="logo">
      <img :src="Pl_logo" alt="logo">

    </div>
  </div>
  <div class="views"></div>
Добро пожаловать в PetLocate

Мы поможем найти вашего питомца или возможного хозяина 
  <div class="actions">
    <Button label="Создать объявление" severity="success" variant="outlined" />
    <Button label="Карта(скоро)" severity="secondary" variant="outlined" />
  </div>
  </div>

</template>
<script setup lang="ts">
import Pl_logo from '/src/assets/pl_logo.svg';



</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
}
.views {
  flex:1;
}

.actions {
  flex: 1;
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px;
}
</style>