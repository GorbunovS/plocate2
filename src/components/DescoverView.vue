<template>
    <Alert :message="userLocationError"  severity="danger" />
    <div class="header flex h-full z-10 items-center justify-center">
        {{ ourLocation }}
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
import { onMounted, computed } from 'vue';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import PetCard from './PetCard.vue';
import AdsMap from './AdsMap.vue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { Alert } from 'vue-tg';
import { useLocationManager } from 'vue-tg'

const locationManager = useLocationManager()

const ourLocation = computed(() => locationManager.getLocation );

const userStore = useUserStore();
const { worldAds } = storeToRefs(userStore);




onMounted(() => {
 
    userStore.getAllAds();
});
</script>
