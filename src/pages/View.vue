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
          <div class="col">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">DataTable with default features</h3>
              </div>

              <div class="card-body">
                <DataTable
                        :options="options"
                        class="table table-bordered table-striped"
                      >
                        <thead>
                          <tr>
                            <th>Last Name</th>
                            <th>First Name</th>
                            <th>SSN</th>
                            <th>Test1</th>
                            <th>Test2</th>
                            <th>Test3</th>
                            <th>Test4</th>
                            <th>Final</th>
                            <th>Grade</th>
                          </tr>
                        </thead>
                      </DataTable>
              </div>
            </div>
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
<script setup>
import DataTable from "datatables.net-vue3";
import DataTablesLib from "datatables.net-bs4";

DataTable.use(DataTablesLib);
</script>
<script>
import { useUserStore } from "../store/user_store";
export default {
  data() {
    return {
      // token:useUserStore().token,
      options: {
        processing: true,
        serverSide: true,
        autoWidth: true,
        ajax: {
          url: import.meta.env.VITE_BASE_API + "view",
          headers: { Authorization: "Bearer " + useUserStore().token },
        },
        columns: [
          { data: "last_name" },
          { data: "first_name" },
          { data: "ssn" },
          { data: "test1", searchable: false },
          { data: "test2", searchable: false },
          { data: "test3", searchable: false },
          { data: "test4", searchable: false },
          { data: "final", searchable: false },
          { data: "grade" },
        ],
      },
    };
  },
  methods: {},
  mounted() {},
};
</script>
<style>
@import 'datatables.net-bs4'
</style>
