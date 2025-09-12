// main.ts

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router'; // Импорт роутера из router/index.ts
import Aura from '@primeuix/themes/aura';
import { Button, SelectButton } from 'primevue';
import FileUpload from 'primevue/fileupload';




const app = createApp(App);
app.use(router); // Подключение роутера к приложению
app.component('FileUpload',FileUpload)
app.component('Button', Button);
app.component('SelectButton', SelectButton);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');

