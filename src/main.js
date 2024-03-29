import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import store from "@/store";

import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import BadgeDirective from 'primevue/badgedirective';
import ui from '@/ui';
import VueCountdown from '@chenfengyuan/vue-countdown';

const app = createApp(App);

app.use(PrimeVue, {
    locale: ui.config.locale
});
app.use(ToastService);
app.directive('badge', BadgeDirective);
ui.components.forEach(component => {
    app.component(component.name, component);
})
app.component('Countdown', VueCountdown);

app
    .use(router)
    .use(store)
    .mount('#app');
