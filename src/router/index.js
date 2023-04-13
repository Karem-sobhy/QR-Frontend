import { createRouter,createWebHashHistory } from 'vue-router'
import {useUserStore} from "../store/user_store"
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
      meta: {
        requiresUnauth: true
      }
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('../pages/Register.vue'),
      meta: {
        requiresUnauth: true
      }
    }
  ]
})
router.beforeEach((to, from, next) => {
  const token= useUserStore().token;
  // console.log(token);
  if (to.meta.requiresAuth && !token) {
      next('/login');
    }
  if (to.meta.requiresUnauth && token) {
      next('/');
    }
      next();
});
export default router
