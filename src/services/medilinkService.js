import { axiosInstance } from '@/lib/axios';

export const medilinkService = {
  // Create a new therapy session
  createSession: async () => {
    const response = await axiosInstance.post('/medilink/session');
    return response.data;
  },

  // Send a message to the AI
  sendMessage: async (sessionId, message) => {
    const response = await axiosInstance.post(
      `/medilink/session/${sessionId}/message`,
      { message }
    );
    return response.data;
  },

  // Get session history
  getSessionHistory: async (sessionId) => {
    const response = await axiosInstance.get(
      `/medilink/session/${sessionId}/history`
    );
    return response.data;
  },

  // Get all user sessions
  getAllSessions: async () => {
    const response = await axiosInstance.get('/medilink/sessions');
    return response.data;
  },
};
