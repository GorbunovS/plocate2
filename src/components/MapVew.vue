<template>
  <div class="relative h-full w-full">
    <!-- Чип вверху по центру -->
    <Chip 
      :label="markerCoord" 
      class="absolute z-1100 top-4 left-1/2 -translate-x-1/2" 
    />

    <!-- Изображение маркера в центре -->
    <img 
      :src="Marker" 
      class="absolute z-1000 scale-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
    />

    <!-- Кнопка снизу поверх карты -->
    <Button 
      @click="closeMap" 
      icon="pi pi-map" 
      label="Сохранить" 
      severity="success" 
      variant="outlined" 
      class="absolute z-1000 bottom-4 left-4 right-4" 
    />

    <!-- Карта Leaflet -->
    <LMap 
      @moveend="onMoveEnd" 
      :attributionControl="false" 
      :zoom="zoom" 
      :center="center" 
      style="height: 100%; width: 100%;"
    >
      <LTileLayer :url="url" :attribution="attribution" />
    </LMap>
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps } from 'vue'
import { Chip } from 'primevue';
import Button from 'primevue/button'; // Добавьте импорт Button
import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['update:center', 'center-changed']);

const markerCoord = ref('55.751, 37.618') // Инициализируйте строкой

const onMoveEnd = (e) => {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];
  markerCoord.value = `${newCenter[0].toFixed(3)}, ${newCenter[1].toFixed(3)}`; // Исправлено
  emit('update:center', newCenter);
  emit('center-changed', newCenter);
}

// Добавьте функцию closeMap
const closeMap = () => {
  // Ваша логика закрытия карты
  console.log('Карта закрыта');
}

const props = defineProps({
  userPetMarker: {
    type: Array
  },
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
})

const zoom = ref(13)
const center = ref([55.751244, 37.618423])

const url = ref('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA')
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')

const markers = ref([])
</script>

<style scoped>
.leaflet-control-attribution {
  visibility: hidden;
  display: none;
}
</style>
