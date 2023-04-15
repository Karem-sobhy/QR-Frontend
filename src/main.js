import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// import 'admin-lte/plugins/jquery/jquery.min.js'
import Toast from "vue-toastification";
import {useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import QrReader from 'vue3-qr-reader';

// import './assets/main.css'
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import 'admin-lte/dist/css/adminlte.min.css'
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

apiService.interceptors.request.use(
    (config) => {
      const token = userStore.token;
      config.headers.Accept = 'application/json';
    //   console.log(token);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
apiService.interceptors.response.use(
    (response) => response,
    (error) => {
        const toast = useToast()
        // console.log(error);
    if(error.code=='ERR_NETWORK'){
        let errorMsg = userStore.token ? 'Someting Gone Wrong with the Connection Logging Out...' : "Can't Connect to the Endpoint";
        
        toast.error(errorMsg);
        if(userStore.token)
        userStore.logout()
        return Promise.reject(error);
    } 
    
    if (error.response.status === 500) 
        toast.error('Server Error Try again later');
      
    if (error.response.status === 401 && userStore.token) {
        // Log the user out
        toast.error('Token expired please login again');
        userStore.logout()
      }
      return Promise.reject(error);
    }
  );
  app.use(QrReader);
app.mount('#app')