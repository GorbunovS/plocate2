<template>
  <div class="flex flex-col p-4 items-start gap-4 overflow-y-auto">
    <Alert v-if="showAlert" :message="alertMsg" />
    <span class="text-sm text-gray-500 italic">Тип объявления</span>
    <SelectButton :invalid="adType === null" v-model="adType" :options="adTypes" optionLabel="name" />
    
    <span class="text-sm text-gray-500 italic">Тип животного</span>
    <SelectButton :invalid="petType === null" v-model="petType" :options="petTypes" optionLabel="name" dataKey="value" aria-labelledby="custom">
      <template #option="slotProps">
        <i :class="slotProps.option.icon"></i>
        <span class="ml-2">{{ slotProps.option.name }}</span>
      </template>
    </SelectButton>
    
    <span class="text-sm text-gray-500 italic">Изображение (Добавьте до 3)</span>
    <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
      <div v-for="(img, index) in images" :key="`img-${index}`" class="relative flex-shrink-0 w-24">
        <img :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" />
        <Button icon="pi pi-trash" severity="danger" text @click="removeImage(index)" class="absolute top-0 right-0 text-xs" />
      </div>
      <div v-if="images.length < 3" class="shadow-md rounded-xl w-24 h-full bg-gray-800 flex items-center justify-center cursor-pointer" @click="openFileInput">
        <i class="pi pi-plus text-gray-500 text-2xl"></i>
      </div>
    </div>
    <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" class="hidden" />
    
    <span class="text-sm text-gray-500 italic">Место</span>
    <Button @click="userLocation" icon="pi pi-map-marker" label="Поделиться гео" severity="success" variant="outlined" class="w-full" />
    <FloatLabel class="w-full" variant="in">
      <AutoComplete v-model="status" :suggestions="filteredAddresses" @complete="searchAddresses" optionLabel="name" class="w-full" />
      <label for="username">Или введите адрес</label>
    </FloatLabel>
  </div>
  
  <div class="actions p-4 flex flex-col gap-2 sm:gap-4 justify-center">
    <Button label="Далее" severity="success" variant="outlined" @click="emit('next', 'newAd')" class="w-full sm:w-auto" />
    <Button @click="emit('back')" icon="pi pi-angle-left" label="Назад" severity="secondary" variant="outlined" class="w-full sm:w-auto" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useMiniApp, Alert, useLocationManager } from 'vue-tg';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
} from '@telegram-apps/sdk';

const getUserLocation = async () => {
  try {
    // Проверяем, что компонент смонтирован
    if (!isLocationManagerMounted()) {
      if (mountLocationManager.isAvailable()) {
        const promise = mountLocationManager();
        isLocationManagerMounting(); // true
        await promise;
      } else {
        showTemporaryAlert('Геолокация не поддерживается');
        return;
      }
    }

    // Проверяем доступность запроса локации и запрашиваем её
    if (locationManager.requestLocation && locationManager.requestLocation.isAvailable && locationManager.requestLocation.isAvailable()) {
      const pos = await locationManager.requestLocation();
      // pos: { latitude, longitude, altitude?, speed?, course?, ... }
      location.value = pos;

      const parts = [
        `Широта: ${pos.latitude.toFixed(6)}`,
        `Долгота: ${pos.longitude.toFixed(6)}`
      ];
      if (typeof pos.horizontal_accuracy === 'number') {
        parts.push(`Точность: ±${Math.round(pos.horizontal_accuracy)} м`);
      }
      showTemporaryAlert(parts.join(' | '));
    } else {
      showTemporaryAlert('Запрос локации недоступен (requestLocation)');
    }
  } catch (error) {
    // На некоторых платформах нужно сначала открыть настройки
    if (locationManager.openSettings && locationManager.openSettings.isAvailable && locationManager.openSettings.isAvailable()) {
      locationManager.openSettings();
    }
    showTemporaryAlert('Не удалось получить местоположение: ' + (error?.message || 'ошибка'));
  }
};


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
  { name: 'Собака', value: 1, icon: 'las la-dog' },
  { name: 'Кошка', value: 2, icon: 'las la-cat' },
]);

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
       data: suggestion.data // Исправлена опечатка "dats" -> "data"
    }));
  })
  .catch(error => console.error('Error fetching addresses:', error));
};
</script>
