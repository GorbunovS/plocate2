<template>
  <div class="flex flex-col items-center justify-center h-screen gap-6">
    <div class="relative w-full max-w-md flex items-center justify-center">
      <img :src="ram" alt="Success Frame" class="w-full object-contain" />
      <div class="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
        <p class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Объявление отправлено на модерацию!
        </p>
        <p class="text-sm text-gray-600 dark:text-gray-300 leading-tight">
          Как только мы проверим ваше объявление, оно появится в списке
        </p>
      </div>
      
    </div>

    <!-- Кнопку лучше оставить под рамкой, чтобы она была кликабельной и заметной -->
    <Button @click="router.push('/')" label="На главную" severity="success" variant="outlined" class="w-40" />
    
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ram from '/src/assets/ram.svg';

const router = useRouter();
</script>
