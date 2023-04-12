<script>
export default{
    data() {
        return{ 
            app : document.getElementById('app'),
            isAuthLoading: false
        }
    },
    mounted() {
        this.app.classList.add('login-page')
    },
    unmounted(){
        this.app.classList.remove('login-page')
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
      
            <form onsubmit="">
              <div class="input-group mb-3">
                <input type="email" class="form-control" placeholder="Email">
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <div class="input-group mb-3">
                <input type="password" class="form-control" placeholder="Password">
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