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
        <div
          v-if="validStudents && validStudents.length"
          class="row justify-content-center"
        >
          <div class="col">
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">View Data Of the file in real time</h2>
                <div class="card-tools">
                  <button
                    @click="sendSelectedData"
                    :disabled="isSending || !selectedRows.length"
                    class="btn btn-primary"
                  >
                    Import
                  </button>
                </div>
              </div>

              <div class="card-body table-responsive p-0" style="height: 50vh">
                <table class="table table-head-fixed text-nowrap">
                  <thead>
                    <tr>
                      <th>
                        <input
                          type="checkbox"
                          v-model="selectAll"
                          @change="selectAllRows"
                        />
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
                      <td>
                        <input type="checkbox" v-model="student.selected" />
                      </td>
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
export default {
  data() {
    return {
      fileName: "Choose file",
      qr: 0,
      parsedData: null,
      toast: useToast(),
      validStudents: null,
      skippedRows: 0,
      selectAll: false,
      isSending: false,
    };
  },
  computed: {
    selectedRows() {
      return this.validStudents.filter((student) => student.selected); //filter all selected rows to import
    },
  },
  methods: {
    fileChanged(event) {
      const file = event.target.files[0];
      this.fileName = file.name; //change the name of the custom bootstrap label
    },
    async onDecode(promise) {
      //reset start
      let csvData = null;
      this.skippedRows = 0;
      this.validStudents = null;
      this.selectAll = false;
      //reset done
      try {
        const { content } = await promise; //decoding the QR Code
        if (content === null) this.toast.error("Qr Code not found"); //File is image but not a QR Code
        else {
          csvData = content;
          this.parseCSV(csvData); //Qr code decoding done send to parse
        }
      } catch (e) {
        this.toast.error("This file is not an image or not supported"); //File wasn't even an image
      }
      this.qr++; //reset the file input so it can handle the same file again not only once
      this.fileName = "Choose file"; // revert the label to default
    },

    parseCSV(csvData) {
      let headers;
      let parseErrors;
      let data = Papa.parse(csvData, { //save the parsed data in data variable
        header: true, //Tell the parser to read the first row as header
        transformHeader: function (header) { //preparing the headers by trimming them from whitespaces
          return header.trim(); 
        },
        transform: function (value) { //preparing the values by trimming them from whitespaces
          return value.trim();
        },
      });
      parseErrors = data.errors; //parse errors from papaparse means the csv is likly not in correct format or have some coulmn missing
      if (parseErrors.length) { //show the user the error and return
        this.toast.error(
          "The CSV file data is malformed please correct, more data can be found in the console");
        console.log(parseErrors);
        return;
      }
      headers = data.meta.fields; //takes the headers from the user input
      let requiredHeaders = [ //this is the required headers for our app to check for
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
      let invalidHeaders = headers.filter(function (header) { //filtering the user Headers with the required Headers
        return !requiredHeaders.includes(header);
      });
      if (invalidHeaders.length > 0) { //If there is an invalid header in the csv show them and return
        this.toast.error("Invalid headers: " + invalidHeaders.join(","));
        return;
      }
      this.validStudents = this.filterValidStudents(data.data); //make an array of students object that is being validated from the csv

      if (this.skippedRows && this.validStudents.length) //check if some rows were skipped and there is some valid rows to show how many skipped
        this.toast.error(
          '"' +
            this.skippedRows +
            '"" rows were skipped duo to data incossitancies!'
        );

      if (!this.validStudents.length) { //if there wasn't any valid rows show user error and return
        this.toast.error("None rows were valid");
        return;
      }

      this.toast.success('"' + this.validStudents.length + '"" rows parsed successfully'); //if all passed return a success with row number
    },

    isValidStudent(student) { //row validator
      student.selected = false; //adding selected to student object to know which rows selected in the table afterwards
      // Validate First Name
      let firstNameValid = /^[a-zA-Z ]+$/.test(student["First name"]); //make sure it's apla only
      if (!firstNameValid) {
        this.skippedRows++;
        return false; // Mark this row as skipped
      }

      // Validate Last Name
      let lastNameValid = /^[a-zA-Z ]+$/.test(student["Last name"]); //make sure it's apla only
      if (!lastNameValid) {
        this.skippedRows++;
        return false; // Mark this row as skipped
      }

      // Check that SSN is a valid format (###-##-####)
      if (!/^\d{3}-\d{2}-\d{4}$/.test(student.SSN)) { //make sure SSN is a valid format (###-##-####)
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
      return students.filter(this.isValidStudent); //filter all studen and validate them
    },
    selectAllRows() {
      this.validStudents.forEach(
        (student) => (student.selected = this.selectAll)
      ); //edit the selected in each user object to match the all checkbox
    },
    async sendSelectedData() { //send the selected data to the backend endpoint
      this.isSending = true; //loading state
      const data = this.selectedRows.map((student) => {
        return {
          last_name: student["Last name"],
          first_name: student["First name"],
          ssn: student.SSN,
          test1: student.Test1,
          test2: student.Test2,
          test3: student.Test3,
          test4: student.Test4,
          final: student.Final,
          grade: student.Grade,
        };//return the the students object with the last name to send to the database and also removee the selected key
      });
      // send the data to the API endpoint
      try {
        await apiService.post("store", data); //post the data to the API endpoint
        this.toast.success("Stored Successfully"); //show success msg
        this.validStudents = null; //reset
        this.skippedRows = 0;
      } catch (err) {
        this.toast.error("Error"); //show error msg and log it in the console
        console.log(err);
      }
      this.isSending = false;//loading state done
    },
  },
};
</script>
