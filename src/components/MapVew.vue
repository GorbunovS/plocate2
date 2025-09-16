<template>
  <div class="relative h-full w-full">
    <FloatLabel class="absolute z-100 scale-70" variant="in">
      <AutoComplete v-model="status" 
        :suggestions="filteredAddresses" 
        @complete="userStore.searchAddresses($event)" 
        @select="getCoordinatesByAddress(status.name)"
        optionLabel="name"
        class="w-full" />
      <label for="username">Поиск</label>
    </FloatLabel>
    <div class="relative h-8/10 w-full">
      <Chip icon="pi pi-map-marker" :label="status.name" class="absolute z-1000 top-2 left-1/2 -translate-x-1/2 bg-white shadow-md" />
{{ selectedCoordinates }}
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
      @click="saveLocation" 
      icon="pi pi-save"
      label="Сохранить" 
      severity="success" 
      variant="outlined" 
      class="absolute mt-2 left-4 right-4" 
    />
  </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, watch } from 'vue';
import Button from 'primevue/button';
import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store';

const userStore = useUserStore();
const { selectedCoordinates, filteredAddresses } = storeToRefs(userStore);
const status = ref('');
const emit = defineEmits(['save-location', 'update:center', 'center-changed']);

const props = defineProps({
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
});

const markerCoord = ref('');
const currentCenter = ref([...props.userLocation]);
const zoom = ref(13);
const url = ref('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA');
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');

const onAddressSelect = async (event) => {
  const fullAddress = event.name; // Полный адрес из выбора
  const coords = await userStore.getCoordinatesByAddress(fullAddress);
  if (coords) {
    currentCenter.value = [coords.lat, coords.lon];
    markerCoord.value = `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`;
    emit('update:center', currentCenter.value);
    emit('center-changed', currentCenter.value);
  }
};

const onMoveEnd = async (e) => {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];
  currentCenter.value = newCenter;
  markerCoord.value = `${newCenter[0].toFixed(3)}, ${newCenter[1].toFixed(3)}`;
  await userStore.addressByCoordinates({ lat: newCenter[0], lon: newCenter[1] }); /
  emit('update:center', newCenter);
  emit('center-changed', newCenter);
};

const saveLocation = () => {
  emit('save-location', { center: currentCenter});
  console.log('Сохранено:', { center: currentCenter });
};

watch(
  selectedCoordinates,
  (coords) => {
    if (coords.lat !== null && coords.lon !== null) {
      currentCenter.value = [coords.lat, coords.lon];
      markerCoord.value = `${coords.lat.toFixed(5)}, ${coords.lon.toFixed(5)}`;
      emit('update:center', currentCenter.value);
      emit('center-changed', currentCenter.value);
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.leaflet-control-attribution {
  visibility: hidden;
  display: none;
}
</style>