<template>
  <Panel toggleable>
 <template #header>
 <img class="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center " :src="ad.images[0]"/>
  {{ ad.type }} {{ getAnimalTypeLabel(ad.animal_type) }}
 </template>
    <template #footer>
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-2">
                <Button icon="pi pi-trash" rounded text></Button>
               <Button >Похожие</Button>
            </div>
     
            <span class="text-surface-500 dark:text-surface-400">Поиск ведётся:{{ getSearchDuration(ad.updated_at) }}</span>
        </div>
    </template>
    <template #icons>
        <Button icon="pi pi-cog" severity="secondary" rounded text @click="toggle" />
        <Menu ref="menu" id="config_menu" :model="items" popup />
    </template>


     <p class="m-0">
    {{ ad.description }}
    </p>
  </Panel>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import Button from 'primevue/button'
import {Menu} from 'primevue';
import Card from 'primevue/card';
import {Panel}  from 'primevue';
import {Image} from 'primevue';


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
    dog: 'Собака',
    cat: 'Кот',
    rabbit: 'Кролик',
    bird: 'Птица',
    other: 'Другое'
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

const stopSearch = () => {
  emit('stop-search', props.ad.id)
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
