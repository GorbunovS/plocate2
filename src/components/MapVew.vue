<template>
  <LMap ref="map" :attributionControl="false" :zoom="zoom" :center="center" style="height: 100%; width: 100%">
    <LTileLayer :url="url" :attribution="attribution" />
    <LMarker ref="centerMarker" :lat-lng="markerPosition" :icon="icon"></LMarker>
  </LMap>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

// позиция маркера (инициализируем из пропса, но делаем реактивной для обновлений)
const markerPosition = ref(props.userLocation)

// доступ к карте и маркеру
const map = ref(null)
const centerMarker = ref(null)

onMounted(() => {
  const leafletMap = map.value.leafletObject // Получаем объект Leaflet карты

  // Фиксируем маркер в центре при перемещении карты
  leafletMap.on('move', () => {
    const newCenter = leafletMap.getCenter()
    centerMarker.value.leafletObject.setLatLng(newCenter) // Обновляем позицию маркера
    markerPosition.value = [newCenter.lat, newCenter.lng] // Сохраняем для дальнейшего использования (чтобы потом записать центр)
  })
})
</script>

<style scoped>
.leaflet-control-attribution leaflet-control {
  visibility: hidden;
  display: none;
}
</style>
