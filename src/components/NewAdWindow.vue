<template>
  <Dialog :position="'bottom'" class="w-full h-full" :style="{ maxHeight: '100vh' }" :modal="true"
    v-model:visible="showMap" @click="handleOutsideClick">
    <GetCoordWindow :my-coord="[ourLocation.longitude, ourLocation.latitude]" />
  </Dialog>

  <div class="header flex h-18 z-10 items-center justify-center"></div>

  <div class="card">
    <ProgressBar style="height: 15px" :value="currentStep===3?100:((currentStep/3)*100)"> {{ currentStep }}/3 </ProgressBar>
  </div>

  <Confirm v-if="confirm" message="Закрывая эту страницу вся информация сбросится" @close="back()" />

  <div class="h-screen w-full h-[vh60] flex flex-col overflow-auto bg-surface-ground dark:bg-surface-800">
    <BackButton @click="confirm = true" />
    <Dialog :position="'bottom'" class="w-full h-full" :style="{ maxHeight: '100vh' }" :modal="true"
      v-model:visible="mapIsOpen" @click="handleOutsideClick">
      <MapVew class="h-full w-full" :user-location="[ourLocation.latitude, ourLocation.longitude]"
        @save-location="saveLocation" @close-dialog="mapIsOpen = false" @click="handleOutsideClick" />
    </Dialog>

    <Card style="margin: 2rem;" v-if="currentStep === 1">
      <template #title>Объявление</template>
      <template #content>
        <div class=" flex justify-center flex-col p-4  gap-4 overflow-y-auto" @click="handleOutsideClick">
          <Alert v-if="showAlert" :message="alertMsg" @click.stop />
          <span class="text-sm text-gray-500 italic">Тип объявления</span>
          <SelectButton :invalid="adType === null" v-model="adType" :options="adTypes" optionLabel="name" @click.stop />
          <span class="text-sm text-gray-500 italic">Тип животного</span>
          <SelectButton :invalid="petType === null" v-model="petType" :options="petTypes" optionLabel="name"
            dataKey="value" aria-labelledby="custom" @click.stop>
            <template #option="slotProps">
              <i :class="slotProps.option.icon"></i>
              <span class="ml-2">{{ slotProps.option.name }}</span>
            </template>
          </SelectButton>
          <span class="text-sm text-gray-500 italic">Изображение (Добавьте до 3)</span>
          
          <!-- ИСПРАВЛЕНО: используем previewImages -->
          <div class="flex flex-row gap-2 h-24 w-full overflow-x-auto">
            <div v-for="(img, index) in previewImages" :key="`img-${index}`" class="relative flex-shrink-0 w-24">
              <img :src="img" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" @click.stop />
              <Button icon="pi pi-trash" severity="danger" text @click="removeImage(index)"
                class="absolute top-0 right-0 text-xs" />
            </div>
            
            <!-- ИСПРАВЛЕНО: условие на previewImages -->
            <div v-if="previewImages.length < 3"
              class="shadow-md rounded-xl w-24 h-full bg-gray-800 dark:bg-gray-700 flex items-center justify-center cursor-pointer"
              @click="openFileInput">
              <i class="pi pi-plus text-gray-500 text-2xl"></i>
            </div>
          </div>
          <input type="file" ref="fileInput" @change="onFileSelect" accept="image/*" class="hidden" />

        </div>
      </template>
    </Card>

    <Card style="margin: 2rem;" v-if="currentStep === 2">
      <template #title>Место</template>
      <template #content>
        <div class="text-sm flex flex-col justify-center p-4  center gap-4 overflow-y-auto">
          <p>Поделитесь местом утери/обнаружения питомца</p>
          <AutoComplete v-model="status" :suggestions="filteredAddresses" @complete="userStore.searchAddresses($event)"
            optionLabel="name" @focus="handleInputFocus" @blur="handleInputBlur" placeholder="Введите адрес" />
        </div>
        <!-- <Button @click="showMap = true" label="Или поделись геопозицией" icon="pi pi-map-marker"></Button> -->
      </template>
    </Card>

    <Card style="margin: 2rem;" v-if="currentStep === 3">
      <template #title>Дополнительная информация</template>
      <template #content>
        <div v-if="currentStep === 3" class=" flex justify-center flex-col p-4  gap-4 overflow-y-auto"
          @click="handleOutsideClick">
          <span class="text-sm text-center text-gray-300">
            Постарайтесь как можно подробнее описать обстоятельства и животное для более качественного поиска
          </span>
          <Textarea placeholder="Начните с клички питомца" v-model="description" rows="5" cols="30" :autoResize="true"
            class=" h-24 border-1 text-xs p-2 rounded-md border-gray-400 dark:border-gray-600" @focus="handleInputFocus"
            @blur="handleInputBlur" />

          <span class="text-lm"> Фактическое(предполагаемое) время пропажи</span>
          <Calendar v-model="factual" showTime showOtherMonths dateFormat="dd.mm.yy" :showIcon="true"
            @focus="handleInputFocus" @blur="handleInputBlur" />
        </div>
      </template>
    </Card>
  </div>
  <div
    class="fixed bottom-0 left-0 pb-5 gap-4 right-0 backdrop-blur z-20 bg-surface-card dark:bg-surface-700 border-t min-h-16 border-gray-200 dark:border-gray-600 flex justify-between items-center px-4 py-2">
    <Button @click="back" icon="pi pi-angle-left" label="Назад" severity="secondary" variant="outlined"
      class="w-full sm:w-auto" />
    <Button :label="currentStep >= 3 ? 'Сохранить' : 'Далее'" severity="success"
      @click="currentStep === 3 ? saveAd() : currentStep = currentStep + 1" variant="outlined"
      class="w-full sm:w-auto" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia'
import MapVew from './MapVew.vue';
import { useUserStore } from '../store';
import { Alert } from 'vue-tg';
import { BackButton } from 'vue-tg'
import { Card, AutoComplete, ProgressBar } from 'primevue';
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
import { Confirm } from 'vue-tg';
import GetCoordWindow from './GetCoordWindow.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const confirm = ref(false);
const tgStore = useTgStore();
const user_id = computed(() => tgStore.userId);
const showMap = ref(false);

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
const adType = ref(null);
const petType = ref(null);
const fileInput = ref(null);
const location = ref(null);

// STATES
const rawFiles = ref([]);
const previewImages = ref([]);
const imageUrls = ref([]);
const isUploading = ref(false);

const onFileSelect = async (event) => {
  const file = event.target.files[0];
  if (!file) return;
  if (previewImages.value.length >= 3) return;

  rawFiles.value.push(file);
  const currentIndex = rawFiles.value.length - 1;
  imageUrls.value.push(null);

  const reader = new FileReader();
  reader.onload = (e) => {
    previewImages.value.push(e.target.result);
  };
  reader.readAsDataURL(file);

  try {
    isUploading.value = true;
    const url = await userStore.uploadImage(file);
    imageUrls.value[currentIndex] = url;
    console.log('URL:', url);
  } catch (e) {
    console.error(e);
    showTemporaryAlert('Error uploading image');
    removeImage(currentIndex);
  } finally {
    if (!imageUrls.value.includes(null)) isUploading.value = false;
    event.target.value = '';
  }
};

const removeImage = (index) => {
  previewImages.value.splice(index, 1);
  rawFiles.value.splice(index, 1);
  imageUrls.value.splice(index, 1);
};

const saveAd = async () => {
  if (imageUrls.value.includes(null) || isUploading.value) {
    showTemporaryAlert('Wait for images to upload...');
    return;
  }

  if (adType.value && petType.value) {
    const ad = {
      userId: user_id.value || 0,
      userName: tgStore.userName || 'unknown',
      adType: adType.value.value,
      petType: petType.value.value,
      images: imageUrls.value,
      userAvatar: tgStore.userAvatar || "null",
      phoneNumber: "",
      location: {
        name: status.value.name,
        coordinates: { latitude: status.value.data.geo_lat, longitude: status.value.data.geo_lon } || null
      },
      location2: selectedAddress.value,
      description: description.value,
      detected: detected.value,
      factual: factual.value,
      sender_avatar_url: tgStore.userAvatar
    };

    await userStore.createNewAd(ad, rawFiles.value);
  }
};

const back = () => {
  if (currentStep.value > 1) {
    currentStep.value--;
  }
  else router.push('/');
}

const saveLocation = async ({ center }) => {
  try {
    const [lat, lon] = center;
    const address = await userStore.addressByCoordinates({ lat, lon });
    if (address) {
      adress.value = address;
    }
    closeMap();
  } catch (error) {
    console.error(error);
  }
};

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
      isLocationManagerMounted();
    } catch (err) {
      locationManagerMountError();
      showTemporaryAlert('Location manager error' + err.message);
      isLocationManagerMounting();
      isLocationManagerMounted();
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
  }, 3000);
};

const openFileInput = () => {
  fileInput.value.click();
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
