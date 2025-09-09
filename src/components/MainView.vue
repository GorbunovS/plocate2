<template>
  <div class="body">
    <div class="header">
      <div class="logo">
        <img :src="Pl_logo" alt="logo">
      </div>
    </div>
    <div class="views">
      Добро пожаловать в PetLocate<br>
      Мы поможем найти вашего питомца или возможного хозяина
    </div>
    <div class="actions">
      <Button label="Создать объявление" severity="success" variant="outlined" />
      <Button label="Карта(скоро)" severity="secondary" variant="outlined" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Pl_logo from '/src/assets/pl_logo.svg';
import '../style.css';
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  height: 100vh; /* Занимает всю высоту окна (или убери, если это в глобальных стилях) */
}

.views {
  flex: 1; /* Занимает всё свободное пространство */
  display: flex;
  align-items: center; /* Центрирует содержимое по вертикали */
  justify-content: center; /* Центрирует содержимое по горизонтали */
  text-align: center; /* Центрирует текст внутри, если нужно */
}

.actions {
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
  height: 100px; /* Фиксированная высота */
}
</style>
