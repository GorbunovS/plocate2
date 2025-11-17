<template>
    <div class="header flex h-full z-10 items-center justify-center">
    </div>
    
    <Splitter class="pb-10 h-full" style="height: 100vh" layout="vertical">
        <SplitterPanel :minSize="25">
            <AdsMap :center="ourLocation" :ads="worldAds" />
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
import { onMounted, ref } from 'vue';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';
import AdsMap from './AdsMap.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import {
    mountLocationManager,
    requestLocation
} from '@telegram-apps/sdk';


const userStore = useUserStore();
const { worldAds } = storeToRefs(userStore);

const ourLocation = ref([55.751244, 37.618423]); 

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
      isLocationManagerMounting(); // false
      isLocationManagerMounted(); // false
    }
  }
  else {
    
  }
}


onMounted(() => {
    userLocation();
    userStore.getAllAds();
});
</script>
