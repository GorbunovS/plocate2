<template>
  <div class="flex flex-col h-full w-full relative">
    <FloatLabel class="absolute z-10 top-2 left-4 right-4 scale-75" variant="in">
      <AutoComplete 
        v-model="status" 
        :suggestions="filteredAddresses" 
        @complete="userStore.searchAddresses($event)" 
        @item-select="userStore.addressByCoordinates(selectedAddress)"
        optionLabel="name"
        class="w-full" 
      />
      <Button @click="userStore.addressByCoordinates(selectedAddress)" icon="pi pi-search" severity="success" variant="outlined" />
      <label>Поиск</label>
    </FloatLabel>
    <div class="flex-1 relative w-full mt-12">
      <Chip 
        :label="chipLabel" 
        class="absolute z-10 top-2 left-1/2 -translate-x-1/2 bg-white shadow-md" 
        icon="pi pi-map-marker" 
      />
      <img 
        :src="Marker" 
        class="absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-none" 
      />
      <LMap 
        :zoom="zoom" 
        :center="currentCenter" 
        @moveend="onMoveEnd"
        :attribution-control="false"
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
      class="mt-2 self-center w-32" 
    />
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, defineProps, watch } from 'vue';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import FloatLabel from 'primevue/floatlabel';
import AutoComplete from 'primevue/autocomplete';
import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store';

const userStore = useUserStore();
const { selectedCoordinates, filteredAddresses, selectedAddress } = storeToRefs(userStore);
const status = ref(null);
const emit = defineEmits(['save-location', 'update:center', 'center-changed']);

const props = defineProps({
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
});

const currentCenter = ref([...props.userLocation]);
const zoom = ref(13);
const url = ref('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA');


const chipLabel = computed(() => status.value?.name || selectedAddress.value || 'Неизвестно');

const onAddressSelect = async (selectedItem) => {
  if (!selectedItem) return;
  console.log("Выбран айтем"+selectedItem);
  const fullAddress = selectedItem.name;
  const coords = await userStore.getCoordinatesByAddress(fullAddress);
  if (coords) {
    currentCenter.value = [coords.lat, coords.lon];
    emit('update:center', currentCenter.value);
    emit('center-changed', currentCenter.value);
  }
};

const onMoveEnd = async (e) => {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];
  currentCenter.value = newCenter;
  await userStore.addressByCoordinates({ lat: newCenter[0], lon: newCenter[1] });
  emit('update:center', newCenter);
  emit('center-changed', newCenter);
};

const saveLocation = () => {
  emit('save-location', { center: currentCenter.value });
};

watch(selectedCoordinates, (coords) => {
  if (coords?.lat !== null && coords?.lon !== null) {
    currentCenter.value = [coords.lat, coords.lon];
    emit('update:center', currentCenter.value);
    emit('center-changed', currentCenter.value);
  }
}, { immediate: true, deep: true });
</script>

<style scoped>
.leaflet-control-attribution {
  display: none;
}
</style>