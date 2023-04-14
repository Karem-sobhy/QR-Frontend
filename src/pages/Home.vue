<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Starter Page</h1>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <div class="content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-12 col-md-10 col-lg-8">
            <div class="custom-file">
                <qr-capture @detect="onDecode" @change="fileChanged" class="custom-file-input" id="customFile"></qr-capture>
                <label class="custom-file-label" for="customFile">{{ file }}</label>
            </div>
            <!-- <div class="">
                <input @change="fileChanged" type="file" >
                <label class="custom-file-label" for="customFile">{{ file }}</label>
            </div> -->
            
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content -->
  </div>
  <!-- /.content-wrapper -->
</template>
<script> 
    export default{
        data() {
            return{ 
                file:"Choose file"
            }
        },
        methods: {
            fileChanged(event){
                const file = event.target.files[0];
                this.file = file.name;
                // console.log(file);
            },
            async onDecode(promise){
                const {content} = await promise
                console.log(content);
            }
        },
    }
</script>