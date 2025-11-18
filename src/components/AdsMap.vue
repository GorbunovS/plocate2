<template>
    <Splitter ref="splitterRef" gutterSize="12" layout="vertical" style="height: 100vh">
        <SplitterPanel ref="topSplit" min-size="20" class="flex items-center justify-center" :size="25">
            <Mapbox :options="mapOptions" style="height: 100vh" @load="onMapLoad">
                <GeoJsonSource :data="geoJsonData">
                    <FillLayer :style="fillStyle" />
                    <CircleLayer :style="circleStyle" />
                </GeoJsonSource>

                <Marker v-for="ad in worldAds" :key="ad.id" :lnglat="[ad.longitude, ad.latitude]">
                    <div @click="scrollToCard(ad.id)" class="marker">
                        <Chip rounded :severity="ad.type === 'lost' ? 'success' : 'warn'"
                            :class="{ 'ring-2 ring-primary': currentCardId === ad.id }">
                            <Tag rounded>
                                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
                            </Tag>
                            <span class="text-sm text-gray-500">{{ getSearchDuration(ad.updated_at) }}</span>
                        </Chip>
                    </div>
                </Marker>

            </Mapbox>

        </SplitterPanel>

        <SplitterPanel min-size="20" :size="70" class="flex flex-col overflow-hidden">
            <div class="w-full h-3 justify-items-center p-1 relative">
                <div class="flex w-10 h-1 rounded bg-gray-50 center-0 "> </div>
            </div>

            <div class="overflow-y-auto flex-1 p-4">

                <div v-for="ad in worldAds" :key="ad.id" :ref="(el) => setCardRef(el, ad.id)">
                    <Card class="mb-4 border border-gray-200 dark:border-gray-600 transition-all cursor-pointer"
                        :class="{ 'bg-gray-100 dark:bg-gray-800 shadow-lg': currentCardId === ad.id }"
                        @click="currentCardId = ad.id">
                        <template #header>
                            <div class="flex items-center justify-between gap-3 px-4 pt-4 pb-3">
                                <div class="flex items-center gap-2">
                                    <Tag rounded :severity="ad.type === 'lost' ? 'success' : 'warn'">
                                        <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
                                    </Tag>
                                    <Tag rounded severity="contrast">
                                        {{ ad.type === 'lost' ? `Потерял ${getAnimalTypeLabel(ad.animal_type)}` : 'Ищет хозяина' }}
                                    </Tag>
                                </div>
                                <span class="text-sm text-gray-500">{{ getSearchDuration(ad.updated_at) }}</span>

                            </div>


                        </template>

                        <template #content>
                            <div class="images-container items-center flex flex-row gap-2 w-full py-2 h-24 overflow-hidden">
                                <Image v-for="image in ad.images" :key="image" :src="image" alt="Image"
                                    class="max-w-18 h-full object-cover flex-1" />
                            </div>

                            <div class="flex items-start mt-2 gap-3">

                                <Avatar
                                    :image="ad.senderAvatar_url || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'"
                                    size="normal" shape="circle" />
                                <p class="text-sm text-left flex-1 ">{{ ad.description }}</p>
                                <Button icon="pi pi-send" class="w-full" />
                            </div>

                        </template>

                        <template #footer>

                            <p class="flex items-center gap-2 text-sm text-gray-500">
                                <i class="pi pi-map"></i>
                                <span class="truncate">{{ ad.address }}</span>
                            </p>

                        </template>
                    </Card>
                </div>
            </div>
        </SplitterPanel>
    </Splitter>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { Button, Avatar, Image, Chip } from 'primevue';
import Card from 'primevue/card';
import { Tag } from 'primevue';
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import { useUserStore } from '../store';
import { storeToRefs } from 'pinia';
import { getAnimalTypeIcon, getAnimalTypeLabel, getSearchDuration } from '../helpers';
import { useTgStore } from '../store';
import {
    Mapbox,
    GeoJsonSource,
    FillLayer,
    CircleLayer,
    Marker
} from 'vue3-maplibre-gl';
import 'vue3-maplibre-gl/dist/style.css';

const currentCardId = ref(null)
const tgStore = useTgStore();

const userStore = useUserStore();
const { worldAds } = storeToRefs(useUserStore());

const cardRefs = ref({})

const splitterRef = ref(null)

const resetToDefaults = () => {
    splitterRef.value?.resetState()
}

const setCardRef = (el, adId) => {
    if (el) {
        cardRefs.value[adId] = el
    }
}

// Функция для скролла к карточке (БЕЗ изменения currentCardId внутри)
const scrollToCard = (adId) => {
    currentCardId.value = adId // Устанавливаем текущую карточку
    resetToDefaults()
    nextTick(() => {
        const cardElement = cardRefs.value[adId]
        if (cardElement) {
            cardElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            })
        }
    })
}

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
    cursor: pointer;
    transition: transform 0.2s;
}

.marker:hover {
    transform: scale(1.1);
}

.popup-content {
    padding: 10px;
    max-width: 200px;
}
</style>
