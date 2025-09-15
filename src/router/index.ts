import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

// Определите маршруты как массив RouteRecordRaw для TypeScript-типизации
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../components/MainView.vue'), // Lazy loading
  }
  // Добавьте другие маршруты здесь, например:
  // {
  //   path: '/about',
  //   name: 'About',
  //   component: () => import('../components/About.vue'),
  // },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL), // Для Vite: использует BASE_URL из env
  routes,
});

export default router;

