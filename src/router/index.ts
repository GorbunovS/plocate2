import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import HelloWorld from '../components/HelloWorld.vue';
import Popup from '../components/PopupButton.vue';

// Определите маршруты
const routes = [
  { path: '/', component: HelloWorld },
  { path: '/popup', component: Popup }, 

];

const router = createRouter({
  history: createWebHistory(), // Важно: HTML5 mode для совместимости с TG
  routes,
});

const app = createApp(App);
app.use(router);
app.mount('#app');
