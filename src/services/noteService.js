import { axiosInstance } from '@/lib/axios';

/**
 * Create a new note
 * @param {Object} data - { title, content, visibility }
 * @returns {Promise} - Created note
 */
export const createNote = async (data) => {
  const response = await axiosInstance.post('/portal/notes', data);
  return response.data;
};

/**
 * Get user's notes
 * @param {Object} params - Optional { visibility, search }
 * @returns {Promise} - Notes list
 */
export const getMyNotes = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  const url = queryParams.toString()
    ? `/portal/notes/user/my-notes?${queryParams.toString()}`
    : '/portal/notes/user/my-notes';
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Get a single note by ID
 * @param {string} noteId - Note ID
 * @returns {Promise} - Note data
 */
export const getNoteById = async (noteId) => {
  const response = await axiosInstance.get(`/portal/notes/${noteId}`);
  return response.data;
};

/**
 * Update a note
 * @param {string} noteId - Note ID
 * @param {Object} data - { title?, content?, visibility? }
 * @returns {Promise} - Updated note
 */
export const updateNote = async (noteId, data) => {
  const response = await axiosInstance.put(`/portal/notes/${noteId}`, data);
  return response.data;
};

/**
 * Delete a note
 * @param {string} noteId - Note ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteNote = async (noteId) => {
  const response = await axiosInstance.delete(`/portal/notes/${noteId}`);
  return response.data;
};

/**
 * Generate note content with AI (plain text)
 * @param {Object} data - { title, additionalContext? }
 * @returns {Promise} - { data: { content: string } }
 */
export const generateNoteWithAI = async (data) => {
  const response = await axiosInstance.post('/portal/notes/ai/generate', data);
  return response.data;
};

/**
 * Extract text from image using Gemini Vision (server-side)
 * @param {Object} data - { imageBase64, mimeType }
 * @returns {Promise} - { data: { text: string } }
 */
export const extractTextWithGemini = async (data) => {
  const response = await axiosInstance.post('/portal/notes/ocr/extract', data);
  return response.data;
};

const noteService = {
  createNote,
  getMyNotes,
  getNoteById,
  updateNote,
  deleteNote,
  generateNoteWithAI,
  extractTextWithGemini,
};

export default noteService;
