<template>
<div class="grid">
      <div class="card flex justify-center">
        Фотография
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
         <img v-if="src" :src="src" alt="Image"  chooseLabel="RTR" class="shadow-md rounded-xl w-full sm:w-64" style="filter: grayscale(100%)" />
    </div>
    Тип
     <div class="card flex justify-center">
        <SelectButton v-model="value" :options="options" optionLabel="name"  />
    </div>
</div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

const src = ref<string | null>(null); // Явный тип: string (для Data URL) или null

function onFileSelect(event: { files: File[] }) { // Тип для event (из PrimeVue FileUpload)
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e: ProgressEvent<FileReader>) => { // Тип события для onload
        // Проверка на null и тип результата (string для Data URL)
        if (e.target && typeof e.target.result === 'string') {
            src.value = e.target.result;
        } else {
            src.value = null;
        }
    };

    reader.readAsDataURL(file);
}

const value = ref<number | null>(null); // Тип value на основе options (number или null)
const options = ref([
    { name: 'Потерял', value: 3 },
    { name: 'Нашёл', value: 3 },
]);
</script>
