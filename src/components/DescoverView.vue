<template>
    <Alert 
        v-if="userLocationError" 
        :message="userLocationError"  
        severity="danger" 
        class="fixed top-4 left-4 right-4 z-50 max-w-md"
    />
    
    <div class="header flex h-full z-10 items-center justify-center">
        <span v-if="ourLocation">
            📍 {{ ourLocation.latitude.toFixed(4) }}, {{ ourLocation.longitude.toFixed(4) }}
        </span>
        <span v-else class="text-gray-500">
            Получение геопозиции...
        </span>
    </div>
    
    <Splitter class="pb-10 h-full" style="height: 100vh" layout="vertical">
        <SplitterPanel :minSize="25">
            <AdsMap 
                v-if="ourLocation"
                :center="ourLocation" 
                :ads="worldAds" 
            />
            <div v-else class="flex items-center justify-center h-full text-gray-500">
                Карта загружается...
            </div>
        </SplitterPanel>
        
        <SplitterPanel :minSize="35" class="flex flex-col overflow-hidden">
            <div class="w-full h-full overflow-y-auto">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-2">
                    <PetCard 
                        v-for="ad in worldAds" 
                        :key="ad.id" 
                        :ad="ad" 
                        @stop-search="userStore.deleteThisAd(ad.id)" 
                    />
                </div>
            </div>
        </SplitterPanel>
    </Splitter>
</template>

<script setup>
import { onMounted,  ref } from 'vue';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';
import AdsMap from './AdsMap.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { Alert } from 'vue-tg';
import { useLocationManager } from 'vue-tg';

const locationManager = useLocationManager();
const userStore = useUserStore();
const { worldAds } = storeToRefs(userStore);

// Состояние для геопозиции и ошибок
const ourLocation = ref(null);
const userLocationError = ref('');

// Функция для получения геопозиции
const getLocation = () => {
    userLocationError.value = ''; // Очищаем ошибку перед новой попыткой
    
    if (!navigator.geolocation) {
        userLocationError.value = '❌ Геолокация не поддерживается вашим браузером';
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            // Успешное получение позиции
            ourLocation.value = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            userLocationError.value = ''; // Очищаем ошибку при успехе
        },
        (error) => {
            // Обработка ошибок
            let errorMessage = '❌ Ошибка при получении геопозиции: ';
            
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Доступ к геолокации запрещён';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Информация о геопозиции недоступна';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Время ожидания истекло';
                    break;
                default:
                    errorMessage += 'Неизвестная ошибка';
            }
            
            userLocationError.value = errorMessage;
            console.error(error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
};

onMounted(() => {
    // Получаем геопозицию
    getLocation();
    
    // Загружаем объявления
    userStore.getAllAds();
});
</script>

<style scoped>
/* Дополнительные стили если нужны */
</style>
