<template>
  <div class="relative w-full h-full min-h-[300px]">
    <img 
      :src="Marker" 
      class="absolute z-[1100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-none" 
    />
    <l-map ref="map" :zoom="zoom" :center="center" style="height:100%; width:100%;">
      <l-tile-layer
       url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA"
        layer-type="base"
        name="OpenStreetMap"
      />
    </l-map>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css"
import { ref, watch } from "vue"
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import { defineProps } from 'vue'

const props = defineProps({
  center: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
})



const map = ref(null)
const zoom = ref(13)

// Если центр обновился — обновить карту
watch(() => props.center, (val) => {
  if (map.value) {
    
  }
})
</script>

<style scoped>
.leaflet-control-attribution { display: none; }
</style>
