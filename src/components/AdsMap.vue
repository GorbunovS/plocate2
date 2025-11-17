<template>
          <img 
        :src="Marker" 
        class="absolute z-1100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-none" 
      />
  <div >
    <l-map ref="map" v-model:zoom="zoom" :center="props.ourLocation">
      <l-tile-layer
        url="https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA"
        layer-type="base"
        name="OpenStreetMap"
      ></l-tile-layer>
    </l-map>
  </div>
</template>

<script setup>
import "leaflet/dist/leaflet.css"
import { ref } from "vue"
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet"
import {defineProps} from 'vue'

const props = defineProps({
    ourLocation: {
        type: Array,
        default: () => [[47.41322, -1.219482]]
    }
})

const zoom = ref(13)
const map = ref(null)
</script>
<style scoped>
.leaflet-control-attribution {
  display: none;
}
</style>
