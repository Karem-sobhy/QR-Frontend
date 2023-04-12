import { createRouter,createWebHashHistory } from 'vue-router'
import MainLayout from '../layout/MainLayout.vue'

const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      meta:{
        requiresAuth: true
      },
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('../pages/Home.vue'),
          meta: {
            requiresAuth: true
          }
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../pages/Login.vue'),
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Register.vue'),
    }
  ]
})

export default router
