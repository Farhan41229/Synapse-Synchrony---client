import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import blogService from '@/services/blogService';
import toast from 'react-hot-toast';
import { Send, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router';

const CommentForm = ({ 
  blogId, 
  parentComment = null, 
  onSuccess, 
  onCancel,
  placeholder = 'Write a comment...'
}) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [content, setContent] = useState('');
  const maxLength = 1000;

  // Add comment mutation
  const addCommentMutation = useMutation({
    mutationFn: (data) => blogService.addBlogComment(blogId, data),
    onSuccess: () => {
      setContent('');
      toast.success(parentComment ? 'Reply added successfully!' : 'Comment added successfully!');
      queryClient.invalidateQueries(['blog-comments', blogId]);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add comment');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to comment');
      return;
    }

    const trimmedContent = content.trim();
    if (trimmedContent.length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }

    if (trimmedContent.length > maxLength) {
      toast.error(`Comment must be less than ${maxLength} characters`);
      return;
    }

    addCommentMutation.mutate({
      content: trimmedContent,
      parentComment: parentComment || undefined,
    });
  };

  const handleCancel = () => {
    setContent('');
    onCancel?.();
  };

  const isValid = content.trim().length > 0 && content.length <= maxLength;
  const isOverLimit = content.length > maxLength;

  // Not logged in
  if (!user) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          Please log in to join the discussion
        </p>
        <div className="flex justify-center gap-3">
          <Link
            to="/auth/login"
            className="px-6 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all"
          >
            Log In
          </Link>
          <Link
            to="/auth/signup"
            className="px-6 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
          >
            Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          rows={parentComment ? 2 : 3}
          disabled={addCommentMutation.isPending}
          className={`w-full px-4 py-3 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white border ${
            isOverLimit 
              ? 'border-red-500 focus:border-red-600' 
              : 'border-gray-200 dark:border-gray-700 focus:border-[#04642a]'
          } focus:outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed`}
        />
        {/* Character Counter */}
        <div className={`absolute bottom-2 right-2 text-xs font-medium ${
          isOverLimit 
            ? 'text-red-500' 
            : content.length > maxLength * 0.9 
              ? 'text-yellow-600 dark:text-yellow-500' 
              : 'text-gray-400 dark:text-gray-500'
        }`}>
          {content.length}/{maxLength}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-2">
        {parentComment && onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={addCommentMutation.isPending}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || addCommentMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2 bg-[#04642a] text-white rounded-lg font-medium hover:bg-[#15a33d] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addCommentMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Posting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              {parentComment ? 'Reply' : 'Comment'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
