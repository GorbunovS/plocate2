<template>
    <Panel v-if="ad.type === 'lost'" toggleable collapsed>

        <template #header>
            <Tag severity="success" class="mr-2">

                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
            </Tag>
            {{ getAdTypeLabel(ad.type) }}
        </template>
        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <OverlayBadge severity="warn" value="0" >
                    <Button label="Похожие" />
                    </OverlayBadge>
                </div>
                <span class="text-surface-500 dark:text-surface-400"><i class="pi pi-hourglass"
                        style="font-size: 1rem"></i> {{
                            getSearchDuration(ad.updated_at) }}</span>
            </div>
        </template>
        <div class="flex gap-4 justify-start p-2">
                  <div class="max-w-xs p-4 bg-gray-100 dark:bg-gray-700 rounded-xl  rounded-bl-none">
<AvatarGroup>
  <Avatar 
    v-for="image in ad.images" 
    :key="image"
    :image="image" 
    size="xlarge" 
    shape="circle" 
    ariaLabelledby
  />
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
            <Tag severity="warn" class="mr-2">
                <i class="text-xl" :class="getAnimalTypeIcon(ad.animal_type)"></i>
            </Tag>
          Потерял {{ getAnimalTypeLabel(ad.animal_type) }}
        </template>
        <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
                <div class="flex items-center gap-2">
                    <OverlayBadge severity="warn" value="0" >
                    <Button label="Похожие" />
                    </OverlayBadge>
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
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue'
import Button from 'primevue/button'
import { Menu } from 'primevue';
import { Tag, OverlayBadge } from 'primevue';
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
