import { axiosInstance } from '@/lib/axios';

export const medicineScheduleService = {
  extractAndSave: (title, fileBase64, mimeType) =>
    axiosInstance
      .post('/portal/medicine-schedule/extract', { title, fileBase64, mimeType })
      .then((r) => r.data),

  getMySchedules: (search) =>
    axiosInstance
      .get('/portal/medicine-schedule/my-schedules', { params: search ? { search } : {} })
      .then((r) => r.data),

  getScheduleById: (id) =>
    axiosInstance.get(`/portal/medicine-schedule/${id}`).then((r) => r.data),

  updateSchedule: (id, payload) =>
    axiosInstance.put(`/portal/medicine-schedule/${id}`, payload).then((r) => r.data),

  deleteSchedule: (id) =>
    axiosInstance.delete(`/portal/medicine-schedule/${id}`).then((r) => r.data),
};
