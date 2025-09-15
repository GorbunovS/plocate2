<template>
  <div v-if="mapIsOpen" class="fixed inset-0 z-50 flex items-center justify-center" @click="closeMap">
    <!-- Фон overlay -->
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"></div>
    
    <!-- Контейнер карты -->
    <div class="relative w-[min(90vw,900px)] h-[min(80vh,80vh)] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden
             transform transition-all duration-300 ease-out" @click.stop>
      
      <!-- Только карта без дополнительных элементов -->
      <div class="w-full h-full">
        <MapVew :center="[ourLocation.latitude, ourLocation.longitude]"
          :user-location="[ourLocation.latitude, ourLocation.longitude]" 
          @center-changed="onCenterChanged" />
      </div>
    </div>

    <!-- Контролы поверх всего (вынесены из контейнера карты) -->
    
    <!-- Кнопка закрыть -->
    <button @click="closeMap" 
            class="absolute top-4 right-4 z- 
                   bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                   rounded-full w-10 h-10 flex items-center justify-center 
                   text-white text-lg font-bold transition-colors
                   border border-white/20 hover:border-white/40">
      ✕
    </button>
    
    <!-- Чип с информацией -->
    <Chip class="absolute z- top-4 left-1/2 -translate-x-1/2" />
    
    <!-- Кастомный маркер по центру -->
    <div class="absolute z- top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
      <img :src="Marker" class="scale-200 drop-shadow-lg" />
    </div>
  </div>
  <div class="flex flex-col p-4 items-start gap-4 overflow-y-auto">
    <Alert v-if="showAlert" :message="alertMsg" />
    <span class="text-sm text-gray-500 italic">Тип объявления</span>
    <SelectButton :invalid="adType === null" v-model="adType" :options="adTypes" optionLabel="name" />

    <span class="text-sm text-gray-500 italic">Тип животного</span>
    <SelectButton :invalid="petType === null" v-model="petType" :options="petTypes" optionLabel="name" dataKey="value"
      aria-labelledby="custom">
      <template #option="slotProps">
        <i :class="slotProps.option.icon"></i>
        <span class="ml-2">{{ slotProps.option.name }}</span>
      </template>
    </SelectButton>

    <span class="text-sm text-gray-500 italic">Изображение (Добавьте до 3)</span>
    <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
      <div v-for="(img, index) in images" :key="`img-${index}`" class="relative flex-shrink-0 w-24">
        <img :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" />
        <Button icon="pi pi-trash" severity="danger" text @click="removeImage(index)"
          class="absolute top-0 right-0 text-xs" />
      </div>
      <div v-if="images.length < 3"
        class="shadow-md rounded-xl w-24 h-full bg-gray-800 flex items-center justify-center cursor-pointer"
        @click="openFileInput">
        <i class="pi pi-plus text-gray-500 text-2xl"></i>
      </div>
    </div>
    <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" class="hidden" />

    <span class="text-sm text-gray-500 italic">Место</span>
    <Button @click="openMap" icon="pi pi-map" label="Выбрать на карте" severity="success" variant="outlined"
      class="w-full" />
    <FloatLabel class="w-full" variant="in">
      <AutoComplete v-model="status" :suggestions="filteredAddresses" @complete="searchAddresses" optionLabel="name"
        class="w-full" />
      <label for="username">Или введите адрес</label>
    </FloatLabel>
  </div>

  <div class="actions p-4 flex flex-col gap-2 sm:gap-4 justify-center">
    <Button label="Далее" severity="success" variant="outlined" @click="emit('next', 'newAd')"
      class="w-full sm:w-auto" />
    <Button @click="emit('back')" icon="pi pi-angle-left" label="Назад" severity="secondary" variant="outlined"
      class="w-full sm:w-auto" />
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { Chip } from 'primevue';
import MapVew from './MapVew.vue';
import Marker from '../assets/marker.svg';
import { useMiniApp, Alert, useLocationManager } from 'vue-tg';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  requestLocation
} from '@telegram-apps/sdk';

const mapIsOpen = ref(false);
const ourLocation = ref({});

const ourLocationCoords = ref([null, null]);

// Функция, вызываемая при изменении центра
const onCenterChanged = (coords) => {
  ourLocationCoords.value = coords;
  adressByCoordinates(coords);
};

// Функции для управления картой
const openMap = () => {
  mapIsOpen.value = true;
};

const closeMap = () => {
  mapIsOpen.value = false;
};

const userLocation = async () => {
  if (mountLocationManager.isAvailable()) {
    try {
      const promise = mountLocationManager();
      isLocationManagerMounting(); // true
      await promise;
      const location = await requestLocation();
      ourLocation.value = location;
      await adressByCoordinates(ourLocationCoords.value);
      isLocationManagerMounted(); // true
    } catch (err) {
      locationManagerMountError(); // equals "err"
      showTemporaryAlert('Location manager mount error' + err.message);
      isLocationManagerMounting(); // false
      isLocationManagerMounted(); // false
    }
  }
}

const emit = defineEmits(['back', 'next']);

const status = ref('');
const alertMsg = ref('');
const showAlert = ref(false);

const miniApp = useMiniApp();
const locationManager = useLocationManager();
const adType = ref(null);
const petType = ref(null);
const filteredAddresses = ref([]);
const images = ref([]);
const fileInput = ref(null);
const location = ref(null); // Для хранения координат

const showTemporaryAlert = (message) => {
  alertMsg.value = message;
  showAlert.value = true;
  setTimeout(() => {
    showAlert.value = false;
  }, 3000); // Автозакрытие через 3 секунды
};

const openFileInput = () => {
  fileInput.value.click();
};

const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (images.value.length >= 3) return; // Лимит
  const reader = new FileReader();
  reader.onload = (e) => {
    images.value.push(e.target.result);
    event.target.value = '';
  };
  reader.readAsDataURL(file);
};

const removeImage = (index) => {
  images.value.splice(index, 1);
};

const adTypes = ref([
  { name: 'Потерял', value: 1 },
  { name: 'Нашёл', value: 2 },
]);

const petTypes = ref([
  { name: 'Собаку', value: 1, icon: 'las la-dog' },
  { name: 'Кошку', value: 2, icon: 'las la-cat' },
]);

const adressByCoordinates =async (coordinate) => {
  const token = 'a2c3836e1483440a86077f7d23c169405924ddc6';
  const url = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/geolocate/address";
  const query = coordinate;

  fetch(url, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${token}`,
      'X-Secret': '2e0536c54e06461d2f12350d038bc234c69a3fcb'
    },
    body: JSON.stringify({ query, count: 1, language: 'ru' })
  })
    .then(response => response.json())
    .then(data => {
      if (data.suggestions.length > 0) {
      selectedAddress.value = data.suggestions[0].value; // Add this
      status.value = selectedAddress.value; // Add this
    }
      filteredAddresses.value = data.suggestions.map(suggestion => ({
        name: suggestion.value,
        data: suggestion.data
      }));
       showTemporaryAlert(data.suggestions[0].value);
    })
    .catch(error => console.error('Error fetching addresses:', error));
}

const searchAddresses = (event) => {
  const query = event.query;
  const token = 'a2c3836e1483440a86077f7d23c169405924ddc6';

  fetch('https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `Token ${token}`,
      'X-Secret': '2e0536c54e06461d2f12350d038bc234c69a3fcb'
    },
    body: JSON.stringify({ query, count: 10, language: 'ru' })
  })
    .then(response => response.json())
    .then(data => {
      filteredAddresses.value = data.suggestions.map(suggestion => ({
        name: suggestion.value,
        data: suggestion.data
      }));
    })
    .catch(error => console.error('Error fetching addresses:', error));
};

onMounted(() => {
  userLocation();

});
</script>