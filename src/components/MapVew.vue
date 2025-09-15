<template>
  <LMap  :attributionControl="false" :zoom="zoom" :center="center" style="height: 100%; width: 100%">
    <LTileLayer :url="url" :attribution="attribution" />
  </LMap>


</template>

<script setup>
import { ref,defineEmits, defineProps  } from 'vue'
import { LMap, LTileLayer,  } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'

import 'leaflet/dist/leaflet.css'

const emit = defineEmits(['update:center', 'center-changed']);

const onMoveEnd= (e) => {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];
  emit('update:center', newCenter);
  emit('center-changed', newCenter);
  
}

// props
const props = defineProps({
  userPetMarker: {
    type: Array
  },
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423]
  }
})



// реактивные состояния карты
const zoom = ref(13)
const center = ref([55.751244, 37.618423])

// тайлы
const url = ref('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA')
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors')

// маркеры и элементы
const markers = ref([])


</script>
<style scoped>
.leaflet-control-attribution leaflet-control {
visibility: hidden;
display: none;
}
</style>