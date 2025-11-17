<template>
  <div class="relative w-full h-full min-h-[300px]">
    <!-- Центральный маркер -->
    <img 
      :src="Marker" 
      class="absolute z-[1100] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-100 pointer-events-none" 
    />
    
    <!-- Контейнер карты -->
    <div ref="mapContainer" class="w-full h-full"></div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps } from 'vue'
import { createApp } from 'vue'
import maplibregl from 'maplibre-gl'
import Chip from 'primevue/chip'
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ latitude: 55.751244, longitude: 37.618423 })
  },
  ads: {
    type: Array,
    default: () => []
  }
})

const mapContainer = ref(null)
const map = ref(null)
const zoom = ref(13)
const popup = ref(null)
const debugMode = ref(false)
const Marker = ref('')
const markersMap = ref(new Map()) // Хранилище созданных маркеров

// ✅ Функция валидации координат
const isValidCoordinates = (center) => {
  if (!center) return false
  const lng = center.longitude
  const lat = center.latitude
  
  if (isNaN(lng) || isNaN(lat)) return false
  if (lng < -180 || lng > 180) return false
  if (lat < -90 || lat > 90) return false
  
  return true
}

// ✅ Получение безопасных координат
const getSafeCoordinates = (center) => {
  if (!isValidCoordinates(center)) {
    console.warn('❌ Координаты невалидны, используются default:', center)
    return [37.618423, 55.751244]
  }
  return [center.longitude, center.latitude]
}

// ✅ Маппинг данных с сервера в нужный формат
const mapAdData = (rawAd) => {
  return {
    ...rawAd,
    location: {
      latitude: parseFloat(rawAd.latitude),
      longitude: parseFloat(rawAd.longitude)
    },
    image_url: rawAd.images && rawAd.images.length > 0
      ? rawAd.images[0]
      : 'https://via.placeholder.com/60?text=Pet'
  }
}

// ✅ Создание маркера с PrimeVue Chip
const createChipMarker = (ad) => {
  const container = document.createElement('div')
  container.style.pointerEvents = 'auto'
  container.style.cursor = 'pointer'

  const chipApp = createApp(Chip, {
    label: ad.description || 'Питомец',
    image: ad.image_url,
    icon: ad.animal_type === 'dog' ? 'pi pi-fw pi-paw' : 'pi pi-fw pi-paw',
    removable: false,
    class: 'custom-chip-marker',
    style: 'padding: 4px 12px;'
  })

  chipApp.mount(container)

  // Стили для Chip маркера
  const chipElement = container.querySelector('.p-chip')
  if (chipElement) {
    chipElement.style.cssText = `
      background: white !important;
      border: 2px solid #fff !important;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2) !important;
      border-radius: 20px !important;
      padding: 4px 8px !important;
      font-size: 12px !important;
      min-height: 32px !important;
      white-space: nowrap !important;
      transition: filter 0.2s, transform 0.2s !important;
    `

    chipElement.addEventListener('mouseenter', () => {
      chipElement.style.filter = 'brightness(1.15)'
      chipElement.style.transform = 'scale(1.1)'
    })
    chipElement.addEventListener('mouseleave', () => {
      chipElement.style.filter = 'brightness(1)'
      chipElement.style.transform = 'scale(1)'
    })
  }

  return container
}

// Определение иконок по типу животного
const getAnimalTypeIcon = (animalType) => {
  const iconMap = {
    dog: 'pi pi-fw pi-paw',
    cat: 'pi pi-fw pi-paw',
    rabbit: 'pi pi-fw pi-circle-fill',
    bird: 'pi pi-fw pi-circle-fill',
    hamster: 'pi pi-fw pi-circle-fill',
    reptile: 'pi pi-fw pi-circle-fill',
  }
  return iconMap[animalType] || 'pi pi-fw pi-paw'
}

// Определение цвета по типу животного
const getAnimalTypeColor = (animalType) => {
  const colorMap = {
    dog: '#3B82F6',
    cat: '#A855F7',
    rabbit: '#EC4899',
    bird: '#F59E0B',
    hamster: '#10B981',
    reptile: '#14B8A6',
  }
  return colorMap[animalType] || '#3B82F6'
}

// ✅ Инициализация карты с безопасными координатами
const initializeMap = () => {
  if (!mapContainer.value) {
    console.error('❌ Map container не найден')
    return
  }

  const safeCoordinates = getSafeCoordinates(props.center)
  
  console.log('🗺️ Инициализация карты с координатами:', safeCoordinates)

  map.value = new maplibregl.Map({
    container: mapContainer.value,
    style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=g7cM1vMR1viO2I3YInIA',
    center: safeCoordinates,
    zoom: zoom.value,
    pitch: 0,
    bearing: 0
  })

  map.value.on('load', () => {
    console.log('✅ Карта загружена')
    addMarkers()
  })

  map.value.on('error', (error) => {
    console.error('❌ Ошибка MapLibre:', error)
  })
}

// ✅ Добавление маркеров с Chip компонентами
const addMarkers = () => {
  if (!map.value) {
    console.warn('⚠️ Map не инициализирована')
    return
  }

  if (!props.ads || props.ads.length === 0) {
    console.log('⚠️ Маркеры не найдены')
    return
  }

  // Маппируем данные с сервера
  const mappedAds = props.ads.map(mapAdData)
  console.log(`📍 Добавляю ${mappedAds.length} маркеров`)

  mappedAds.forEach((ad, index) => {
    // ✅ Валидация координат маркера
    if (!ad.location || isNaN(ad.location.longitude) || isNaN(ad.location.latitude)) {
      console.warn(`⚠️ Маркер ${index} имеет некорректные координаты:`, ad)
      return
    }

    try {
      // Создаём Chip маркер
      const el = createChipMarker(ad)
      
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ad.location.longitude, ad.location.latitude])
        .addTo(map.value)

      // Обработчик клика
      el.addEventListener('click', (e) => {
        e.stopPropagation()
        openPopup(ad)
      })

      // Сохраняем маркер
      markersMap.value.set(ad.id, marker)

      console.log(`✅ Маркер ${ad.id} (${ad.name}) добавлен на карту`)
    } catch (error) {
      console.error(`❌ Ошибка при добавлении маркера ${index}:`, error)
    }
  })
}

// Открытие попапа
const openPopup = (ad) => {
  if (popup.value) {
    popup.value.remove()
  }

  const popupContent = `
    <div class="p-4 min-w-[250px]">
      <div class="flex gap-3 mb-3">
        <img 
          src="${ad.image_url}" 
          alt="${ad.animal_type}" 
          class="w-12 h-12 rounded-full object-cover"
          onerror="this.src='https://via.placeholder.com/50?text=Pet'"
        />
        <div>
          <h3 class="font-semibold text-sm">${ad.name || 'Питомец'}</h3>
          <p class="text-xs text-gray-600">${ad.animal_type}</p>
        </div>
      </div>
      <p class="text-sm text-gray-700 mb-2">${ad.description || 'Нет описания'}</p>
      <p class="text-xs text-gray-500">📍 ${ad.location.latitude.toFixed(4)}, ${ad.location.longitude.toFixed(4)}</p>
    </div>
  `

  try {
    popup.value = new maplibregl.Popup({ offset: 25 })
      .setLngLat([ad.location.longitude, ad.location.latitude])
      .setHTML(popupContent)
      .addTo(map.value)
  } catch (error) {
    console.error('❌ Ошибка при открытии попапа:', error)
  }
}

// Ре-центрирование карты
const updateMapCenter = (newCenter) => {
  if (!map.value) return

  const safeCoordinates = getSafeCoordinates(newCenter)
  console.log('🎯ТЦентр карты обновлён:', safeCoordinates)

  map.value.flyTo({
    center: safeCoordinates,
    zoom: zoom.value,
    duration: 1000
  })
}

// ✅ Очистка и добавление маркеров
const updateMarkers = () => {
  if (!map.value) return

  console.log('🔄 Обновляю маркеры')

  // Удаляем старые маркеры
  markersMap.value.forEach(marker => {
    marker.remove()
  })
  markersMap.value.clear()

  addMarkers()
}

// Жизненный цикл
onMounted(() => {
  console.log('📌 Компонент AdsMap смонтирован')
  initializeMap()
})

// Следим за изменениями center
watch(
  () => props.center,
  (newCenter) => {
    if (map.value && newCenter) {
      updateMapCenter(newCenter)
    }
  },
  { deep: true }
)

// Следим за изменениями ads
watch(
  () => props.ads,
  () => {
    updateMarkers()
  },
  { deep: true }
)
</script>

<style scoped>
:deep(.maplibregl-popup-content) {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 0;
}

:deep(.maplibregl-popup-close-button) {
  width: 28px;
  height: 28px;
  right: 8px;
  top: 8px;
  font-size: 18px;
}

.custom-marker-wrapper {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>