import { axiosInstance } from '@/lib/axios';

/**
 * Extract schedule from image using Gemini Vision
 * @param {Object} data - { imageBase64, mimeType }
 * @returns {Promise} - Extracted schedule
 */
export const extractScheduleFromImage = async (data) => {
  const response = await axiosInstance.post('/portal/schedule/extract', data);
  return response.data;
};

/**
 * Get user's active schedule
 * @returns {Promise} - Active schedule
 */
export const getMySchedule = async () => {
  const response = await axiosInstance.get('/portal/schedule/my-schedule');
  return response.data;
};

/**
 * Get schedule by ID
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} - Schedule data
 */
export const getScheduleById = async (scheduleId) => {
  const response = await axiosInstance.get(`/portal/schedule/${scheduleId}`);
  return response.data;
};

/**
 * Update a schedule
 * @param {string} scheduleId - Schedule ID
 * @param {Object} data - { title?, semester?, section?, weeklySchedule? }
 * @returns {Promise} - Updated schedule
 */
export const updateSchedule = async (scheduleId, data) => {
  const response = await axiosInstance.put(`/portal/schedule/${scheduleId}`, data);
  return response.data;
};

/**
 * Delete a schedule
 * @param {string} scheduleId - Schedule ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteSchedule = async (scheduleId) => {
  const response = await axiosInstance.delete(`/portal/schedule/${scheduleId}`);
  return response.data;
};

const scheduleService = {
  extractScheduleFromImage,
  getMySchedule,
  getScheduleById,
  updateSchedule,
  deleteSchedule,
};

export default scheduleService;
