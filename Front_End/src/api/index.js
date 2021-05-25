import axios from 'axios';
import { DEFAULT_ENVIRONMENT_KEY, ENVIRONMENT } from '../constants/environment';

const axiosInstance = axios.create({
  // baseURL: ENVIRONMENT[DEFAULT_ENVIRONMENT_KEY].BASE_URL
  baseURL:  "https://6c5e296a5894.ngrok.io" //"http://localhost:3004/"
});

export const setAxiosBaseURL = (url) => {
  axiosInstance.defaults.baseURL = url;
}

export default axiosInstance;