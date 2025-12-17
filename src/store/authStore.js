import { create } from 'zustand';
import axios from 'axios';

export const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/auth/register', { email, password, name });

      set({
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
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
      const response = await axios.post('/auth/login', { email, password });

      set({
        user: response.data.data.user,
        accessToken: response.data.data.accessToken,
        isAuthenticated: true,
        error: null,
        isLoading: false,
      });
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
      await axios.post('/auth/logout');

      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    } catch {
      // even if server fails, clear client state
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        error: null,
        isLoading: false,
      });
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post('/auth/verify-email', { code });

      set({
        user: response.data.data.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error verifying email',
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });

    try {
      // 1) Get a new access token using HttpOnly refresh cookie
      const refreshRes = await axios.post('/auth/refresh');
      const accessToken = refreshRes.data.data.accessToken;

      // 2) Fetch user profile using the access token
      const meRes = await axios.get('/auth/me', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      set({
        user: meRes.data.data.user,
        accessToken,
        isAuthenticated: true,
        isCheckingAuth: false,
        error: null,
      });
    } catch {
      // Refresh failed => treat as logged out
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isCheckingAuth: false,
        error: null,
      });
    }
  },
}));
