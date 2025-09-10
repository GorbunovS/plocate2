<template>
<div class="grid">
    <div class="columns-2 gap-4 sm:columns-3 sm:gap-8 ...">

</div>
      <div class="card flex justify-center">
        Фотография
        <img v-if="src" :src="src" alt="Image" chooseLabel="RTR" class="shadow-md rounded-xl" style="width: 128px; height: auto; " />
        <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />

    </div>
    Тип
     <div class="card flex justify-center">
        <SelectButton v-model="value" :options="options" optionLabel="name"  />
    </div>
</div>


</template>

<script setup lang="ts">
import { ref } from 'vue';
import "tailwindcss";

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
