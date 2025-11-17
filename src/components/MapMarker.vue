<template>
  <div class="relative cursor-pointer" @click="handleClick">
    <div
      :class="[
        'relative w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg',
        'transition-transform hover:scale-110',
      ]"
      :style="{
        borderColor: isSelected ? '#06b6d4' : 'white',
        boxShadow: isSelected 
          ? '0 0 0 2px #06b6d4, 0 2px 8px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.2)',
      }"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img
        :src="ad.image_url"
        :onerror="() => ($event.target.src = 'https://via.placeholder.com/60?text=Pet')"
        class="w-full h-full object-cover"
      />
    </div>

    <!-- Badge -->
    <div
      class="absolute bottom-0 right-0 rounded-full border-2 border-white"
      :style="{
        width: '32px',
        height: '32px',
        backgroundColor: badgeColor,
        color: badgeTextColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bottom: '-4px',
        right: '-4px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
      }"
    >
      <i :class="iconClass" style="font-size: 16px"></i>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  ad: Object,
  isSelected: Boolean,
})

const emit = defineEmits(['card-selected'])

const isHovered = ref(false)

const badgeColor = computed(() => {
  const severity = getTagSeverity(props.ad.type)
  return severity === 'success' ? '#10b981' : '#fbbf24'
})

const badgeTextColor = computed(() => {
  const severity = getTagSeverity(props.ad.type)
  return severity === 'success' ? 'white' : '#1f2937'
})

const iconClass = computed(() => getAnimalTypeIcon(props.ad.animal_type))

const handleClick = () => {
  emit('card-selected', props.ad.id)
}
</script>
