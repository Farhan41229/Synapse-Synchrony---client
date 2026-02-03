import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blogService from '@/services/blogService';
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
  Sparkles,
  Volume2,
} from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { format } from 'date-fns';
import { SkeletonLoader } from './SkeletonLoader';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import 'highlight.js/styles/github-dark.css'; // You can change the theme
import AISummarySheet from '@/components/AI/AISummarySheet';
import TextToSpeechPlayer from '@/components/Audio/TextToSpeechPlayer';
import ShareBlogModal from '@/components/Share/ShareBlogModal';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';


const BlogDetail = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  // AI Summary Sheet state
  const [summarySheetOpen, setSummarySheetOpen] = useState(false);
  const [summaryData, setSummaryData] = useState(null);
  const [summaryError, setSummaryError] = useState(null);
  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  
  // TTS Player state
  const [showTTSPlayer, setShowTTSPlayer] = useState(false);
  
  // Share Modal state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  
  // Interaction states
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

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
      const response = await blogService.getBlogById(id);
      // Increment view count
      await blogService.incrementBlogView(id);
      return response.data;
    },
    enabled: !!id,
  });

  // Update like/bookmark status when blog data changes
  useEffect(() => {
    if (blog && user) {
      setIsLiked(blog.likes?.includes(user._id) || false);
      setLikeCount(blog.likeCount || blog.likes?.length || 0);
      
      // Fetch user's bookmarked blogs to check if this blog is bookmarked
      blogService.getMyBookmarkedBlogs().then((response) => {
        const bookmarkedBlogIds = response.data.blogs?.map(b => b._id) || [];
        setIsBookmarked(bookmarkedBlogIds.includes(id));
      }).catch(() => {
        setIsBookmarked(false);
      });
    } else if (blog) {
      setIsLiked(false);
      setIsBookmarked(false);
      setLikeCount(blog.likeCount || blog.likes?.length || 0);
    }
  }, [blog, user, id]);

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: () => blogService.toggleLikeBlog(id),
    onMutate: async () => {
      // Check authentication
      if (!user) {
        toast.error('Please log in to like blogs');
        throw new Error('Not authenticated');
      }

      // Optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
    },
    onSuccess: () => {
      toast.success(isLiked ? 'Blog liked!' : 'Blog unliked');
      queryClient.invalidateQueries(['blog', id]);
    },
    onError: (error) => {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikeCount(isLiked ? likeCount + 1 : likeCount - 1);
      
      if (error.message !== 'Not authenticated') {
        toast.error('Failed to update like');
      }
    },
  });

  // Bookmark mutation
  const bookmarkMutation = useMutation({
    mutationFn: () => blogService.toggleBookmarkBlog(id),
    onMutate: async () => {
      // Check authentication
      if (!user) {
        toast.error('Please log in to bookmark blogs');
        throw new Error('Not authenticated');
      }

      // Optimistic update
      setIsBookmarked(!isBookmarked);
    },
    onSuccess: () => {
      toast.success(isBookmarked ? 'Bookmarked!' : 'Removed from bookmarks');
      queryClient.invalidateQueries(['blog', id]);
    },
    onError: (error) => {
      // Revert optimistic update
      setIsBookmarked(!isBookmarked);
      
      if (error.message !== 'Not authenticated') {
        toast.error('Failed to update bookmark');
      }
    },
  });

  // Handle AI Summarize
  const handleSummarize = async () => {
    setSummaryData(null);
    setSummaryError(null);
    setIsLoadingSummary(true);
    setSummarySheetOpen(true);

    try {
      const response = await blogService.summarizeBlogWithAI(id);
      setSummaryData(response.data);
    } catch (err) {
      setSummaryError(err);
      toast.error('Failed to generate summary');
    } finally {
      setIsLoadingSummary(false);
    }
  };

  // Handle Like
  const handleLike = () => {
    if (!user) {
      toast.error('Please log in to like blogs');
      return;
    }
    likeMutation.mutate();
  };

  // Handle Bookmark
  const handleBookmark = () => {
    if (!user) {
      toast.error('Please log in to bookmark blogs');
      return;
    }
    bookmarkMutation.mutate();
  };

  // Handle Share
  const handleShare = () => {
    setShareModalOpen(true);
  };

  

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
              <div className="w-12 h-12 rounded-full bg-linear-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-semibold text-lg">
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
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                  <span className="font-medium">{likeCount}</span>
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
                  onClick={handleBookmark}
                  disabled={bookmarkMutation.isPending}
                  className={`p-2 rounded-lg transition-all ${
                    isBookmarked
                      ? 'bg-[#04642a] text-white hover:bg-[#15a33d]'
                      : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark'}
                >
                  <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={handleShare}
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

          {/* AI Summarize Button & Listen Button */}
          <div className="mb-6 flex flex-col sm:flex-row gap-3" data-aos="fade-up">
            <button
              onClick={handleSummarize}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg hover:shadow-xl"
            >
              <Sparkles className="w-5 h-5" />
              Summarize with AI
            </button>
            
            <button
              onClick={() => setShowTTSPlayer(!showTTSPlayer)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white rounded-lg font-medium hover:shadow-lg transition-all"
            >
              <Volume2 className="w-5 h-5" />
              {showTTSPlayer ? 'Hide Player' : 'Listen to Blog'}
            </button>
          </div>
          
          {/* TTS Player */}
          {showTTSPlayer && (
            <div className="mb-8" data-aos="fade-down">
              <TextToSpeechPlayer 
                content={blog.content}
                title={blog.title}
              />
            </div>
          )}

          {/* Blog Content with Markdown Rendering */}
          <div
            className="prose prose-lg dark:prose-invert max-w-none mb-10 text-gray-700 dark:text-gray-300 leading-relaxed"
            data-aos="fade-up"
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight, rehypeRaw]}
              components={{
                // Customize heading styles
                h1: ({ node, ...props }) => (
                  <h1 className="text-4xl font-bold mb-4 mt-8 text-gray-900 dark:text-white" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2 className="text-3xl font-bold mb-3 mt-6 text-gray-900 dark:text-white" {...props} />
                ),
                h3: ({ node, ...props }) => (
                  <h3 className="text-2xl font-semibold mb-2 mt-4 text-gray-900 dark:text-white" {...props} />
                ),
                // Customize paragraph styles
                p: ({ node, ...props }) => (
                  <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
                ),
                // Customize code block styles
                code: ({ node, inline, className, children, ...props }) => {
                  if (inline) {
                    return (
                      <code
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 rounded text-sm font-mono"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code
                      className={`${className} block p-4 bg-gray-900 dark:bg-gray-950 rounded-lg text-sm overflow-x-auto`}
                      {...props}
                    >
                      {children}
                    </code>
                  );
                },
                // Customize list styles
                ul: ({ node, ...props }) => (
                  <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
                ol: ({ node, ...props }) => (
                  <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
                ),
                // Customize link styles
                a: ({ node, ...props }) => (
                  <a
                    className="text-[#04642a] dark:text-[#15a33d] hover:underline font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                    {...props}
                  />
                ),
                // Customize blockquote styles
                blockquote: ({ node, ...props }) => (
                  <blockquote
                    className="border-l-4 border-[#04642a] dark:border-[#15a33d] pl-4 py-2 my-4 italic text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-r"
                    {...props}
                  />
                ),
              }}
            >
              {blog.content}
            </ReactMarkdown>
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
              <button
                onClick={handleLike}
                disabled={likeMutation.isPending}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                  isLiked
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-[#04642a] text-white hover:bg-[#15a33d]'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{isLiked ? 'Liked' : 'Like this post'}</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-6 py-2.5 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
              >
                <Share2 className="w-5 h-5" />
                <span>Share</span>
              </button>
            </div>
            <button
              onClick={handleBookmark}
              disabled={bookmarkMutation.isPending}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all ${
                isBookmarked
                  ? 'bg-[#04642a] text-white hover:bg-[#15a33d]'
                  : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
              <span>{isBookmarked ? 'Saved' : 'Save for later'}</span>
            </button>
          </div>

          {/* Author Card */}
          <div
            className="mt-12 p-6 bg-linear-to-r from-[#04642a]/5 to-[#15a33d]/5 dark:from-[#04642a]/10 dark:to-[#15a33d]/10 rounded-xl border border-[#04642a]/20"
            data-aos="fade-up"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-linear-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-bold text-2xl shrink-0">
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

      {/* AI Summary Sheet */}
      <AISummarySheet
        isOpen={summarySheetOpen}
        onClose={() => setSummarySheetOpen(false)}
        summary={summaryData}
        isLoading={isLoadingSummary}
        error={summaryError}
        type="blog"
        title={blog?.title}
      />

      {/* Share Modal */}
      <ShareBlogModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        blogId={id}
        title={blog?.title}
      />
    </div>
  );
};

export default BlogDetail;
