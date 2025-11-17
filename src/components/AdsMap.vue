
AdsMap Component


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
import 'maplibre-gl/dist/maplibre-gl.css'

const props = defineProps({
  center: {
    type: Object,
    default: () => ({ latitude: 55.751244, longitude: 37.618423 })
  },
  ads: {
    type: Array,
    default: () => []
  },
  selectedAdId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['card-selected', 'contact'])

const mapContainer = ref(null)
const map = ref(null)
const zoom = ref(13)
const popup = ref(null)
const Marker = ref('')
const markersMap = ref(new Map())
const activeMarkerId = ref(null)

// ✅ Валидация координат
const isValidCoordinates = (center) => {
  if (!center) return false
  const lng = center.longitude
  const lat = center.latitude
  
  if (isNaN(lng) || isNaN(lat)) return false
  if (lng < -180 || lng > 180) return false
  if (lat < -90 || lat > 90) return false
  
  return true
}

// ✅ Безопасные координаты
const getSafeCoordinates = (center) => {
  if (!isValidCoordinates(center)) {
    console.warn('❌ Координаты невалидны, используются default:', center)
    return [37.618423, 55.751244]
  }
  return [center.longitude, center.latitude]
}

// ✅ Маппинг данных
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

// ✅ Определение иконок по типу животного
const getAnimalTypeIcon = (animalType) => {
  const iconMap = {
    dog: 'las la-dog',
    cat: 'las la-cat',
    other: 'las la-paw',
  }
  return iconMap[animalType] || 'las la-paw'
}

// ✅ Определение severity для Tag по типу объявления
const getTagSeverity = (type) => {
  return type === 'found' ? 'warn' : 'success'
}

// ✅ Определение статуса по типу объявления
const getAdTypeLabel = (type) => {
  return type === 'found' ? 'Ищет хозяина' : 'Потерял'
}

// ✅ Определение метки животного
const getAnimalTypeLabel = (type) => {
  const labels = {
    dog: 'собаку',
    cat: 'кошку',
    other: 'петомца',
  }
  return labels[type] || type
}// ✅ Вычисление времени поиска
const getSearchDuration = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date

  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days}д ${hours % 24}ч`
  }
  return `${hours}ч`
}

// ✅ Форматирование адреса
const formatAddress = (ad) => {
  if (ad.address) return ad.address
  return `${ad.location.latitude.toFixed(4)}, ${ad.location.longitude.toFixed(4)}`
}// ✅ Создание маркера с фото и бэджем (кружок с иконкой)
const createMarker = (ad) => {
  const container = document.createElement('div')
  container.className = 'relative cursor-pointer'
  container.style.pointerEvents = 'auto'

  // Основной кружок с фото
  const photoCircle = document.createElement('div')
  const isSelected = activeMarkerId.value === ad.id
  photoCircle.className = 'relative w-14 h-14 rounded-full overflow-hidden border-2 shadow-lg transition-transform hover:scale-110'
  photoCircle.style.cssText = `
    width: 56px;
    height: 56px;
    border: 3px solid ${isSelected ? '#06b6d4' : 'white'};
    box-shadow: ${isSelected ? '0 0 0 2px #06b6d4, 0 2px 8px rgba(0, 0, 0, 0.2)' : '0 2px 8px rgba(0, 0, 0, 0.2)'};
    border-radius: 9999px;
    overflow: hidden;
    transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  `

  // Фото
  const img = document.createElement('img')
  img.src = ad.image_url
  img.onerror = () => {
    img.src = 'https://via.placeholder.com/60?text=Pet'
  }
  img.style.cssText = `
    width: 100%;
    height: 100%;
    object-fit: cover;
  `
  photoCircle.appendChild(img)

  // Бэдж (иконка) в правом нижнем углу
  const badge = document.createElement('div')
  const severity = getTagSeverity(ad.type)
  
  let bgColor = '#fbbf24' // warn (жёлтый)
  let textColor = '#1f2937' // dark text
  if (severity === 'success') {
    bgColor = '#10b981' // success (зелёный)
    textColor = 'white'
  }

  badge.className = 'absolute bottom-0 right-0 rounded-full border border-white'
  badge.style.cssText = `
    position: absolute;
    bottom: -4px;
    right: -4px;
    width: 32px;
    height: 32px;
    border-radius: 9999px;
    background-color: ${bgColor};
    color: ${textColor};
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid white;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    font-size: 16px;
  `

  const icon = document.createElement('i')
  icon.className = getAnimalTypeIcon(ad.animal_type)
  icon.style.cssText = `
    font-size: 16px;
    line-height: 1;
  `
  badge.appendChild(icon)

  container.appendChild(photoCircle)
  container.appendChild(badge)

  // События
  photoCircle.addEventListener('mouseenter', () => {
    photoCircle.style.transform = 'scale(1.1)'
  })
  photoCircle.addEventListener('mouseleave', () => {
    photoCircle.style.transform = 'scale(1)'
  })

  container.addEventListener('click', (e) => {
    e.stopPropagation()
    activeMarkerId.value = ad.id
    emit('card-selected', ad.id)
    openPopup(ad)
  })

  return container
}

// ✅ Открытие попапа как развёрнутая карточка
const openPopup = (ad) => {
  if (popup.value) {
    popup.value.remove()
  }

  const severity = getTagSeverity(ad.type)
  let severityColor = 'text-yellow-600' // warn
  let bgColor = '#fef3c7' // yellow-50
  if (severity === 'success') {
    severityColor = 'text-green-600' // success
    bgColor = '#ecfdf5' // green-50
  }

  const popupContent = `
    <div style="
      width: 220px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    ">
      <!-- Header с иконкой и статусом -->
      <div style="
        padding: 12px 16px;
        background: ${bgColor};
        border-bottom: 1px solid #e5e7eb;
        display: flex;
        align-items: center;
        gap: 8px;
      ">
        <div style="
          width: 32px;
          height: 32px;
          background: ${severity === 'warn' ? '#fbbf24' : '#10b981'};
          color: ${severity === 'warn' ? '#1f2937' : 'white'};
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
        ">
          <i class="${getAnimalTypeIcon(ad.animal_type)}"></i>
        </div>
        <span style="
          font-weight: 500;
          font-size: 14px;
          color: #1f2937;
        ">
          ${getAdTypeLabel(ad.type)}${ad.type === 'lost' ? ' ' + getAnimalTypeLabel(ad.animal_type) : ''}
        </span>
      </div>

      <!-- Фото (Galleria альтернатива) -->
      <div style="
        width: 100%;
        height: 200px;
        background: #f3f4f6;
        overflow: hidden;
      ">
        <img 
          src="${ad.image_url}" 
          alt="${ad.animal_type}"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
          "
          onerror="this.src='https://via.placeholder.com/320x200?text=Pet'"
        />
      </div>

      <!-- Body -->
      <div style="padding: 16px;">
        <!-- Название и время -->
        <div style="
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        ">
          <h3 style="
            margin: 0;
            font-weight: 600;
            font-size: 16px;
            color: #1f2937;
          ">
          <div style="
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        ">
          <img 
            src="${ad.user_avatar || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'}"
            alt="User"
            style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              object-fit: cover;
            "
          />
          <span style="
            font-size: 13px;
            color: #6b7280;
          ">
            ${ad.user_name || 'Пользователь'}
          </span>
        </div>
          </h3>
          <span style="
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
            margin-left: 8px;
          ">
            <i class="pi pi-hourglass" style="margin-right: 4px;"></i>
            ${getSearchDuration(ad.updated_at)}
          </span>
        </div>

        <!-- Описание -->
        <p style="
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #4b5563;
          line-height: 1.5;
        ">
          ${ad.description || 'Нет описания'}
        </p>

        <!-- Адрес -->
        <div style="
          padding: 8px;
          background: #f9fafb;
          border-radius: 6px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        ">
          📍 ${formatAddress(ad)}
        </div>

        <!-- Avatar + описание (если есть) -->
        
      </div>

      <!-- Footer с кнопкой -->
      <div style="
        padding: 12px 16px;
        border-top: 1px solid #e5e7eb;
        display: flex;
        gap: 8px;
      ">
        <button style="
          flex: 1;
          padding: 8px 12px;
          background: #06b6d4;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        "
        onmouseover="this.style.background='#0891b2'"
        onmouseout="this.style.background='#06b6d4'"
        data-ad-id="${ad.id}"
        >
          <i class="pi pi-send" style="font-size: 13px;"></i>
          Связаться
        </button>
      </div>
    </div>
  `

  try {
    popup.value = new maplibregl.Popup({ 
      offset: 25,
      closeButton: true,
      closeOnClick: false,
      anchor: 'top'
    })
      .setLngLat([ad.location.longitude, ad.location.latitude])
      .setHTML(popupContent)
      .addTo(map.value)

    // Обработчик клика на кнопку "Связаться"
    setTimeout(() => {
      const contactBtn = popup.value?._content?.querySelector('button')
      if (contactBtn) {
        contactBtn.addEventListener('click', () => {
          emit('contact', ad.id)
        })
      }
    }, 0)
  } catch (error) {
    console.error('❌ Ошибка при открытии попапа:', error)
  }
}

// ✅ Инициализация карты
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

// ✅ Добавление маркеров
const addMarkers = () => {
  if (!map.value) {
    console.warn('⚠️ Map не инициализирована')
    return
  }

  if (!props.ads || props.ads.length === 0) {
    console.log('⚠️ Маркеры не найдены')
    return
  }

  const mappedAds = props.ads.map(mapAdData)
  console.log(`📍 Добавляю ${mappedAds.length} маркеров`)

  mappedAds.forEach((ad, index) => {
    if (!ad.location || isNaN(ad.location.longitude) || isNaN(ad.location.latitude)) {
      console.warn(`⚠️ Маркер ${index} имеет некорректные координаты:`, ad)
      return
    }

    try {
      const el = createMarker(ad)
      
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([ad.location.longitude, ad.location.latitude])
        .addTo(map.value)

      markersMap.value.set(ad.id, marker)
      console.log(`✅ Маркер ${ad.id} (${ad.name}) добавлен на карту`)
    } catch (error) {
      console.error(`❌ Ошибка при добавлении маркера ${index}:`, error)
    }
  })
}

// ✅ Ре-центрирование карты
const updateMapCenter = (newCenter) => {
  if (!map.value) return

  const safeCoordinates = getSafeCoordinates(newCenter)
  console.log('🎯 Центр карты обновлён:', safeCoordinates)

  map.value.flyTo({
    center: safeCoordinates,
    zoom: zoom.value,
    duration: 1000
  })
}

// ✅ Обновление маркеров
const updateMarkers = () => {
  if (!map.value) return

  console.log('🔄 Обновляю маркеры')

  markersMap.value.forEach(marker => {
    marker.remove()
  })
  markersMap.value.clear()

  addMarkers()
}

// ✅ Переключение на карточку по ID
const selectAdById = (adId) => {
  const ad = props.ads.find(a => a.id === adId)
  if (ad && ad.location) {
    activeMarkerId.value = adId
    updateMapCenter(ad.location)
    // Открываем попап
    setTimeout(() => {
      const mappedAd = mapAdData(ad)
      openPopup(mappedAd)
    }, 500)
  }
}

// ✅ Жизненный цикл
onMounted(() => {
  console.log('📌 Компонент AdsMap смонтирован')
  initializeMap()
})

// ✅ Следим за изменениями
watch(
  () => props.center,
  (newCenter) => {
    if (map.value && newCenter) {
      updateMapCenter(newCenter)
    }
  },
  { deep: true }
)

watch(
  () => props.ads,
  () => {
    updateMarkers()
  },
  { deep: true }
)

watch(
  () => props.selectedAdId,
  (newId) => {
    if (newId) {
      selectAdById(newId)
    }
  }
)
</script>

<style scoped>
:deep(.maplibregl-popup-content) {
  padding: 0;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
}

:deep(.maplibregl-popup-close-button) {
  width: 28px;
  height: 28px;
  right: 8px;
  top: 8px;
  font-size: 18px;
  color: #6b7280;
}

:deep(.maplibregl-popup-close-button:hover) {
  background-color: #f3f4f6;
}
</style>