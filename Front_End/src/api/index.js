import axios from 'axios';

const BASE_URL = "https://1750e94fd8b6.ngrok.io" //"http://localhost:3003"
const axiosInstance = axios.create({
  baseURL: BASE_URL
});

export default axiosInstance;