import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";

// import './assets/main.css'
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css'
import 'admin-lte/plugins/jquery/jquery.min.js'
import 'admin-lte/plugins/bootstrap/js/bootstrap.bundle.min.js'
import 'admin-lte/dist/js/adminlte.min.js'

import apiService from './api.js';
import {useUserStore} from "./store/user_store"

import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(router)
app.use(Toast)

app.use(pinia)

const userStore = useUserStore();


apiService.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        // Log the user out
        const toast = useToast()
        toast.error('Token expired please login again');
        userStore.logout()
      }
  
      return Promise.reject(error);
    }
  );
app.mount('#app')