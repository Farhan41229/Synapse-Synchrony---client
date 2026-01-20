import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '@/lib/axios';
import {
  Calendar,
  Clock,
  Heart,
  Eye,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  MessageCircle,
  Tag,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';

const BlogDetail = () => {
  const { id } = useParams();

  useEffect(() => {
    AOS.init({ duration: 800, once: true, easing: 'ease-in-out' });
  }, []);

  // Fetch blog details
  const {
    data: blog,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['blog', id],
    queryFn: async () => {
      const response = await axiosInstance.get(`/portal/blogs/${id}`);
      // Increment view count
      await axiosInstance.patch(`/portal/blogs/${id}/view`);
      return response.data.data;
    },
    enabled: !!id,
  });

  // Skeleton Loader Component
  const SkeletonLoader = () => (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button Skeleton */}
        <div className="h-10 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8 animate-pulse" />

        {/* Header Skeleton */}
        <div className="mb-8 space-y-4">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
        </div>

        {/* Author & Meta Skeleton */}
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
              <div className="h-3 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
          </div>
        </div>

        {/* Image Skeleton */}
        <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-xl mb-8 animate-pulse" />

        {/* Content Skeleton */}
        <div className="space-y-4 mb-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse"
              style={{ width: i === 6 ? '60%' : '100%' }}
            />
          ))}
        </div>

        {/* Tags Skeleton */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-8 w-20 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );

  // Error State
  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center" data-aos="fade-up">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The blog post you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Portal
          </Link>
        </div>
      </div>
    );
  }

  // Loading State
  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#04642a] dark:hover:text-[#15a33d] transition-colors mb-8 group"
          data-aos="fade-right"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Portal</span>
        </Link>

        {/* Blog Header */}
        <article data-aos="fade-up">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-1.5 text-sm font-semibold rounded-full bg-[#04642a]/10 dark:bg-[#04642a]/20 text-[#04642a] dark:text-[#15a33d] border border-[#04642a]/20">
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Author & Meta Info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
            {/* Author Info */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-semibold text-lg">
                {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white font-semibold">
                  <User className="w-4 h-4" />
                  <span>{blog.author?.name || 'Anonymous'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {format(new Date(blog.createdAt), 'MMMM dd, yyyy')}
                  </span>
                  <span>•</span>
                  <Clock className="w-3 h-3" />
                  <span>
                    {Math.ceil(blog.content.split(' ').length / 200)} min read
                  </span>
                </div>
              </div>
            </div>

            {/* Stats & Actions */}
            <div className="flex items-center gap-4">
              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">
                    {blog.likeCount || blog.likes?.length || 0}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-5 h-5" />
                  <span className="font-medium">{blog.views || 0}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">{blog.commentCount || 0}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Bookmark"
                >
                  <Bookmark className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          {blog.image && (
            <div
              className="mb-10 rounded-xl overflow-hidden"
              data-aos="zoom-in"
            >
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-auto max-h-[500px] object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-10"
            data-aos="fade-up"
          >
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {blog.content}
            </div>
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mb-8" data-aos="fade-up">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Tags:
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 text-sm rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div
            className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700"
            data-aos="fade-up"
          >
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-6 py-2.5 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all">
                <Heart className="w-5 h-5" />
                <span>Like this post</span>
              </button>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            <button className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              <Bookmark className="w-5 h-5" />
              <span>Save for later</span>
            </button>
          </div>

          {/* Author Card */}
          <div
            className="mt-12 p-6 bg-gradient-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20"
            data-aos="fade-up"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {blog.author?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  About the Author
                </h3>
                <p className="text-lg font-semibold text-[#04642a] dark:text-[#15a33d] mb-2">
                  {blog.author?.name || 'Anonymous'}
                </p>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {blog.author?.email || 'Student at UIU'}
                </p>
                <Link
                  to={`/blog/all?author=${blog.author?._id}`}
                  className="inline-flex items-center gap-2 text-[#04642a] dark:text-[#15a33d] font-medium hover:underline"
                >
                  View all posts by {blog.author?.name || 'this author'}
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Link>
              </div>
            </div>
          </div>

          {/* Comments Section Placeholder */}
          <div className="mt-12" data-aos="fade-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Comments ({blog.commentCount || 0})
              </h3>
            </div>
            <div className="p-8 text-center bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Comments section coming soon!
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Soon you'll be able to share your thoughts and engage with other
                readers.
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default BlogDetail;
