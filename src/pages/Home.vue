<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">
    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6 my-3">
            <h1 class="m-0">Read QR Page</h1>
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
            <div class="custom-file">
              <qr-capture
                @detect="onDecode"
                :key="qr"
                @change="fileChanged"
                v-bind:disabled="fileName != 'Choose file'"
                :capture="false"
                :multiple="false"
                class="custom-file-input my-5"
                id="customFile"
              ></qr-capture>
              <label class="custom-file-label" for="customFile">{{
                fileName
              }}</label>
            </div>
          </div>
        </div>
        <div v-if="validStudents && validStudents.length" class="row justify-content-center">
          <div class="col">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">View Data Of the file in real time</h2>
                <div class="card-tools">
                  <button @click="sendSelectedData" :disabled="isSending || !selectedRows.length" class="btn btn-primary">Import</button>
                </div>
              </div>

              <div class="card-body table-responsive p-0" style="height: 50vh">
                <table class="table table-head-fixed text-nowrap">
                  <thead>
                    <tr>
                      <th>
                        <input type="checkbox" v-model="selectAll" @change="selectAllRows">
                        Import
                      </th>
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
                  <tbody>
                    <tr v-for="student in validStudents" :key="student.SSN">
                      <td><input type="checkbox" v-model="student.selected"></td>
                      <td>{{ student["Last name"] }}</td>
                      <td>{{ student["First name"] }}</td>
                      <td>{{ student.SSN }}</td>
                      <td>{{ student.Test1 }}</td>
                      <td>{{ student.Test2 }}</td>
                      <td>{{ student.Test3 }}</td>
                      <td>{{ student.Test4 }}</td>
                      <td>{{ student.Final }}</td>
                      <td>{{ student.Grade }}</td>
                    </tr>
                  </tbody>
                </table>
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
<script>
import { useToast } from "vue-toastification";
import Papa from "papaparse";
import apiService from "../api";
import { useUserStore } from "../store/user_store";
import router from "../router";
export default {
  data() {
    return {
      fileName: "Choose file",
      qr: 0,
      parsedData: null,
      toast: useToast(),
      validStudents: null,
      skippedRows: 0,
      selectAll:false,
      isSending:false
    };
  },
  computed: {
    selectedRows() {
      return this.validStudents.filter((student) => student.selected);
    },
  },
  methods: {
    fileChanged(event) {
      const file = event.target.files[0];
      this.fileName = file.name;
      // this.toast.info("decoding " + file.name + " started ...");
    },
    async onDecode(promise) {
      let csvData = null;
      this.skippedRows = 0;
      this.validStudents = null;
      this.selectAll=false  
      try {
        const { content } = await promise;
        // console.log(content);
        if (content === null) this.toast.error("Qr Code not found");
        else {
          csvData = content;
          this.parseCSV(csvData);
        }
      } catch (e) {
        this.toast.error("This file is not an image or not supported");
      }
      this.qr++;
      this.fileName = "Choose file";
    },

    parseCSV(csvData) {
      let headers;
      let parseErrors;
      let data = Papa.parse(csvData, {
        // worker:true,
        header: true,
        transformHeader: function (header) {
          return header.trim();
        },
        transform: function (value) {
          return value.trim();
        },
      });
      parseErrors = data.errors;
      // console.log(data.data);
      // console.log(parseErrors.length);
      if (parseErrors.length) {
        this.toast.error(
          "The CSV file data is malformed please correct, more data can be found in the console"
        );
        console.log(parseErrors);
        return;
      }
      headers = data.meta.fields;
      let requiredHeaders = [
        "First name",
        "Last name",
        "SSN",
        "Test1",
        "Test2",
        "Test3",
        "Test4",
        "Final",
        "Grade",
      ];
      let invalidHeaders = headers.filter(function (header) {
        return !requiredHeaders.includes(header);
      });
      if (invalidHeaders.length > 0) {
        this.toast.error("Invalid headers: " + invalidHeaders.join(","));
        return;
      }
      this.skippedRows = 0;
      this.validStudents = this.filterValidStudents(data.data);

      if (this.skippedRows && this.validStudents.length)
        this.toast.error(
          '"' +
            this.skippedRows +
            '"" rows were skipped duo to data incossitancies!'
        );

      if (!this.validStudents.length) {
        this.toast.error("None rows were valid");
        // console.log(this.validStudents.length);
        return;
      }

      this.toast.success(
        '"' + this.validStudents.length + '"" rows parsed successfully'
      );
    },

    isValidStudent(student) {
      student.selected=false;
      // Validate First Name
      let firstNameValid = /^[a-zA-Z ]+$/.test(student["First name"]);
      if (!firstNameValid) {
        this.skippedRows++;
        return false; // Mark this row as skipped
      }

      // Validate Last Name
      let lastNameValid = /^[a-zA-Z ]+$/.test(student["Last name"]);
      if (!lastNameValid) {
        this.skippedRows++;
        return false; // Mark this row as skipped
      }

      // Check that SSN is a valid format (###-##-####)
      if (!/^\d{3}-\d{2}-\d{4}$/.test(student.SSN)) {
        this.skippedRows++;
        return false;
      }

      // Check that all test scores and final score are valid numbers between 0 and 100
      let testScoresValid =
        /^\d{1,2}$|^100$/.test(student.Test1) &&
        /^\d{1,2}$|^100$/.test(student.Test2) &&
        /^\d{1,2}$|^100$/.test(student.Test3) &&
        /^\d{1,2}$|^100$/.test(student.Test4) &&
        /^\d{1,2}$|^100$/.test(student.Final);
      if (!testScoresValid) {
        this.skippedRows++;
        return false; // Mark this row as skipped
      }

      // Check that grade is a valid letter grade
      if (!/^[A-D][+-]?$|^F$/.test(student.Grade)) {
        this.skippedRows++;
        return false;
      }

      // If all checks pass, return true
      return true;
    },

    filterValidStudents(students) {
      return students.filter(this.isValidStudent);
    },
    selectAllRows(){
      this.validStudents.forEach((student) => (student.selected = this.selectAll));
    },
    async sendSelectedData() {
      this.isSending=true;
      const data = this.selectedRows.map((student) => {
        return {
          'last_name': student['Last name'],
          'first_name': student['First name'],
          ssn: student.SSN,
          test1 : student.Test1,
          test2 : student.Test2,
          test3 : student.Test3,
          test4 : student.Test4,
          final : student.Final,
          grade : student.Grade
        };
      });
      // send the data to the API endpoint
      // console.log(data);
      try {
        let res = await apiService.post('store',data);
        // console.log(res);
        this.toast.success('Stored Successfully');
        this.validStudents = null;
        this.skippedRows =0;        
        } catch(err){
            this.toast.error('Error');
            console.log(err);
        }
      this.isSending=false;
    },
  },
};
</script>
