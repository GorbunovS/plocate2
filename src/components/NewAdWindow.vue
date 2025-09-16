<template>
  <div v-if="mapIsOpen" class="fixed inset-0 z-50 flex items-center justify-center" @click="closeMap">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out"></div>
    <div class="relative w-[min(90vw,900px)] h-[min(90vh,70vh)] bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden
             transform transition-all duration-300 ease-out" @click.stop>
      <MapVew 
        :user-location="['33.456', '44.123']"
         />
     <button @click="closeMap" class="absolute top-4 right-4  z-1000">✕</button>
    </div>
    <div class="absolute bottom-4 left-1/2 -translate-x-1/2">
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
      <AutoComplete v-model="status" :suggestions="filteredAddresses" @complete="userStore.searchAddresses($event)" optionLabel="name"
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
import { storeToRefs } from 'pinia'
import MapVew from './MapVew.vue';
import { useUserStore } from '../store';
import { useMiniApp, Alert, useLocationManager } from 'vue-tg';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  requestLocation
} from '@telegram-apps/sdk';

const userStore = useUserStore();
const mapIsOpen = ref(false);
const ourLocation = ref({});
const { filteredAddresses } = storeToRefs(userStore)

const ourLocationCoords = ref([null, null]);



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


onMounted(() => {
  userLocation();

});
</script>