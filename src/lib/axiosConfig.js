import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Base configuration
axios.defaults.baseURL = 'http://localhost:3001/api';
axios.defaults.withCredentials = true;

console.log('🔧 Axios configured with baseURL:', axios.defaults.baseURL);

// Request interceptor: Attach access token to all requests
axios.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      console.log('📤 Request with token:', config.method.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Auto-refresh on 401
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loop on /auth/refresh endpoint
    if (originalRequest.url === '/auth/refresh') {
      console.log('❌ Refresh token failed');
      return Promise.reject(error);
    }

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log('🔄 Token expired, attempting refresh...');

      try {
        // Try to refresh token
        const refreshRes = await axios.post('/auth/refresh');
        const newAccessToken = refreshRes.data.data.accessToken;

        console.log('✅ Token refreshed successfully');

        // Update store
        useAuthStore.setState({ 
          accessToken: newAccessToken,
          isAuthenticated: true 
        });

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        console.log('❌ Refresh failed, logging out');
        
        // Refresh failed - logout user
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
