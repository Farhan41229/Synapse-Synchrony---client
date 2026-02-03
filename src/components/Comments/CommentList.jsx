import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import blogService from '@/services/blogService';
import CommentItem from './CommentItem';
import { MessageCircle, Loader2, AlertCircle } from 'lucide-react';

const CommentList = ({ blogId, commentCount }) => {
  const [page, setPage] = useState(1);
  const limit = 20;

  // Fetch comments
  const { data, isLoading, error } = useQuery({
    queryKey: ['blog-comments', blogId, page],
    queryFn: async () => {
      const response = await blogService.getBlogComments(blogId);
      return response.data;
    },
    enabled: !!blogId,
  });

  const comments = data?.comments || [];
  const pagination = data?.pagination;

  // Skeleton Loader
  const SkeletonLoader = () => (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/5" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // Loading State
  if (isLoading && page === 1) {
    return <SkeletonLoader />;
  }

  // Error State
  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Failed to load comments
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error.response?.data?.message || 'Please try again later'}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
        >
          Retry
        </button>
      </div>
    );
  }

  // Empty State
  if (!isLoading && comments.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No comments yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Be the first to share your thoughts!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {/* Comments List */}
      <div className="space-y-0">
        {comments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            blogId={blogId}
            depth={0}
          />
        ))}
      </div>

      {/* Load More Button */}
      {pagination && page < pagination.totalPages && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setPage(page + 1)}
            disabled={isLoading}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-2 border-gray-200 dark:border-gray-700 rounded-lg font-medium hover:border-[#04642a] dark:hover:border-[#15a33d] hover:text-[#04642a] dark:hover:text-[#15a33d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                Load More Comments
              </>
            )}
          </button>
          <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
            Showing {comments.length} of {pagination.totalComments} comments
          </p>
        </div>
      )}
    </div>
  );
};

export default CommentList;
