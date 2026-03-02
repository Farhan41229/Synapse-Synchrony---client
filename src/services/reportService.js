import { axiosInstance } from '@/lib/axios';

export const reportService = {
  extractAndSave: (title, fileBase64, mimeType) =>
    axiosInstance.post('/portal/reports/extract', { title, fileBase64, mimeType }).then((r) => r.data),

  getMyReports: (search) =>
    axiosInstance.get('/portal/reports/user/my-reports', { params: search ? { search } : {} }).then((r) => r.data),

  getReportById: (id) =>
    axiosInstance.get(`/portal/reports/${id}`).then((r) => r.data),

  updateReport: (id, payload) =>
    axiosInstance.put(`/portal/reports/${id}`, payload).then((r) => r.data),

  deleteReport: (id) =>
    axiosInstance.delete(`/portal/reports/${id}`).then((r) => r.data),
};
