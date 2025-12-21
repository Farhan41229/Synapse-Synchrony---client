import { create } from 'zustand';
import axios from 'axios';
import { useSocket } from '@/hooks/use-socket';
export const AUTH_URL = 'http://localhost:3001/api/auth';
axios.defaults.withCredentials = true;
export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH_URL}/signup`, {
        email,
        password,
        name,
      });
      console.log('The response of signup is: ', response);
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      useSocket.getState().connectSocket();
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Signup failed',
        isLoading: false,
      });
      throw error;
    }
  },
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH_URL}/login`, {
        email,
        password,
      });
      console.log('The login response is: ', response);
      set({
        isAuthenticated: true,
        user: response.data.data.user,
        error: null,
        isLoading: false,
      });
      useSocket.getState().connectSocket();
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error logging in',
        isLoading: false,
      });
      throw error;
    }
  },
  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${AUTH_URL}/logout`);
      set({
        user: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
      useSocket.getState().disconnectSocket();
    } catch (error) {
      set({ error: 'Error logging out', isLoading: false });
      throw error;
    }
  },
  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH_URL}/verify-email`, { code });
      console.log('The response of the verify email is: ', response);
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });
      useSocket.getState().connectSocket();
      return response.data;
    } catch (error) {
      set({
        error: error.response.data.message || 'Error verifying email',
        isLoading: false,
      });
      throw error;
    }
  },
  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${AUTH_URL}/check-auth`);
      console.log('The Check auth Response is : ', response);
      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      useSocket.getState().connectSocket();
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      throw error;
    }
  },
}));
