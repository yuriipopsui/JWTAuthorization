import axios, {AxiosInstance} from 'axios';

export const API_URL = 'http://localhost:5000/api'

const $api: AxiosInstance = axios.create({
  withCredentials: true,
  baseURL: API_URL
});

$api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
},
  (error) => {
    return Promise.reject(error);
  }
);

export default $api;