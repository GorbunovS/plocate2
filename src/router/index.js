import { createRouter, createWebHistory } from 'vue-router';

import MainView from '../components/MainView.vue';
import NewAdWindow from '../components/NewAdWindow.vue';
// import DescoverView from '../components/DescoverView.vue';
import AdsMap from '../components/AdsMap.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: MainView,
    },
    {
      path: '/newAd',
      name: 'newAd',
      component: NewAdWindow,
    },
    {
      path:'/descover',
      name: 'descover',
      component: AdsMap
    }
  ],
});
export default router;

