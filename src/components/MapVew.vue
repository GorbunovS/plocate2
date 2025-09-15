<template>
  <LMap  :attributionControl="false" :zoom="zoom" :center="userLocation" style="height: 100%; width: 100%">
    <LTileLayer :url="url" :attribution="attribution" />
    <LMarker
      :key="m.id"
      :lat-lng="m.position"
    />
  </LMap>

  <!-- Пример списка, который выбирает элемент и двигает маркер -->
  <div v-if="items.length" class="mt-2">
    <button
      v-for="it in items"
      :key="it.id"
      @click="updateMarker(it)"
    >
      {{ it.status }} — {{ it.location }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'
import 'leaflet/dist/leaflet.css'
// где-нибудь один раз при инициализации карты/компонента
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// на некоторых сборках есть приватный геттер, его убирают
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})



// props
const props = defineProps({
  userLocation: {
    type: Array,
    required: true
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


// методы
const updateMarker = (item) => {
  markers.value = [{ id: item.id, position: item.position }]
  center.value = item.position
}
</script>
<style scoped>
.leaflet-control-attribution leaflet-control {
visibility: hidden;
display: none;
}
</style>