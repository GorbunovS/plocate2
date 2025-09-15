<template>
  <LMap :zoom="zoom" :center="center" @moveend="onMoveEnd" style="height: 100%;
     width: 100%;">
    <LTileLayer :url="tileUrl" />

  </LMap>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet'; // или vue3-leaflet

const props = defineProps({
  center: {
    type: Array,
    required: true
  },
  zoom: {
    type: Number,
    default: 13
  },
  tileUrl: {
    type: String,
    default: 'https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=g7cM1vMR1viO2I3YInIA'
  }
});
const emit = defineEmits(['update:center', 'center-changed']);

function onMoveEnd(e) {
  const map = e.target;
  const newCenter = [map.getCenter().lat, map.getCenter().lng];

  emit('update:center', newCenter);

  emit('center-changed', newCenter);
}
</script>
