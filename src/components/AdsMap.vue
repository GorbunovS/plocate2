<template>
  <div class="relative w-full h-full">    
    <LMap 
      :zoom="13" 
      :center="[55.751244, 37.618423]" 
      @moveend="(e) => emit('center-changed', e.target.getCenter())"
      :attribution-control="false"
      class="w-full h-full"
    >
      <LTileLayer :url="tileUrl" :attribution="''" />
    </LMap>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';
// import Marker from '../assets/marker.svg';
import { LMap, LTileLayer } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';

const emit = defineEmits(['center-changed']);

const props = defineProps({
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
});

const tileUrl = 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA';
</script>

<style scoped>
.leaflet-control-attribution {
  display: none !important;
}
</style>

