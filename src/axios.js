import axios from "axios";
import store from "@/store";
import router from "@/router";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    Accept: 'application/json'
  }
});

axiosInstance.interceptors.response.use(
    (response) => Promise.resolve(response),
    (error) => {
      const status = error.response?.status;
      if (status === 401) {
        store.dispatch('currentUser/logout');
      } else if (status === 403) {
        router.push('/forbidden');
      } else if (status === 404 && error.config.method === 'get') {
        router.push('/not-found');
      }
      console.log("Error intercepted", error)
      return Promise.reject(error);
    });

export default axiosInstance