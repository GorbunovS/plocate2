<template>
  <Mapbox :options="mapOptions" style="height: 500px" @load="onMapLoad">
    <GeoJsonSource :data="geoJsonData">
      <FillLayer :style="fillStyle" />
      <CircleLayer :style="circleStyle" />
    </GeoJsonSource>

    <Marker :lnglat="props.myCoord || [37.6156, 55.7522]" :draggable="true">
      <div class="marker"> <div class="marker-container">
          <div class="marker-dot"></div>
          <div class="marker-radius"></div>
        </div></div>
    </Marker>

  </Mapbox>
</template>

<script setup>
import { ref,defineProps } from 'vue';
import {
  Mapbox,
  GeoJsonSource,
  FillLayer,
  CircleLayer,
  Marker
} from 'vue3-maplibre-gl';
import 'vue3-maplibre-gl/dist/style.css';

const props = defineProps({
  myCoord: {
    type: Array,
    required: true
  }
})

const mapOptions = ref({
  style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=g7cM1vMR1viO2I3YInIA',
  center:props.myCoord || [37.6156, 55.7522], //Москва
zoom: 10
});


const geoJsonData = ref({
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      properties: { name: 'Sample Point' },
    },
  ],
});

const fillStyle = ref({
  'fill-color': '#088',
  'fill-opacity': 0.8,
});

const circleStyle = ref({
  'circle-radius': 6,
  'circle-color': '#007cbf',
});

const showPopup = ref(true);

function onMapLoad(map) {
  console.log('Map loaded:', map);
}
</script>

<style scoped>
.map-wrapper {
  position: relative;
  width: 100%;
  height: 100vh;
}

/* Маркер */
.marker-container {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-dot {
  width: 22px;
  height: 22px;
  background-color: #0066cc;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 0 8px rgba(0, 102, 204, 0.6);
  z-index: 10;
  position: relative;
}

.marker-radius {
  position: absolute;
  width: v-bind('markerRadius + "px"');
  height: v-bind('markerRadius + "px"');
  border: 2px solid rgba(0, 102, 204, 0.3);
  border-radius: 50%;
  transition: width 0.3s ease, height 0.3s ease;
}

/* Панель управления */
.controls-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 20;
  min-width: 250px;
}

.controls-panel p {
  margin: 8px 0;
  font-size: 13px;
  color: #333;
}

.coordinates-info {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.coordinates-info strong {
  color: #0066cc;
}
</style>