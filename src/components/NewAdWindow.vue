<template>
  <div class="flex flex-col p-4 items-start gap-4 overflow-y-auto">
    <Alert message="!" />
    <span class="text-sm text-gray-500 italic">Тип объявления</span>
    <SelectButton :invalid="adType === null" v-model="adType" :options="adTypes" optionLabel="name" />
    
    <span class="text-sm text-gray-500 italic">Тип животного</span>
    <SelectButton :invalid="petType === null" v-model="petType" :options="petTypes" optionLabel="name" dataKey="value" aria-labelledby="custom" >
      <template #option="slotProps">
        <i :class="slotProps.option.icon"></i>
        <span class="ml-2">{{ slotProps.option.name }}</span>
      </template>
    </SelectButton>
    
    <span class="text-sm text-gray-500 italic">Изображение (Добавьте до 3)</span>
    <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
      <div v-for="(img, index) in images" :key="`img-${index}`" class="relative flex-shrink-0 w-24">
        <img :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" style="filter: grayscale(100%)" />
        <Button icon="pi pi-trash" severity="danger" text @click="removeImage(index)" class="absolute top-0 right-0 text-xs" />
      </div>
      <div v-if="images.length < 3" class="shadow-md rounded-xl w-24 h-full bg-gray-800 flex items-center justify-center cursor-pointer" @click="openFileInput">
        <i class="pi pi-plus text-gray-500 text-2xl"></i>
      </div>
    </div>
    <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" class="hidden" />
    
    <span class="text-sm text-gray-500 italic">Место</span>
    <Button @click="getLocation"  icon="pi pi-map-marker" label="Указать на карте" severity="success" variant="outlined" class="w-full" />
    <FloatLabel class="w-full" variant="in">
      <AutoComplete v-model="address" :suggestions="filteredAddresses" @complete="searchAddresses" optionLabel="name" class="w-full" />
      <label for="username">Или введите адрес</label>
    </FloatLabel>
  </div>
  
      <div class="actions p-4 flex flex-col gap-2 sm:gap-4 justify-center ">
      <Button label="Далее" severity="success" variant="outlined" @click="currentPage = 'newAd'" class="w-full sm:w-auto" />
      <Button @click="emit('back')" icon="pi pi-angle-left" label="Назад" severity="secondary" variant="outlined" class="w-full sm:w-auto" />
    </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import { Alert } from 'vue-tg'
import { useLocationManager } from 'vue-tg'

const status = ref('')
const locationManager = useLocationManager()

const getLocation = async () =>{
  if (!locationManager.isSupported()) {
    status.value = 'Геолокация не поддерживается'
    return
  }

  try {
    status.value = 'Запрос геолокации…'
    await locationManager.mount()               // Запрашивает разрешение
    const loc = await locationManager.request() // Получает координаты
    status.value = `Широта: ${loc.latitude}, Долгота: ${loc.longitude}`
  } catch (err) {
    console.error(err)
    status.value = 'Ошибка получения геолокации'
  }
}


const emit = defineEmits(['back']);

const adType = ref(null);
const petType = ref(null);
const address = ref(null);
const filteredAddresses = ref([]);
const images = ref([]);
const fileInput = ref(null);
const location = ref(null);


function openFileInput() {
  fileInput.value.click();

}

function onFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    images.value.push(e.target.result);
    event.target.value = ''; 
  };
  reader.readAsDataURL(file);
}

function removeImage(index) {
  images.value.splice(index, 1);
}

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
    body: JSON.stringify({ query: query, count: 10, language: 'ru' })
  })
  .then(response => response.json())
  .then(data => {
    filteredAddresses.value = data.suggestions.map(suggestion => ({
      name: suggestion.value,
       dats:suggestion.data
    }));
  })
  .catch(error => console.error('Error fetching addresses:', error));
};


</script>
