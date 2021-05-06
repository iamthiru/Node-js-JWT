import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://3.213.134.99:5000/'
});

export default axiosInstance;