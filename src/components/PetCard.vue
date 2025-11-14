<template>
  <div class="border border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-gray-900 dark:text-white flex flex-col shadow-lg hover:shadow-xl transition-all duration-300 h-full">
    <div class="flex gap-6 items-start mb-auto">

      <div class="relative flex-shrink-0">
        <div class="w-32 h-32 bg-gray-300 dark:bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center flex-shrink-0">
          <img 
            v-if="ad?.images?.[0]"
            :src="ad.images[0]" 
            alt="announcement image" 
            class="w-full h-full object-cover"
          />
          <span v-else class="text-5xl">🐾</span>
        </div>

        <div v-if="ad?.type === 'lost'" class="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          ПОТЕРЯНА
        </div>
        <div v-else class="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
          НАЙДЕНА
        </div>
      </div>

      <!-- Информация справа -->
      <div class="flex-1 flex flex-col gap-3">
        <!-- Тип животного и имя -->
        <div>
          <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {{ getAnimalTypeLabel(ad?.animal_type) }}
          </p>
        </div>

        <!-- Время поиска -->
        <div class="bg-gray-100 dark:bg-gray-800 rounded-lg p-3">
          <p class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Поиск ведётся:</p>
          <p class="text-2xl font-bold text-gray-900 dark:text-white">
            {{ getSearchDuration(ad?.created_at) }}
          </p>
        </div>

        <!-- Адрес -->
        <div class="flex items-start gap-2 text-sm">
          <span class="text-gray-500 dark:text-gray-400 flex-shrink-0 mt-0.5">📍</span>
          <span class="text-gray-700 dark:text-gray-300">{{ ad?.address }}</span>
        </div>


      </div>
    </div>

    <!-- Кнопки внизу -->
    <div class="flex gap-3 mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
      <Button 
        label="Похожие" 
        class="flex-1"
        :class="[
          'font-semibold py-2.5 px-4 rounded-lg transition-all duration-200',
          'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
        ]"
        @click="viewSimilar"
      />
      <Button 
        label="Прекратить" 
        class="flex-1"
        :class="[
          'font-semibold py-2.5 px-4 rounded-lg transition-all duration-200',
          'bg-gray-400 hover:bg-gray-500 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white'
        ]"
        @click="stopSearch"
        severity="secondary"
      />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Button  from 'primevue/button'

const props = defineProps({
  ad: {
    type: Object,
    required: true,
    validator: (value) => value && value.id !== undefined
  }
})

const emit = defineEmits(['view-similar', 'stop-search'])

const getAnimalTypeLabel = (type) => {
  const labels = {
    dog: 'Собака',
    cat: 'Кот',
    rabbit: 'Кролик',
    bird: 'Птица',
    other: 'Другое'
  }
  return labels[type] || type
}

const getSearchDuration = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    return `${days}д ${hours % 24}ч`
  }
  return `${hours}ч`
}

const viewSimilar = () => {
  emit('view-similar', props.ad.id)
}

const stopSearch = () => {
  emit('stop-search', props.ad.id)
}
</script>

<style scoped>
:deep(.p-button) {
  border: none;
}

:deep(.p-button:focus) {
  box-shadow: none;
}
</style>
