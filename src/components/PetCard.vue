<template>
    <Panel v-if="ad.type === 'lost'" toggleable collapsed>
        <template #header>
            <Badge severity="success" class="mr-2">

                <i class="text-xl" :class="getAnimalTypeLabel(ad.animal_type)"></i>
            </Badge>
            {{ getAdTypeLabel(ad.type) }}
        </template>
        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <Button>Похожие</Button>

                </div>
                <span class="text-surface-500 dark:text-surface-400"><i class="pi pi-hourglass"
                        style="font-size: 1rem"></i> {{
                            getSearchDuration(ad.updated_at) }}</span>
            </div>
        </template>
        <div class="flex gap-4 justify-start p-2">
                  <div class="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-xl  rounded-bl-none">
                    <AvatarGroup>
            <Avatar  :image="ad.images[0]" size="xlarge" shape="circle" class="flex-shrink-0" />
      </AvatarGroup>
                <p class="m-0 text-sm">{{ ad.description }}</p>
            </div>
        </div>
        <template #icons>
            <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
            <Menu ref="menu" id="config_menu" :model="items" popup />
        </template>
    </Panel>
    <Panel v-if="ad.type === 'found'" toggleable collapsed>
        <template #header>
            <Chip class="py-0 pl-0 pr-4" :label="getAnimalTypeLabel(ad.animal_type)" :image="ad.images[0]" />
            {{ getAdTypeLabel(ad.type) }}
        </template>
        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <Button>Похожие</Button>

                </div>
                <span class="text-surface-500 dark:text-surface-400"><i class="pi pi-hourglass"
                        style="font-size: 1rem"></i> {{
                            getSearchDuration(ad.updated_at) }}</span>
            </div>
        </template>
        <div class="flex justify-start p-2">
            <div class="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-xl shadow-md rounded-bl-none">
                <p class="m-0 text-sm">{{ ad.description }}</p>
            </div>
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
import { Badge } from 'primevue';
import { Panel } from 'primevue';
// import { Image } from 'primevue';
import { Avatar } from 'primevue';
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

const getAnimalTypeLabel = (type) => {
    const labels = {
        dog: 'las la-dog',
        cat: 'las la-cat',
        other: 'las la-paw',
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
