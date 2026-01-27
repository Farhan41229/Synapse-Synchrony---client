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

  // Get mood history
  getMoodHistory: async (params = {}) => {
    const { sessionId, limit = 50, days = 30 } = params;
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append('sessionId', sessionId);
    queryParams.append('limit', limit);
    queryParams.append('days', days);
    
    const response = await axiosInstance.get(
      `/medilink/mood-history?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get stress history
  getStressHistory: async (params = {}) => {
    const { sessionId, limit = 50, days = 30 } = params;
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append('sessionId', sessionId);
    queryParams.append('limit', limit);
    queryParams.append('days', days);
    
    const response = await axiosInstance.get(
      `/medilink/stress-history?${queryParams.toString()}`
    );
    return response.data;
  },

  // Get wellness suggestions
  getWellnessSuggestions: async (params = {}) => {
    const { sessionId, limit = 20, unreadOnly = false } = params;
    const queryParams = new URLSearchParams();
    if (sessionId) queryParams.append('sessionId', sessionId);
    queryParams.append('limit', limit);
    queryParams.append('unreadOnly', unreadOnly);
    
    const response = await axiosInstance.get(
      `/medilink/suggestions?${queryParams.toString()}`
    );
    return response.data;
  },

  // Mark suggestion as viewed
  markSuggestionViewed: async (suggestionId) => {
    const response = await axiosInstance.patch(
      `/medilink/suggestions/${suggestionId}/view`
    );
    return response.data;
  },

  // Get wellness summary
  getWellnessSummary: async (days = 7) => {
    const response = await axiosInstance.get(
      `/medilink/wellness-summary?days=${days}`
    );
    return response.data;
  },
};
