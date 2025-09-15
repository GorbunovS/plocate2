<template>
  <LMap  
    :attributionControl="false" 
    :zoom="zoom" 
    :center="center" 
    style="height: 100%; width: 100%"
    @click="handleMapClick"
  >
    <LTileLayer :url="url" :attribution="attribution" />
    
    <!-- Исходный маркер пользователя -->
    <LMarker :lat-lng="userLocation" :icon="icon"></LMarker>
    
    <!-- Маркер от клика (показывается только если есть координаты) -->
    <LMarker 
      v-if="clickedLocation" 
      :lat-lng="clickedLocation"
      @click="removeClickedMarker"
    ></LMarker>
  </LMap>
</template>

<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'

// Реактивные переменные
const zoom = ref(13)
const center = ref([47.413220, -1.219482])
const url = ref('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
const attribution = ref('© OpenStreetMap contributors')
const userLocation = ref([47.413220, -1.219482])
const icon = ref(null) // ваша иконка

// Координаты кликнутой точки (null = маркера нет)
const clickedLocation = ref(null)

// Обработчик клика по карте
const handleMapClick = (event) => {
  const lat = event.latlng.lat
  const lng = event.latlng.lng
  
  console.log(`Координаты клика: Широта ${lat}, Долгота ${lng}`)
  
  // Устанавливаем координаты для маркера (заменяет предыдущий)
  clickedLocation.value = [lat, lng]
}

// Функция для удаления кликнутого маркера
const removeClickedMarker = () => {
  clickedLocation.value = null
}
</script>
