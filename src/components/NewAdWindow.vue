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

const src = ref(null);

function onFileSelect(event) {
    const file = event.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
        src.value = e.target.result;
    };

    reader.readAsDataURL(file);
}

const value = ref(null);
const options = ref([

    { name: 'Потерял', value: 3 },
     { name: 'Нашёл', value: 3 },
]);
</script>