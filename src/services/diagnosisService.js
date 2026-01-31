import { axiosInstance } from '@/lib/axios';

export const diagnosisService = {
  // Session management
  createSession: async () => {
    const response = await axiosInstance.post('/portal/diagnosis/session');
    return response.data;
  },

  submitSymptoms: async (sessionId, symptoms) => {
    const response = await axiosInstance.post(
      `/portal/diagnosis/session/${sessionId}/message`,
      { symptoms }
    );
    return response.data;
  },

  getSessionHistory: async (sessionId) => {
    const response = await axiosInstance.get(
      `/portal/diagnosis/session/${sessionId}/history`
    );
    return response.data;
  },

  getAllSessions: async () => {
    const response = await axiosInstance.get('/portal/diagnosis/sessions');
    return response.data;
  },

  // Medication management
  getUserMedications: async (params) => {
    const response = await axiosInstance.get('/portal/diagnosis/medications', {
      params,
    });
    return response.data;
  },

  updateMedicationStatus: async (id, status, notes) => {
    const response = await axiosInstance.patch(
      `/portal/diagnosis/medications/${id}/status`,
      { status, notes }
    );
    return response.data;
  },

  addMedicationNote: async (id, note) => {
    const response = await axiosInstance.post(
      `/portal/diagnosis/medications/${id}/note`,
      { note }
    );
    return response.data;
  },

  getMedicationInfo: async (medicationName) => {
    const response = await axiosInstance.get(
      '/portal/diagnosis/medication-info',
      {
        params: { name: medicationName },
      }
    );
    return response.data;
  },
};

export default diagnosisService;
