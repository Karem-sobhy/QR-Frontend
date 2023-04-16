import axios from "axios";

const apiService = axios.create({
    baseURL: import.meta.env.VITE_BASE_API,
  });

export default apiService;
