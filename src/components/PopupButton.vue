<script setup lang="ts">
/**
 * Component which opens native Telegram Popup.
 */
import { popup } from '@telegram-apps/sdk-vue'

const props = defineProps<{ title: string, message: string }>()

function open() {
  if (popup.isSupported()) {
    popup.open(props);
    return;
  }

  // Open fallback HTML dialog...
}
</script>

<template>
  <button aria-haspopup="dialog" @click="open">
    Open popup
  </button>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>