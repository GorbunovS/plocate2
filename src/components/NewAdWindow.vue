<template>
  <div class="h-screen w-full flex flex-col overflow-auto bg-surface-ground dark:bg-surface-800">
    <!-- Диалог карты: полноэкранный для мобильных -->
    <Dialog :position="'bottom'" class="w-full h-full" :style="{ maxHeight: '100vh' }" :modal="true"
      v-model:visible="mapIsOpen" @click="handleOutsideClick">
      <MapVew class="h-full w-full" :user-location="[ourLocation.latitude, ourLocation.longitude]"
        @save-location="saveLocation" @close-dialog="mapIsOpen = false" @click="handleOutsideClick" />
    </Dialog>

    <!-- Контент шагов: скролл внутри, без сдвига viewport -->
    <div v-if="currentStep === 1" class="flex-1 flex flex-col p-4 items-start gap-4 overflow-y-auto"
      @click="handleOutsideClick">
      <Alert v-if="showAlert" :message="alertMsg" @click.stop />
      <span class="text-sm text-gray-500 italic">Тип объявления</span>
      <SelectButton :invalid="adType === null" v-model="adType" :options="adTypes" optionLabel="name" @click.stop />
      <span class="text-sm text-gray-500 italic">Тип животного</span>
      <SelectButton :invalid="petType === null" v-model="petType" :options="petTypes" optionLabel="name" dataKey="value"
        aria-labelledby="custom" @click.stop>
        <template #option="slotProps">
          <i :class="slotProps.option.icon"></i>
          <span class="ml-2">{{ slotProps.option.name }}</span>
        </template>
      </SelectButton>
      <span class="text-sm text-gray-500 italic">Изображение (Добавьте до 3)</span>
      <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
        <div v-for="(img, index) in images" :key="`img-${index}`" class="relative flex-shrink-0 w-24">
          <img :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" @click.stop />
          <Button icon="pi pi-trash" severity="danger" text @click="removeImage(index)"
            class="absolute top-0 right-0 text-xs" />
        </div>
        <div v-if="images.length < 3"
          class="shadow-md rounded-xl w-24 h-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
          @click="openFileInput">
          <i class="pi pi-plus text-gray-500 text-2xl"></i>
        </div>
      </div>
      <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" class="hidden" />
      <span class="text-sm text-gray-500 italic">Место</span>
      <Chip :label="selectedAddress || 'Адресс не выбран'" icon="pi pi-map-marker" />
      <Button @click="openMap" icon="pi pi-map" label="Поделитесь местоположением" severity="success" variant="outlined"
        class="w-full" />
      <div class="w-full text-center text-sm text-gray-500">{{ adress }}</div>
      <FloatLabel class="w-full" variant="in">
        <AutoComplete v-model="status" :suggestions="filteredAddresses" @complete="userStore.searchAddresses($event)"
          optionLabel="name" class="w-full" @focus="handleInputFocus" @blur="handleInputBlur" />
        <label for="username">Или введите адрес</label>
      </FloatLabel>
    </div>

    <div v-if="currentStep === 2" class="flex-1 flex flex-col p-4 items-start gap-4 overflow-y-auto"
      @click="handleOutsideClick">
      <span class="text-lm">Опишите ситуацию</span>
      <span class="text-sm text-left text-gray-300">
        Постарайтесь как можно подробнее описать обстоятельства и животное для более качественного поиска
      </span>
      <Textarea v-model="description" rows="5" cols="30" :autoResize="true"
        class="w-full h-24 border-1 text-xs p-2 rounded-md border-gray-400 dark:border-gray-600"
        @focus="handleInputFocus" @blur="handleInputBlur" />
      <span class="text-lm"> Время обнаружения пропажи</span>
      <Calendar class="w-full" v-model="detected" showTime showOtherMonths dateFormat="dd.mm.yy" :showIcon="true"
        @focus="handleInputFocus" @blur="handleInputBlur" />
      <span class="text-lm"> Фактическое(предполагаемое) время пропажи</span>
      <Calendar class="w-full" v-model="factual" showTime showOtherMonths dateFormat="dd.mm.yy" :showIcon="true"
        @focus="handleInputFocus" @blur="handleInputBlur" />
    </div>


  </div>
  <div
    class="fixed bottom-0 left-0 gap-4 right-0 backdrop-blur z-20 bg-surface-card dark:bg-surface-700 border-t min-h-16 border-gray-200 dark:border-gray-600 flex justify-between items-center px-4 py-2">
    <Button @click="back" icon="pi pi-angle-left" label="Назад" severity="secondary" variant="outlined"
      class="w-full sm:w-auto" />
    <Button :label="currentStep === 2 ? 'Сохранить' : 'Далее'" severity="success"
      @click="currentStep === 2 ? saveAd() : currentStep = 2" variant="outlined" class="w-full sm:w-auto" />
    
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

import { storeToRefs } from 'pinia'
import MapVew from './MapVew.vue';
import { useUserStore } from '../store';
import { Alert } from 'vue-tg';
import {
  mountLocationManager,
  isLocationManagerMounting,
  isLocationManagerMounted,
  locationManagerMountError,
  requestLocation
} from '@telegram-apps/sdk';
import { Dialog } from 'primevue';
import { Calendar } from 'primevue';
import Textarea from 'primevue/textarea';
import { useTgStore } from '../store';

const tgStore = useTgStore();
const user_id = computed(() => tgStore.userId);


const currentStep = ref(1);

const userStore = useUserStore();
const adress = ref('');
const mapIsOpen = ref(false);
const ourLocation = ref({});
const { filteredAddresses } = storeToRefs(userStore)
const { selectedAddress } = storeToRefs(userStore)
const detected = ref(null);
const factual = ref(null);
const description = ref('');



const status = ref('');
const alertMsg = ref('');
const showAlert = ref(false);

// const miniApp = useMiniApp();
// const locationManager = useLocationManager();
const adType = ref(null);
const petType = ref(null);
const images = ref([]);
const fileInput = ref(null);
const imageUrls = ref([]);
const location = ref(null); // Для хранения координат

const saveAd = async () => {
  if (adType.value && petType.value) {
    const ad = {
      userId: user_id.value || 0,
      userName: tgStore.username || 'unknown',
      adType: adType.value.value,
      petType: petType.value.value,
      images: imageUrls.value,
      location: {
        name: status.value.name,
        coordinates: { latitude: status.value.data.geo_lat, longitude: status.value.data.geo_lon } || null
      },
      location2: selectedAddress.value,
      description: description.value,
      detected: detected.value,
      factual: factual.value,
    };
    await userStore.createNewAd(ad);

  }
};


const back = () => {
  if (currentStep.value === 1) {
    emit('back');
  } else {
    currentStep.value = 1;
  }
}


const saveLocation = async ({ center }) => {
  try {
    const [lat, lon] = center;
    const address = await userStore.addressByCoordinates({ lat, lon });
    if (address) {
      adress.value = address;
      console.log('Сохранённый адрес:', adress.value);
    } else {
      console.warn('Адрес не найден');
    }
    closeMap();
  } catch (error) {
    console.error('Ошибка сохранения адреса:', error);
  }
};
// Функции для управления картой
const openMap = () => {
  mapIsOpen.value = true;
};

const closeMap = () => {
  mapIsOpen.value = false;
};
const DEFAULT_CENTER = { latitude: 55.751244, longitude: 37.618423 };


const userLocation = async () => {
  if (mountLocationManager.isAvailable()) {
    ourLocation.value = DEFAULT_CENTER;
    try {
      const promise = mountLocationManager();
      isLocationManagerMounting();
      await promise;
      const location = await requestLocation();
      ourLocation.value = {
        latitude: location.latitude,
        longitude: location.longitude
      }
      isLocationManagerMounted(); // true
    } catch (err) {
      locationManagerMountError(); // equals "err"
      showTemporaryAlert('Location manager mount error' + err.message);
      isLocationManagerMounting(); // false
      isLocationManagerMounted(); // false
    }
  }
  else {
    showTemporaryAlert('Location manager is not available');
  }
}


const emit = defineEmits(['back', 'next']);
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

const uploudNewImage = async (file) => {
  const imageUrl = await userStore.uploadImage(file);
  imageUrls.value.push(imageUrl);
  console.log('Uploaded URL:', imageUrls);

}



const onFileSelect = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (images.value.length >= 3) return; // Лимит
  const reader = new FileReader();

  uploudNewImage(file);
  reader.onload = (e) => {
    images.value.push(e.target.result);
    event.target.value = '';
  };
  reader.readAsDataURL(file);
};

const removeImage = (index) => {
  images.value.splice(index, 1);
  imageUrls.value.splice(index, 1);
};

const adTypes = ref([
  { name: 'Потерял', value: 'lost' },
  { name: 'Нашёл', value: 'found' },
]);

const petTypes = ref([
  { name: 'Собаку', value: 'dog', icon: 'las la-dog' },
  { name: 'Кошку', value: 'cat', icon: 'las la-cat' },
]);


onMounted(() => {
  userLocation();

});
</script>