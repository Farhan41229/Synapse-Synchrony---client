import axios from 'axios';

/**
 * Search users for starting new chats.
 * Backend: GET /api/search/users?q=term
 */
export const searchUsers = async (q) => {
  const query = (q || '').trim();
  if (!query) return [];

  const res = await axios.get('/search/users', { params: { q: query } });

  // Expected: { success, data: { users: [...] } }
  return res.data?.data?.users || [];
};
