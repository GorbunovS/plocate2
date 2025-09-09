import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';

// Определите маршруты
const routes = [
  { path: '/', component: () => import('./components/HelloWorld.vue') },
  { path: '/popup', component: () => import('./components/PopupButton.vue') },
  // Другие маршруты
];

const router = createRouter({
  history: createWebHistory(), // Для Telegram Mini App рекомендуется HTML5 mode
  routes,
});

const app = createApp(App);
app.use(router); // Подключение роутера
app.mount('#app');
