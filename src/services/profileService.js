import { axiosInstance } from '@/lib/axios';

// ========== PROFILE OPERATIONS ==========

/**
 * Get the current user's profile
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async () => {
  const response = await axiosInstance.get('/portal/profile');
  return response.data;
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise} - Updated user profile
 */
export const updateUserProfile = async (profileData) => {
  const response = await axiosInstance.put('/portal/profile', profileData);
  return response.data;
};

/**
 * Refine bio text using AI
 * @param {string} bio - Bio text to refine
 * @returns {Promise} - Refined bio text
 */
export const refineBioWithAI = async (bio) => {
  const response = await axiosInstance.post('/portal/profile/ai/refine-bio', { bio });
  return response.data;
};
