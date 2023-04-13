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
            name:'',
            email:'',
            password:'',
            password_confirmation:'',
            errors: {},
            user: useUserStore()
        }
    },
    methods: {
      async register(){
        const toast = useToast();
        this.errors={}
        this.isAuthLoading=true
        try {
          let res = await apiService.post('register',{
          name:this.name,
          email:this.email,
          password:this.password,
          password_confirmation:this.password_confirmation
        });
        this.user.setUserDetails(res.data);
        toast.success('Login Successfully');
        router.push('/')
        } catch (err) {
          console.log(this.user.token)
          this.errors=err.response.data.errors
          if(this.errors.password){
            this.errors.password.forEach(error => {
              
              toast.error(error)
            });
          }
          if(this.errors.email){
            this.errors.email.forEach(error => {
              toast.error(error)
            });
          }
          if(this.errors.name){
            this.errors.name.forEach(error => {
              toast.error(error)
            });
          }
        }
        this.isAuthLoading=false
      },
    },
    mounted() {
        this.app.classList.add('register-page');
        // this.user.fetchUser();
    },
    unmounted(){
        this.app.classList.remove('register-page')
    }
    }
</script>
<template>
  <div class="register-box">
    <div class="card card-outline card-primary">
      <div class="card-header text-center">
        <a class="h1"><b>Admin</b>LTE</a>
      </div>
      <div class="card-body">
        <p class="login-box-msg">Register a new membership</p>
  
        <form v-on:submit.prevent="register">
          <div class="input-group mb-3">
            <input v-model="name" type="text" class="form-control" placeholder="Full name">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-user"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input v-model="email" type="email" class="form-control" placeholder="Email">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-envelope"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input v-model="password" type="password" class="form-control" placeholder="Password">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="input-group mb-3">
            <input v-model="password_confirmation" type="password" class="form-control" placeholder="Retype password">
            <div class="input-group-append">
              <div class="input-group-text">
                <span class="fas fa-lock"></span>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col">
              <button :disabled="isAuthLoading" type="submit" class="btn btn-primary btn-block">Register</button>
            </div>
            <!-- /.col -->
          </div>
        </form>
  
        
  
        <router-link to="/login" class="text-center">I already have a membership</router-link>
      </div>
      <!-- /.form-box -->
    </div><!-- /.card -->
  </div>
  <!-- /.register-box -->
</template>