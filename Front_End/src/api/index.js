import axios from 'axios';

const BASE_URL = "https://1205e8645028.ngrok.io/"
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

export default axiosInstance;