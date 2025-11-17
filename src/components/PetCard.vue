<template>
    <Panel toggleable collapsed>
        <template v-if="ad.type === 'found'" #header>
            <Tag severity="warn" class="mr-2">
                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
            </Tag>
            Ищет хозяина
        </template>
        <template v-if="ad.type === 'lost'" #header>
            <Tag severity="success" class="mr-2">
                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
            </Tag>
             Потерял {{ getAnimalTypeLabel(ad.animal_type) }}
        </template>
        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <OverlayBadge severity="warn" value="0">
                        <Button label="Похожие" />
                    </OverlayBadge>
                </div>
                <span class="text-surface-500 dark:text-surface-400"><i class="pi pi-hourglass"
                        style="font-size: 1rem"></i> {{
                            getSearchDuration(ad.updated_at) }}</span>
            </div>
        </template>
        <Galleria :value="ad.images" :responsiveOptions="responsiveOptions" showThumbnails="false"
            :showItemNavigators="true" :showIndicators="true" :showIndicatorsOnHover="false"
            :changeItemOnIndicatorHover="true" containerStyle="max-width: 560px; height: 300px">
            <template #item="slotProps">
                <img :src="slotProps.item" alt="Image" class="shadow-md rounded-xl w-full h-full object-contain" />
            </template>

            <!-- Кастомный индикатор (кружочки) -->
            <template #indicator="{ index, class: indicatorClass }">
                <button :class="indicatorClass" class="w-2 h-2 rounded-full"></button>
            </template>
        </Galleria>
        <div class="flex flex-wrap mt-4 items-center gap-4">
            <Avatar
                :image="tgStore.userAvatar || 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'"
                size="normal" shape="circle"> </Avatar>
            <span class="text-sm">{{ ad.description }}</span>
        </div>
        <template #icons>
            <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
            <Menu ref="menu" id="config_menu" :model="items" popup />
        </template>
    </Panel>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import Button from 'primevue/button'
import { Menu } from 'primevue';
import { Tag, OverlayBadge } from 'primevue';
import { Panel } from 'primevue';
import { Avatar } from 'primevue';
import Galleria from 'primevue/galleria';
import { useTgStore } from '../store';

const tgStore = useTgStore();
const menu = ref(null);

const items = ref([

    {
        label: 'Редактировать',
        icon: 'pi pi-pen-to-square'
    },
    {
        separator: true
    },
    {
        label: 'Удалить',
        icon: 'pi pi-times',
        command: () => {
            emit('stop-search', props.ad.id)
        }
    }
]);

const toggle = (event) => {
    menu.value.toggle(event);
};


const props = defineProps({
    ad: {
        type: Object,
        required: true,
        validator: (value) => value && value.id !== undefined
    }
})

const emit = defineEmits(['view-similar', 'stop-search'])

const responsiveOptions = ref([
    { breakpoint: '1024px', numVisible: 5 },
    { breakpoint: '768px', numVisible: 3 },
    { breakpoint: '560px', numVisible: 1 }
]);
const getAnimalTypeIcon = (type) => {
    const labels = {
        dog: 'las la-dog',
        cat: 'las la-cat',
        other: 'las la-paw',
    }
    return labels[type] || type
}
const getAnimalTypeLabel = (type) => {
    const labels = {
        dog: 'собаку',
        cat: 'кошку',
        other: 'петомца',
    }
    return labels[type] || type
}


const getAdTypeLabel = (type) => {
    const labels = {
        found: "Потерял",
        lost: "Ищет хозяина",

    }
    return labels[type] || type
}

const getSearchDuration = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date

    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(hours / 24)

    if (days > 0) {
        return `${days}д ${hours % 24}ч`
    }
    return `${hours}ч`
}

const viewSimilar = () => {
    emit('view-similar', props.ad.id)
}


</script>

<style scoped>
:deep(.p-button) {
    border: none;
}

:deep(.p-button:focus) {
    box-shadow: none;
}
</style>
