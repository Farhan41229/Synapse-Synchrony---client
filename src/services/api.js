// /Synapse-Synchrony---client/src/services/api.js
import axios from 'axios';
import { useAuthStore } from '../store/authStore';

axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.withCredentials = true;

const isDev = import.meta?.env?.MODE === 'development';

let refreshPromise = null;

axios.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (!originalRequest) return Promise.reject(error);

    // Robust refresh-loop guard
    if (String(originalRequest.url || '').includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // single-flight refresh
        if (!refreshPromise) {
          refreshPromise = axios.post('/auth/refresh').finally(() => {
            refreshPromise = null;
          });
        }

        const refreshRes = await refreshPromise;
        const newAccessToken = refreshRes.data.data.accessToken;

        useAuthStore.setState({
          accessToken: newAccessToken,
          isAuthenticated: true,
        });

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      } catch (refreshError) {
        if (isDev) console.error('Refresh failed', refreshError);
        useAuthStore.setState({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axios;
