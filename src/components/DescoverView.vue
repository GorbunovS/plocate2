<template>
    <div class="header flex h-25 z-10 items-center justify-center">
    </div>
    <Splitter layout="vertical">
        <SplitterPanel :size="30">
           <AdsMap class="h-full"/>
        </SplitterPanel>
        <SplitterPanel :size="70">
            <div class="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2" v-if="worldAds">
                <PetCard v-for="ad in worldAds" :key="ad.id" :ad="ad" @stop-search="userStore.deleteThisAd(ad.id)" />
            </div>
        </SplitterPanel>
    </Splitter>


</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';
import AdsMap from './AdsMap.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import {
    mountLocationManager,
    isLocationManagerMounting,
    isLocationManagerMounted,
    locationManagerMountError,
    requestLocation
} from '@telegram-apps/sdk';

const ourLocation = ref({});
const userStore = useUserStore();
const { worldAds } = storeToRefs(userStore);
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
            isLocationManagerMounting();
            isLocationManagerMounted();
        }
    }
    else {
        ourLocation.value = DEFAULT_CENTER;
    }
}

onMounted(() => {
    userLocation();
    userStore.getAllAds();
});
</script>
