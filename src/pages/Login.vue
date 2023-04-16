<script>
import { useToast } from "vue-toastification";
import apiService from '../api';
import {useUserStore} from "../store/user_store"
import router from "../router";
export default{
    data() {
        return{ 
            app : document.getElementById('app'),
            isAuthLoading: false,
            email:'',
            password:'',
            errors: {},
            user: useUserStore()
        }
    },
    methods: {
      async login(){
        this.errors={}
        this.isAuthLoading=true
        const toast = useToast();
        try {
          let res = await apiService.post('login',{
          email:this.email,
          password:this.password,
        });
        this.user.setUserDetails(res.data);
        toast.success('Login Successfully');
        router.push('/')
        
        if(window.innerWidth >= 768 && window.innerWidth <=992)
        document.body.classList.add('sidebar-collapse');
        
        } catch(err){
            // console.log(err.code);
            // this.isAuthLoading=false
            if(err.response  && err.response.status == 401)
            toast.error('Wrong Email or Password please try again');
        }
        this.isAuthLoading=false
      },
    },
    mounted() {
        this.app.classList.add('login-page')
      },
      unmounted(){
        this.app.classList.remove('login-page')
        // document.body.classList.remove('sidebar-mini')
        // document.body.classList.add('sidebar-mini')
    }
    }
</script>
<template>
    <div class="login-box">
        <!-- /.login-logo -->
        <div class="card card-outline card-primary">
          <div class="card-header text-center">
            <a  class="h1"><b>Admin</b>LTE</a>
          </div>
          <div class="card-body">
            <p class="login-box-msg">Sign in to start your session</p>
      
            <form v-on:submit.prevent="login">
              <div class="input-group mb-3">
                <input v-model="email" type="email" class="form-control" placeholder="Email" required>
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3">
                <input v-model="password" type="password" class="form-control" placeholder="Password" required>
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-lock"></span>
                  </div>
                </div>
              </div>
              <div class="row">
                <!-- /.col -->
                <div class="col">
                  <button :disabled="isAuthLoading" type="submit" class="btn btn-primary btn-block">Sign In</button>
                </div>
                <!-- /.col -->
              </div>
            </form>
            <!-- /.social-auth-links -->
            <p class="mb-0">
              <router-link to="/register" class="text-center">Register a new membership</router-link>
            </p>
          </div>
          <!-- /.card-body -->
        </div>
        <!-- /.card -->
      </div>
      <!-- /.login-box -->
</template>