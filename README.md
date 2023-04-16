QR Code Reader - Frontend App
=============================

This is a simple web application that allows users to authenticate, read QR code images that contain CSV data, and save the data in the database. It has been built using Vue3 and Vuex datastore replacement called Pinia.

Features
--------

*   Full user authentication
*   Dashboard with two pages - QR code reader and data viewer
*   Data viewer page with sorting, searching, and pagination
*   User data is persisted using the Pinia persist plugin
*   QR code image reader that can handle malformed images or non-image files
*   CSV data validation process that checks for malformed CSV, missing headers, invalid headers, and invalid rows and values
*   Error handling using toasts

Technologies used
-----------------

*   Vue3
*   Vue Router
*   Pinia
*   Axios
*   AdminLTE
*   Bootstrap 4
*   DataTables.js
*   Vue3-qr-reader
*   PapaParse
*   Vue-Toastification

Installation
------------

To install the application, follow these steps:

1.  Fill in the `.env` file with the appropriate base API URL. Example: 
```dotenv
VITE_BASE_API="https://api.example.com/api/"
```
2.  Run 
```shell
npm install
```

3.  Run 
```shell
npm run dev
``` 
to serve the app in development mode, or 
```shell
npm run build
```
 to build the production files for the app.

Validation Process
------------------

When the user scans the QR code, the application first attempts to decode the image. If there is an error, it displays a toast with a message describing the error (e.g., no QR code found or non-image file provided).

If the image is successfully decoded, the application attempts to parse the CSV data. The CSV data is validated in the following ways:

*   **Malformed CSV:** The application checks if the CSV data is well-formed, with no missing values or columns. If there is an error, it displays a toast with a message informing the user that the CSV data is malformed.
*   **Missing Headers:** The application ensures that the user has provided all the required headers and no extra headers are present. If the headers do not match, it displays a toast with a message informing the user that the headers are incorrect.
*   **Invalid Rows:** The application checks each row in the CSV data and validates that each row and value is valid. If a row or value is invalid, it is skipped, and the application displays a toast with a message informing the user that some rows have been skipped and the number of valid rows.

Docker
------
This app can be dockerized and used with NGINX as webserver.
the `.DockerFile` is included and i use it to run the demo server

Demo
----

You can view a live demo of the application at [https://qr.karemcloud.com](https://qr.karemcloud.com).
