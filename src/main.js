import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toaster from '@meforma/vue-toaster'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/css/main.css'

createApp(App).use(Toaster).use(router).mount('#app')
