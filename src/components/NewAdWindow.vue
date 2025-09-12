<template>
  <div class="flex flex-col items-start gap-4">
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
    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" chooseLabel="Выбрать фото" class="w-full" />
    <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
      <div v-for="(img, index) in images" :key="index" class="relative flex-shrink-0 w-24">
        <div v-if="!img" class="shadow-md rounded-xl w-full h-full bg-gray-200 flex items-center justify-center">
          <i class="pi pi-image text-gray-500 text-2xl"></i>
        </div>
        <img v-else :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" style="filter: grayscale(100%)" />
        <Button v-if="img" icon="pi pi-trash" severity="danger" text @click="removeImage(index)" class="absolute top-0 right-0 text-xs" />
      </div>
    </div>
    
    <span class="text-sm text-gray-500 italic">Место</span>
    <Button icon="pi pi-map-marker" label="Указать на карте" severity="success" variant="outlined" class="w-full" />
    <FloatLabel>
      <AutoComplete v-model="address" :suggestions="filteredAddresses" @complete="searchAddresses" optionLabel="name" class="w-full" />
      <label for="username">Или введите адрес</label>
    </FloatLabel>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const adType = ref(null);
const petType = ref(null);
const address = ref(null);
const filteredAddresses = ref([]);

const images = ref([null, null, null]);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        // Находим первый пустой слот и вставляем
        for (let i = 0; i < images.value.length; i++) {
            if (images.value[i] === null) {
                images.value[i] = e.target.result;
                break;
            }
        }
    };

    reader.readAsDataURL(file);
}

const removeImage = (index) => {
    images.value[index] = null;
};

const adTypes = ref([
    { name: 'Потерял', value: 1 },
    { name: 'Нашёл', value: 2 },
]);

const petTypes = ref([
    { name: '', value: 1, icon: 'las la-dog' },
    { name: '', value: 2, icon: 'las la-cat' },

]);

const searchAddresses = (event) => {
    const query = event.query;
    const token = 'a2c3836e1483440a86077f7d23c169405924ddc6'; // Вставьте ваш секретный ключ сюда

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
                data: suggestion.data
            }));
        })
        .catch(error => console.error('Error fetching addresses:', error));
};
</script>
