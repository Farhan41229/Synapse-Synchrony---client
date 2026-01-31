import { axiosInstance } from '@/lib/axios';

// ========== EVENT CRUD OPERATIONS ==========

/**
 * Get all events with optional filters
 * @param {Object} params - Query parameters (page, limit, search, eventType, status, tags)
 * @returns {Promise} - Event list with pagination
 */
export const getAllEvents = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const response = await axiosInstance.get(`/portal/events?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get a single event by ID
 * @param {string} eventId - Event ID
 * @returns {Promise} - Event data
 */
export const getEventById = async (eventId) => {
  const response = await axiosInstance.get(`/portal/events/${eventId}`);
  return response.data;
};

/**
 * Get user's own events
 * @returns {Promise} - User's event list
 */
export const getMyEvents = async () => {
  const response = await axiosInstance.get('/portal/events/user/created');
  return response.data;
};

/**
 * Get popular/featured events
 * @param {number} limit - Number of events to fetch
 * @returns {Promise} - Popular event list
 */
export const getPopularEvents = async (limit = 10) => {
  const response = await axiosInstance.get(`/portal/events/popular?limit=${limit}`);
  return response.data;
};

/**
 * Create a new event
 * @param {Object} eventData - Event data (title, description, eventType, startDate, endDate, location, capacity, tags, etc.)
 * @returns {Promise} - Created event
 */
export const createEvent = async (eventData) => {
  const response = await axiosInstance.post('/portal/events', eventData);
  return response.data;
};

/**
 * Update an event
 * @param {string} eventId - Event ID
 * @param {Object} updateData - Updated event data
 * @returns {Promise} - Updated event
 */
export const updateEvent = async (eventId, updateData) => {
  const response = await axiosInstance.put(`/portal/events/${eventId}`, updateData);
  return response.data;
};

/**
 * Delete an event
 * @param {string} eventId - Event ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/portal/events/${eventId}`);
  return response.data;
};

/**
 * Register for an event
 * @param {string} eventId - Event ID
 * @returns {Promise} - Registration confirmation
 */
export const registerForEvent = async (eventId) => {
  const response = await axiosInstance.post(`/portal/events/${eventId}/register`);
  return response.data;
};

/**
 * Unregister from an event
 * @param {string} eventId - Event ID
 * @returns {Promise} - Unregistration confirmation
 */
export const unregisterFromEvent = async (eventId) => {
  const response = await axiosInstance.delete(`/portal/events/${eventId}/register`);
  return response.data;
};

/**
 * Get registered users for an event (organizer only)
 * @param {string} eventId - Event ID
 * @returns {Promise} - List of registered users
 */
export const getEventRegistrations = async (eventId) => {
  const response = await axiosInstance.get(`/portal/events/${eventId}/registrations`);
  return response.data;
};

// ========== AI FEATURES ==========

/**
 * Generate event details with AI
 * @param {Object} data - { title, additionalContext }
 * @returns {Promise} - AI-generated event details (description, type, duration, capacity, tags, etc.)
 */
export const generateEventWithAI = async (data) => {
  const response = await axiosInstance.post('/portal/events/ai/generate', data);
  return response.data;
};

/**
 * Summarize an event with AI
 * @param {string} eventId - Event ID
 * @returns {Promise} - AI-generated summary, highlights, target audience, and expectations
 */
export const summarizeEventWithAI = async (eventId) => {
  const response = await axiosInstance.get(`/portal/events/${eventId}/ai/summarize`);
  return response.data;
};

// Export all functions as a default object
const eventService = {
  getAllEvents,
  getEventById,
  getMyEvents,
  getPopularEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getEventRegistrations,
  generateEventWithAI,
  summarizeEventWithAI,
};

export default eventService;
