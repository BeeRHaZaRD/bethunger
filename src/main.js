import {createApp} from 'vue'
import App from './App.vue'
import router from "@/router";
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import ui from '@/ui'

const app = createApp(App)

app.use(PrimeVue).use(ToastService)
ui.components.forEach(component => {
    app.component(component.name, component);
})

app
    .use(router)
    .mount('#app')
