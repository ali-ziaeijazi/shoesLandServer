// apiClient.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { getToken, isTokenExpired, removeToken } from './authUtils';
import { useNavigate } from 'react-router-dom'; 


const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://your-api-base-url.com/api', 
  timeout: 10000,
});


apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = getToken();
    if (token && !isTokenExpired(token)) {
      config.headers!['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response && error.response.status === 401) {
     
      const token = getToken();
      if (token && isTokenExpired(token)) {
          removeToken(); 
          const navigate = useNavigate();
          navigate('/login'); 
        }
      }
      return Promise.reject(error);

    }
);

export default apiClient;
