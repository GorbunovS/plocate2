<template>
    <Splitter layout="vertical" style="height: 100vh">
        <SplitterPanel class="flex items-center justify-center" :size="30">
            <Mapbox :options="mapOptions" style="height: 100vh" @load="onMapLoad">
                <GeoJsonSource :data="geoJsonData">
                    <FillLayer :style="fillStyle" />
                    <CircleLayer :style="circleStyle" />
                </GeoJsonSource>

                <Marker v-for="(ad, index) in worldAds" :key="ad.id" :lnglat="[ad.longitude, ad.latitude]">
                    <div class="marker">
                        <Button :label="ad.id" icon="pi pi-map-marker" @click="togglePopover(index, $event)"
                            severity="secondary" rounded />
                    </div>
                </Marker>

            </Mapbox>
        </SplitterPanel>
        <SplitterPanel :size="70" class="flex flex-col overflow-hidden">
            <div class="w-full h-full overflow-y-auto">
                <div v-for="(ad, id) in worldAds" :key="ad.id">
                    <Card class="mb-4 pt-4 border border-gray-200 dark:border-gray-600">
                        <template #header > <div class="flex pl-4 pr-4 flex-wrap  items-center justify-between gap-4">
                             <Tag rounded :severity="ad.type === 'lost' ? 'success' : 'warn'" class="mr-2">
                                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
                                </Tag>
                                <Tag rounded severity="contrast" v-if="ad.type === 'lost'">Потерял {{ getAnimalTypeLabel(ad.animal_type) }}</Tag>
                                <Tag rounded  severity="contrast" v-if="ad.type === 'found'">Ищет хозяина</Tag>
                                {{ getSearchDuration(ad.updated_at) }}
                                </div>
                             <Galleria :value="ad.images" :responsiveOptions="responsiveOptions" :numVisible="5" :circular="true" containerStyle="max-width: 340px"
    :showItemNavigators="true" :showThumbnails="false">
            <template #item="slotProps">
                <img :src="slotProps.item" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" />
            </template>
            <template #caption="slotProps">
        <Avatar
                :image="tgStore.userAvatar || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'"
                size="normal" shape="circle"> </Avatar> {{ ad.description }}
    </template>

        </Galleria>
                           
                        </template>
                        <template #content> </template>
                        <template #footer>
                            <div class="flex flex-wrap  gap-4">
                               
                                <div class="w-full p-2">
                                  
                                    <p class="truncate text-sm text-gray-500"><i class="pi pi-map text-sm text-gray-500"></i> {{ ad.address }}</p>
                                   
                                </div>
                            </div>
                        </template>
                    </Card>
                </div>
            </div>
        </SplitterPanel>
    </Splitter>

</template>

<script setup>
import { ref, defineProps, onMounted } from 'vue';
import { Button, Avatar, Galleria } from 'primevue';
import Card from 'primevue/card';
import { Tag } from 'primevue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import { getAnimalTypeIcon, getAnimalTypeLabel, getSearchDuration } from '../helpers';
import { useTgStore } from '../store';

const tgStore = useTgStore();

const userStore = useUserStore();
const { worldAds } = storeToRefs(useUserStore());

const responsiveOptions = ref([
    {
        breakpoint: '1300px',
        numVisible: 4
    },
    {
        breakpoint: '575px',
        numVisible: 1
    }
]);

const props = defineProps({

    center: {
        type: Array,
        default: [0, 0]
    }

})




import {
    Mapbox,
    GeoJsonSource,
    FillLayer,
    CircleLayer,
    Marker
} from 'vue3-maplibre-gl';

import 'vue3-maplibre-gl/dist/style.css';

const popoverRefs = ref([]);

const togglePopover = (index, event) => {
    popoverRefs.value[index]?.toggle(event);
};

const mapOptions = ref({
    style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=g7cM1vMR1viO2I3YInIA',
    center: [37.6156, 55.7522], //Москва
    zoom: 10,
});

const geoJsonData = ref({
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [0, 0] },
            properties: { name: 'Sample Point' },
        },
    ],
});

const fillStyle = ref({
    'fill-color': '#088',
    'fill-opacity': 0.8,
});

const circleStyle = ref({
    'circle-radius': 6,
    'circle-color': '#007cbf',
});

const showPopup = ref(true);

function onMapLoad(map) {
    console.log('Map loaded:', map);
}

onMounted(() => {
    userStore.getAllAds();
});
</script>

<style>
.maplibregl-ctrl {
    display: none;
}

.marker {
    font-size: 24px;
    cursor: pointer;
}

.popup-content {
    padding: 10px;
    max-width: 200px;
}
</style>