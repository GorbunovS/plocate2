<template>
  <div class="relative h-full w-full">
    <FloatLabel class="absolute z-100 scale-70" variant="in">
      <AutoComplete v-model="status" 
      :suggestions="filteredAddresses" 
      @complete="userStore.searchAddresses($event)" 
      @select="onAddressSelect()"
      optionLabel="name"
        class="w-full" />
      <label for="username">Поиск</label>
    </FloatLabel>
  <div class="relative h-8/10 w-full">

    <img 
      :src="Marker" 
      class="absolute z-1000 scale-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" 
    />

    <LMap 
      @moveend="onMoveEnd" 
      :attributionControl="false" 
      :zoom="zoom" 
      :center="currentCenter" 
      style="height: 100%; width: 100%;"
    >
      <LTileLayer :url="url" :attribution="attribution" />
    </LMap>
  </div>
      <Button 
      @click="closeMap" 
      icon="pi pi-save"
      label="Сохранить" 
      severity="success" 
      variant="outlined" 
      class="absolute mt-2 left-4 right-4" 
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue'
import { Chip } from 'primevue';
import Button from 'primevue/button'; // Добавьте импорт Button
import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
import { storeToRefs } from 'pinia'
import { useUserStore } from '../store';

const userStore = useUserStore();
const {selectedCoordinates} = storeToRefs(userStore)
const { filteredAddresses } = storeToRefs(userStore)
const status = ref({});
const emit = defineEmits(['update:center', 'center-changed']);

const markerCoord = ref('') // Инициализируйте строкой

const onAddressSelect = (event) =>{
  // event — выбранный объект { name, data }
  userStore.setCoordinates(event)


}

watch(
  selectedCoordinates,
  (coords) => {
    if (coords.lat !== null && coords.lon !== null) {
      currentCenter.value = [coords.lat, coords.lon]
      emit('update:center', currentCenter.value)
      emit('center-changed', currentCenter.value)
      markerCoord.value = `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`
      console.log("Сработал Wath"+markerCoord.value)
    }
  },
  { immediate: true }
)

const onMoveEnd = (e) => {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];
  markerCoord.value = `${newCenter[0].toFixed(3)}, ${newCenter[1].toFixed(3)}`; 
  emit('update:center', newCenter);
  emit('center-changed', newCenter);
  console.log("Сработал onMoveEnd")

}

// Добавьте функцию closeMap
const closeMap = () => {
  // Ваша логика закрытия карты
  console.log('Карта закрыта');
}

const props = defineProps({
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
})

const currentCenter = ref([...props.userLocation])

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
