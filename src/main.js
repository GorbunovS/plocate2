// main.ts

import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import App from './App.vue';
import router from './router'; 
import Aura from '@primeuix/themes/aura';
import { Button, SelectButton } from 'primevue';
import FileUpload from 'primevue/fileupload';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import FloatLabel from 'primevue/floatlabel';
import AutoComplete from 'primevue/autocomplete';
import { VueTelegramPlugin } from 'vue-tg';
import { init } from '@telegram-apps/sdk';
import { locationManager } from '@telegram-apps/sdk';
import { LMap, LTileLayer, LMarker } from '@vue-leaflet/vue-leaflet';
import Chip from 'primevue/chip';
import { createPinia } from 'pinia'



const pinia = createPinia()



init();
//кек

locationManager.isSupported(); 
const app = createApp(App);

app.use(router);  
app.use(pinia)
app.use(VueTelegramPlugin);
app.component('Chip', Chip);
app.component('LMap', LMap);
app.component('LMarker', LMarker);
app.component('l-tile-layer', LTileLayer);
app.component('FileUpload',FileUpload)
app.component('Button', Button);
app.component('SelectButton', SelectButton);
app.component('font-awesome-icon', FontAwesomeIcon);
app.component('AutoComplete', AutoComplete);
app.component('FloatLabel', FloatLabel);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});


app.mount('#app');

