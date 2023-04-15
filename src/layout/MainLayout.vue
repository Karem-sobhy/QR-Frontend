<template>
    <div class="wrapper">
  
      <!-- Navbar -->
      <nav class="main-header navbar navbar-expand navbar-white navbar-light">
        <!-- Left navbar links -->
        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" data-widget="pushmenu"  href="#" role="button"><i class="fas fa-bars"></i></a>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <router-link to="/" class="nav-link">Read QrCode</router-link>
          </li>
          <li class="nav-item d-none d-sm-inline-block">
            <router-link to="/view" class="nav-link">View Data</router-link>
          </li>
        </ul>
    
        <!-- Right navbar links -->
        <ul class="navbar-nav ml-auto">
          <!-- Navbar Search -->
         
    
         
          <li class="nav-item">
            <a class="nav-link" data-widget="fullscreen" href="#" role="button">
              <i class="fas fa-expand-arrows-alt"></i>
            </a>
          </li>
          <li class="nav-item dropdown user-menu">
              <a href="#" class="nav-link dropdown-toggle" data-toggle="dropdown">
                        <span>{{ user.name }}</span></a>
              <ul class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                  <li class="user-header bg-dark h-auto ">
                      <p class=" mt-0 ">{{ user.name }}</p>
                  </li>
                  <li class="user-footer">
                      <a @click="user.logout()" class="btn btn-default btn-flat float-right  btn-block">
                        <i class="fa fa-fw fa-power-off text-red"></i>Log Out</a>
                </li>
        
            </ul>
        
        </li>
        </ul>
      </nav>
      <!-- /.navbar -->
    
      <!-- Main Sidebar Container -->
      <aside class="main-sidebar sidebar-dark-primary elevation-4">
        <!-- Brand Logo -->
        <a href="index3.html" class="brand-link">
          <img src="https://github.com/erdkse/adminlte-3-vue/raw/main/src/assets/img/logo.png" alt="AdminLTE Logo" class="brand-image img-circle elevation-3" style="opacity: .8">
          <span class="brand-text font-weight-light">AdminLTE 3</span>
        </a>
    
        <!-- Sidebar -->
        <div class="sidebar">
          <!-- Sidebar user panel (optional) -->
          <div class="user-panel mt-3 pb-3 mb-3 d-flex">
            <div class="image">
              <img src="https://github.com/erdkse/adminlte-3-vue/raw/main/src/assets/img/default-profile.png" class="img-circle elevation-2" alt="User Image">
            </div>
            <div class="info">
              <a href="#" class="d-block">{{ user.name }}</a>
            </div>
          </div>
    
          <!-- SidebarSearch Form -->
          <!-- <div class="form-inline">
            <div class="input-group" data-widget="sidebar-search">
              <input class="form-control form-control-sidebar" type="search" placeholder="Search" aria-label="Search">
              <div class="input-group-append">
                <button class="btn btn-sidebar">
                  <i class="fas fa-search fa-fw"></i>
                </button>
              </div>
            </div>
          </div> -->
        </div>
        <!-- /.sidebar -->
      </aside>
    
      <RouterView/>
    
      
    
      <!-- Main Footer -->
      <footer class="main-footer">
        <!-- To the right -->
        
        <!-- Default to the left -->
        <strong>Copyright &copy; 2023 <a href="https://adminlte.io">AdminLTE.io</a>.</strong> All rights reserved.
      </footer>
    </div>
    <!-- ./wrapper -->
  </template>

<script>
import { RouterLink, RouterView } from 'vue-router'
import { useUserStore } from '../store/user_store';

export default{
    data(){
        return{
            user:useUserStore(),
        }
    },methods: {
      mounted() {
        console.log('mounted');
        
      },
    },

}
</script>

<style>
.router-link-exact-active{
color: rgba(0,0,0,.9) !important;
}
</style>