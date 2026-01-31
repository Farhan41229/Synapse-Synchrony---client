import { useAuthStore } from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import { Link } from 'react-router';
import toast from 'react-hot-toast';
import {
  Heart,
  Eye,
  Calendar,
  Edit,
  Trash2,
  Plus,
  FileText,
  AlertCircle,
  Loader2,
  Search,
  MoreVertical,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import AISummarySheet from '@/components/AI/AISummarySheet';

const MyBlogs = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // AI Summary Sheet state
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [selectedBlogForSummary, setSelectedBlogForSummary] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch user's blogs
  const {
    data: blogs,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['myBlogs'],
    queryFn: async () => {
      const response = await blogService.getMyBlogs();
      return response.data;
    },
  });

  // Delete blog mutation
  const deleteBlogMutation = useMutation({
    mutationFn: blogService.deleteBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['myBlogs']);
      toast.success('Blog deleted successfully!');
      setShowDeleteModal(false);
      setSelectedBlog(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete blog');
    },
  });

  // Handle delete
  const handleDelete = (blog) => {
    setSelectedBlog(blog);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (selectedBlog) {
      deleteBlogMutation.mutate(selectedBlog._id);
    }
  };

  // Handle AI Summarize
  const handleSummarize = async (blog) => {
    setSelectedBlogForSummary(blog);
    setSummaryData(null);
    setSummaryError(null);
    setIsLoadingSummary(true);
    setSummarySheetOpen(true);

    try {
      const response = await blogService.summarizeBlogWithAI(blog._id);
      setSummaryData(response.data);
    } catch (err) {
      setSummaryError(err);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Filter blogs based on search
  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-gray-200 dark:bg-gray-800 h-48 rounded-t-xl" />
          <div className="bg-white dark:bg-gray-900 p-6 rounded-b-xl border border-gray-200 dark:border-gray-700">
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3 mb-3" />
            <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                My Blogs
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage and view all your published blog posts
              </p>
            </div>
            <Link
              to="/blog/blogs/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Create New Blog
            </Link>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your blogs..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        {!isLoading && blogs && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" data-aos="fade-up">
            <div className="p-4 bg-gradient-to-r from-[#04642a]/10 to-[#15a33d]/10 dark:from-[#04642a]/20 dark:to-[#15a33d]/20 rounded-xl border border-[#04642a]/20">
              <FileText className="w-6 h-6 text-[#04642a] mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {blogs.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Blogs
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
              <Heart className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {blogs.reduce((sum, blog) => sum + (blog.likeCount || blog.likes?.length || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Likes
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
              <Eye className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Total Views
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-500/10 to-green-600/10 rounded-xl border border-green-500/20">
              <Calendar className="w-6 h-6 text-green-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {blogs.filter((blog) => {
                  const createdDate = new Date(blog.createdAt);
                  const monthAgo = new Date();
                  monthAgo.setMonth(monthAgo.getMonth() - 1);
                  return createdDate > monthAgo;
                }).length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This Month
              </div>
            </div>
          </div>
        )}

        {/* Blogs Grid */}
        {isLoading ? (
          <SkeletonLoader />
        ) : error ? (
          <div className="text-center py-16" data-aos="fade-up">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load blogs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : filteredBlogs?.length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No blogs found' : 'No blogs yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Start sharing your experiences by creating your first blog post'}
            </p>
            {!searchQuery && (
              <Link
                to="/blog/blogs/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Blog
              </Link>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs?.map((blog, index) => (
              <div
                key={blog._id}
                data-aos="fade-up"
                data-aos-delay={index * 50}
                className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
              >
                {/* Blog Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image || 'https://i.ibb.co.com/QvRXjjrG/Study.webp'}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-[#04642a] text-white">
                      {blog.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        blog.isPublished
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-500 text-white'
                      }`}
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                {/* Blog Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-4">
                    {blog.content}
                  </p>

                  {/* Meta Info */}
                  <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 mb-4">
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span>{blog.likeCount || blog.likes?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mb-2">
                    <Link
                      to={`/blog/BlogDetail/${blog._id}`}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </Link>
                    <Link
                      to={`/dashboard/edit-blog/${blog._id}`}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all text-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(blog)}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* AI Summarize Button */}
                  <button
                    onClick={() => handleSummarize(blog)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all text-sm"
                  >
                    <Sparkles className="w-4 h-4" />
                    Summarize with AI
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Summary Sheet */}
      <AISummarySheet
        isOpen={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        summary={summaryData}
        isLoading={isLoadingSummary}
        error={summaryError}
        type="blog"
        title={selectedBlogForSummary?.title}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl"
            data-aos="zoom-in"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Delete Blog?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This action cannot be undone
                </p>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete "<strong>{selectedBlog?.title}</strong>"?
              All comments and interactions will also be removed.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedBlog(null);
                }}
                disabled={deleteBlogMutation.isPending}
                className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteBlogMutation.isPending}
                className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteBlogMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBlogs;
