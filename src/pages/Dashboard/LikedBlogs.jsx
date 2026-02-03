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
  Loader2,
  Search,
  HeartOff,
  ExternalLink,
  Sparkles,
  FileText,
  AlertCircle,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import AISummarySheet from '@/components/AI/AISummarySheet';

const LikedBlogs = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  
  // AI Summary Sheet state
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [selectedBlogForSummary, setSelectedBlogForSummary] = useState(null);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch user's liked blogs
  const {
    data: blogsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['liked-blogs'],
    queryFn: async () => {
      const response = await blogService.getMyLikedBlogs();
      return response.data;
    },
  });

  const blogs = blogsData?.blogs || [];

  // Unlike blog mutation
  const unlikeMutation = useMutation({
    mutationFn: blogService.toggleLikeBlog,
    onSuccess: () => {
      queryClient.invalidateQueries(['liked-blogs']);
      toast.success('Blog unliked');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to unlike blog');
    },
  });

  // Handle unlike
  const handleUnlike = (blogId) => {
    if (!user) {
      toast.error('Please log in to manage likes');
      return;
    }
    unlikeMutation.mutate(blogId);
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

  // Get unique categories
  const categories = blogs ? [...new Set(blogs.map(blog => blog.category))].length : 0;
  
  // Get most viewed blog's view count
  const mostViewed = blogs?.length > 0 
    ? Math.max(...blogs.map(blog => blog.views || 0))
    : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8" data-aos="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                Blogs I've Liked
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Blogs you've shown appreciation for
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search liked blogs..."
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Stats */}
        {!isLoading && blogs && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8" data-aos="fade-up">
            <div className="p-4 bg-gradient-to-r from-red-500/10 to-pink-600/10 rounded-xl border border-red-500/20">
              <Heart className="w-6 h-6 text-red-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {blogs.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Liked Blogs
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20">
              <FileText className="w-6 h-6 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {categories}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Categories
              </div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
              <Eye className="w-6 h-6 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {mostViewed}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Most Viewed
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
              Failed to load liked blogs
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Please try again later or refresh the page
            </p>
          </div>
        ) : filteredBlogs?.length === 0 ? (
          <div className="text-center py-16" data-aos="fade-up">
            <HeartOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {searchQuery ? 'No liked blogs found' : "You haven't liked any blogs yet"}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchQuery
                ? 'Try adjusting your search query'
                : 'Like blogs you enjoy to show your appreciation'}
            </p>
            {!searchQuery && (
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
              >
                <ExternalLink className="w-5 h-5" />
                Explore Blogs
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
                {/* Image */}
                <div className="relative overflow-hidden h-48">
                  {blog.image ? (
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#04642a] to-[#15a33d] flex items-center justify-center">
                      <FileText className="w-16 h-16 text-white opacity-50" />
                    </div>
                  )}
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-white/90 dark:bg-gray-900/90 text-[#04642a] backdrop-blur-sm">
                      {blog.category}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-[#04642a] dark:group-hover:text-[#15a33d] transition-colors">
                    {blog.title}
                  </h3>

                  {/* Content Preview */}
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {blog.content
                      .replace(/<[^>]*>/g, '')
                      .replace(/[#*`]/g, '')
                      .substring(0, 100)}
                    ...
                  </p>

                  {/* Author & Date */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <div className="w-6 h-6 rounded-full bg-[#04642a] flex items-center justify-center text-white text-xs font-semibold">
                        {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <span>{blog.author?.name || 'Anonymous'}</span>
                    </div>
                    <span>•</span>
                    <Calendar className="w-3 h-3" />
                    <span>{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      <span>{blog.likeCount || blog.likes?.length || 0}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views || 0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/blog/BlogDetail/${blog._id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Link>
                      <button
                        onClick={() => handleUnlike(blog._id)}
                        disabled={unlikeMutation.isPending}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {unlikeMutation.isPending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <HeartOff className="w-4 h-4" />
                        )}
                        Unlike
                      </button>
                    </div>
                    <button
                      onClick={() => handleSummarize(blog)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                      <Sparkles className="w-4 h-4" />
                      AI Summarize
                    </button>
                  </div>
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
    </div>
  );
};

export default LikedBlogs;
