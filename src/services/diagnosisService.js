import { axiosInstance } from '@/lib/axios';

export const diagnosisService = {
  // Create a new diagnosis session
  createSession: async () => {
    const response = await axiosInstance.post('/portal/diagnosis/session');
    return response.data;
  },

  // Send a message in the diagnosis conversation
  sendMessage: async (sessionId, message) => {
    const response = await axiosInstance.post(
      `/portal/diagnosis/session/${sessionId}/message`,
      { message }
    );
    return response.data;
  },

  // Get full session history (for loading existing sessions)
  getSessionHistory: async (sessionId) => {
    const response = await axiosInstance.get(
      `/portal/diagnosis/session/${sessionId}/history`
    );
    return response.data;
  },

  // Get all sessions list
  getAllSessions: async () => {
    const response = await axiosInstance.get('/portal/diagnosis/sessions');
    return response.data;
  },

  // Save user's location to a session
  saveUserLocation: async (sessionId, locationData) => {
    const response = await axiosInstance.post(
      `/portal/diagnosis/session/${sessionId}/location`,
      locationData
    );
    return response.data;
  },

  // Get nearby hospitals/clinics based on coordinates
  getNearbyFacilities: async (latitude, longitude, radius = 5000) => {
    const response = await axiosInstance.get(
      '/portal/diagnosis/nearby-facilities',
      {
        params: { latitude, longitude, radius },
        timeout: 50000, // 50 second timeout on client side
      }
    );
    return response.data;
  },
};

export default diagnosisService;
