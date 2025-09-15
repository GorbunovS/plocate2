<template>
  <div>
    <button @click="centerOnUserLocation">Center on User Location</button>
    <LMap
      ref="map"
      :attributionControl="false"
      :zoom="zoom"
      :center="center"
      style="height: 100%; width: 100%"
      @click="handleMapClick"
    >
      <LTileLayer :url="url" :attribution="attribution" />
      <LMarker :lat-lng="userLocation" :icon="icon"></LMarker>
      <LMarker
        v-if="userPetMarker.length"
        :lat-lng="userPetMarker[0]"
        :icon="icon"
      ></LMarker>
    </LMap>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Configure default Leaflet icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Props
const props = defineProps({
  userPetMarker: {
    type: Array,
    default: () => [],
  },
  userLocation: {
    type: Array,
    default: () => [55.751244, 37.618423],
  },
});

// Reactive states
const zoom = ref(13);
const center = ref([55.751244, 37.618423]);
const url = ref('https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA');
const attribution = ref('&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors');
const map = ref(null); // Reference to the LMap component

// Handle map click to add/move marker
const handleMapClick = (event) => {
  const { lat, lng } = event.latlng;
  props.userPetMarker.splice(0, 1, [lat, lng]); // Update or set the marker position
  center.value = [lat, lng]; // Center map on the new marker
};

// Center map on userLocation
const centerOnUserLocation = () => {
  center.value = props.userLocation; // Update center to userLocation
};
</script>

<style scoped>
.leaflet-control-attribution {
  visibility: hidden;
  display: none;
}
button {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 1000;
  padding: 8px 16px;
  background: #fff;
  border: 1px solid #ccc;
  cursor: pointer;
}
</style>