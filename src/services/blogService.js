import { axiosInstance } from '@/lib/axios';

// ========== BLOG CRUD OPERATIONS ==========

/**
 * Get all blogs with optional filters
 * @param {Object} params - Query parameters (page, limit, search, category, tags)
 * @returns {Promise} - Blog list with pagination
 */
export const getAllBlogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const response = await axiosInstance.get(`/portal/blogs?${queryParams.toString()}`);
  return response.data;
};

/**
 * Get a single blog by ID
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Blog data
 */
export const getBlogById = async (blogId) => {
  const response = await axiosInstance.get(`/portal/blogs/${blogId}`);
  return response.data;
};

/**
 * Get user's own blogs
 * @returns {Promise} - User's blog list
 */
export const getMyBlogs = async () => {
  const response = await axiosInstance.get('/portal/blogs/user/my-blogs');
  return response.data;
};

/**
 * Get popular blogs
 * @param {number} limit - Number of blogs to fetch
 * @returns {Promise} - Popular blog list
 */
export const getPopularBlogs = async (limit = 10) => {
  const response = await axiosInstance.get(`/portal/blogs/popular?limit=${limit}`);
  return response.data;
};

/**
 * Create a new blog
 * @param {Object} blogData - Blog data (title, content, category, image, tags)
 * @returns {Promise} - Created blog
 */
export const createBlog = async (blogData) => {
  const response = await axiosInstance.post('/portal/blogs', blogData);
  return response.data;
};

/**
 * Update a blog
 * @param {string} blogId - Blog ID
 * @param {Object} updateData - Updated blog data
 * @returns {Promise} - Updated blog
 */
export const updateBlog = async (blogId, updateData) => {
  const response = await axiosInstance.put(`/portal/blogs/${blogId}`, updateData);
  return response.data;
};

/**
 * Delete a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteBlog = async (blogId) => {
  const response = await axiosInstance.delete(`/portal/blogs/${blogId}`);
  return response.data;
};

/**
 * Toggle like on a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Updated like status
 */
export const toggleLikeBlog = async (blogId) => {
  const response = await axiosInstance.patch(`/portal/blogs/${blogId}/like`);
  return response.data;
};

/**
 * Increment blog view count
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Updated view count
 */
export const incrementBlogView = async (blogId) => {
  const response = await axiosInstance.patch(`/portal/blogs/${blogId}/view`);
  return response.data;
};

/**
 * Toggle bookmark on a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Updated bookmark status
 */
export const toggleBookmarkBlog = async (blogId) => {
  const response = await axiosInstance.patch(`/portal/blogs/${blogId}/bookmark`);
  return response.data;
};

/**
 * Get user's bookmarked blogs
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Bookmarked blog list with pagination
 */
export const getMyBookmarkedBlogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const response = await axiosInstance.get(`/portal/blogs/user/my-bookmarks?${queryParams.toString()}`);
  return response.data;
};

/**
 * Increment blog share count
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Updated share count
 */
export const incrementBlogShare = async (blogId) => {
  const response = await axiosInstance.patch(`/portal/blogs/${blogId}/share`);
  return response.data;
};

/**
 * Get user's liked blogs
 * @param {Object} params - Query parameters (page, limit)
 * @returns {Promise} - Liked blog list with pagination
 */
export const getMyLikedBlogs = async (params = {}) => {
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) queryParams.append(key, value);
  });
  
  const response = await axiosInstance.get(`/portal/blogs/user/my-liked-blogs?${queryParams.toString()}`);
  return response.data;
};

// ========== BLOG COMMENTS ==========

/**
 * Get comments for a blog
 * @param {string} blogId - Blog ID
 * @returns {Promise} - Comments list
 */
export const getBlogComments = async (blogId) => {
  const response = await axiosInstance.get(`/portal/blogs/${blogId}/comments`);
  return response.data;
};

/**
 * Add a comment to a blog
 * @param {string} blogId - Blog ID
 * @param {Object} commentData - Comment data (content, parentId)
 * @returns {Promise} - Created comment
 */
export const addBlogComment = async (blogId, commentData) => {
  const response = await axiosInstance.post(`/portal/blogs/${blogId}/comments`, commentData);
  return response.data;
};

/**
 * Update a comment
 * @param {string} commentId - Comment ID
 * @param {Object} updateData - Updated comment data
 * @returns {Promise} - Updated comment
 */
export const updateBlogComment = async (commentId, updateData) => {
  const response = await axiosInstance.put(`/portal/blogs/comments/${commentId}`, updateData);
  return response.data;
};

/**
 * Delete a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} - Deletion confirmation
 */
export const deleteBlogComment = async (commentId) => {
  const response = await axiosInstance.delete(`/portal/blogs/comments/${commentId}`);
  return response.data;
};

/**
 * Toggle like on a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} - Updated like status
 */
export const toggleLikeComment = async (commentId) => {
  const response = await axiosInstance.patch(`/portal/blogs/comments/${commentId}/like`);
  return response.data;
};

/**
 * Get replies for a comment
 * @param {string} commentId - Comment ID
 * @returns {Promise} - Replies list
 */
export const getCommentReplies = async (commentId) => {
  const response = await axiosInstance.get(`/portal/blogs/comments/${commentId}/replies`);
  return response.data;
};

// ========== AI FEATURES ==========

/**
 * Generate blog content with AI
 * @param {Object} data - { title, additionalContext }
 * @returns {Promise} - AI-generated blog content, category, and tags
 */
export const generateBlogWithAI = async (data) => {
  const response = await axiosInstance.post('/portal/blogs/ai/generate', data);
  return response.data;
};

/**
 * Summarize a blog with AI
 * @param {string} blogId - Blog ID
 * @returns {Promise} - AI-generated summary, key points, and reading time
 */
export const summarizeBlogWithAI = async (blogId) => {
  const response = await axiosInstance.get(`/portal/blogs/${blogId}/ai/summarize`);
  return response.data;
};

// Export all functions as a default object
const blogService = {
  getAllBlogs,
  getBlogById,
  getMyBlogs,
  getPopularBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  toggleLikeBlog,
  incrementBlogView,
  toggleBookmarkBlog,
  getMyBookmarkedBlogs,
  incrementBlogShare,
  getMyLikedBlogs,
  getBlogComments,
  addBlogComment,
  updateBlogComment,
  deleteBlogComment,
  toggleLikeComment,
  getCommentReplies,
  generateBlogWithAI,
  summarizeBlogWithAI,
};

export default blogService;
