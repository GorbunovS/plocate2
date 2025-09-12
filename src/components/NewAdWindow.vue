<template>

    <div class="flex flex-col items-start gap-4 p-4">
        Описание
        <span class="text-sm text-gray-500 italic">Тип объявления</span>
            <SelectButton :invalid="value === null" v-model="adType" :options="adTypes" optionLabel="name" />
          <span class="text-sm text-gray-500 italic">Тип животного</span>  
            <SelectButton :invalid="value === null"  v-model="petType" :options="petTypes" optionLabel="name" />
                    <SelectButton v-model="value" :options="options" optionLabel="value" dataKey="value" aria-labelledby="custom">
            <template #option="slotProps">
                <i :class="slotProps.option.icon"></i>
            </template>
        </SelectButton>
    </div>


</template>

<script setup>
import { ref } from 'vue';


const src = ref(null); 


const adType = ref(null); 
const petType = ref(null);
const value = ref(null);
const adTypes = ref([
    { name: 'Потерял', value: 1 },
    { name: 'Нашёл', value: 2 },
]);
const petTypes = ref([
    { name: 'Пёс', value: 1 },
    { name: 'Кот', value: 2 },
    
]);
const options = ref([
    { icon: 'pi pi-align-left', value: 'Left' },
    { icon: 'pi pi-align-right', value: 'Right' },
    { icon: 'pi pi-align-center', value: 'Center' },
    { icon: 'pi pi-align-justify', value: 'Justify' }
]);
</script>
