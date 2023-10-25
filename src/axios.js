import axios from "axios";
import store from "@/store";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    Accept: 'application/json'
  }
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response.status === 401) {
        store.dispatch('currentUser/logout');
      }

      return Promise.reject(error);
    });

export default axiosInstance