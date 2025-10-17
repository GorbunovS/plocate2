<template>
  <div class="flex flex-col gap-2 h-full w-full ">
{{ props.mapCenter }}
      <Chip 
        :label="currentAddress" 
        class="absolute top-2 text-xs z-1000 left-1/2 -translate-x-1/2 " 
        icon="pi pi-map-marker" 
      />
      <img 
        :src="Marker" 
        class="absolute z-1100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-none" 
      />
      <LMap 
        :zoom="zoom" 
        :center="mapCenter" 
        @moveend="handleMapMove"
        :attribution-control="false"
        style="height: 65vh; width: 100%;"
        
      >
        <LTileLayer :url="tileUrl" />
      </LMap>

    <Button 
      @click="handleSave" 
      icon="pi pi-save"
      label="Сохранить" 
      severity="success" 
      variant="outlined" 

    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import Button from 'primevue/button';
import Chip from 'primevue/chip';
import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../store';

const userStore = useUserStore();
const { selectedAddress } = storeToRefs(userStore);

const emit = defineEmits(['center-changed','close-dialog']);

const props = defineProps({
  userLocation: {
    type: Array
  }
});

const mapCenter = ref([...props.userLocation]);
const zoom = ref(13);
const tileUrl = 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA';

const currentAddress = computed(() => selectedAddress.value || 'Загрузка...');

const handleMapMove = async (event) => {
  const map = event.target;
  const center = map.getCenter();
  mapCenter.value = [center.lat, center.lng];
  
  await userStore.addressByCoordinates({ 
    lat: center.lat, 
    lon: center.lng 
  });
};

const handleSave = () => {
  userStore.saveUserLocation({
    coordinates: mapCenter.value,
    address: selectedAddress.value
  });
  
  emit('center-changed', mapCenter.value);
  emit('close-dialog');
};

watch(() => props.userLocation, (newLocation) => {
  if (newLocation && newLocation.length === 2) {
    mapCenter.value = [...newLocation];
  }
}, { deep: true });
</script>

<style scoped>
.leaflet-control-attribution {
  display: none;
}
</style>
