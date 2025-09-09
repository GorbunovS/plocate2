// main.ts

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router'; // Импорт роутера из router/index.ts
import Aura from '@primeuix/themes/aura';
import { Button } from 'primevue';


const app = createApp(App);
app.use(router); // Подключение роутера к приложению
app.component('Button', Button);
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');

