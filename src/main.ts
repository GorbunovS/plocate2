// main.ts

import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импорт роутера из router/index.ts

const app = createApp(App);
app.use(router); // Подключение роутера к приложению

app.mount('#app');

