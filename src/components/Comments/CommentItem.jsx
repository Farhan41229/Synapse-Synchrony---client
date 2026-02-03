import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import blogService from '@/services/blogService';
import toast from 'react-hot-toast';
import { 
  Heart, 
  MessageCircle, 
  Edit2, 
  Trash2, 
  Loader2,
  MoreVertical,
  Check,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CommentForm from './CommentForm';

const CommentItem = ({ comment, blogId, depth = 0, onDelete, onUpdate }) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loadingMoreReplies, setLoadingMoreReplies] = useState(false);
  const [allReplies, setAllReplies] = useState(comment.replies || []);
  const [showAllReplies, setShowAllReplies] = useState(false);

  const isAuthor = user && comment.author._id === user._id;
  const isLiked = user && comment.likes?.includes(user._id);
  const likeCount = comment.likeCount || comment.likes?.length || 0;
  const replyCount = comment.replyCount || 0;
  const initialRepliesShown = comment.replies?.length || 0;
  const hasMoreReplies = replyCount > initialRepliesShown;
  
  // Only allow replies on top-level comments (depth 0)
  const canReply = depth === 0;

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: () => blogService.toggleLikeComment(comment._id),
    onMutate: async () => {
      if (!user) {
        toast.error('Please log in to like comments');
        throw new Error('Not authenticated');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-comments', blogId]);
      toast.success(isLiked ? 'Unliked' : 'Liked!');
    },
    onError: (error) => {
      if (error.message !== 'Not authenticated') {
        toast.error('Failed to update like');
      }
    },
  });

  // Edit mutation
  const editMutation = useMutation({
    mutationFn: (content) => blogService.updateBlogComment(comment._id, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-comments', blogId]);
      toast.success('Comment updated successfully!');
      setIsEditing(false);
      onUpdate?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update comment');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => blogService.deleteBlogComment(comment._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-comments', blogId]);
      toast.success('Comment deleted successfully!');
      setShowDeleteConfirm(false);
      onDelete?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    },
  });

  // Load more replies
  const loadMoreReplies = async () => {
    setLoadingMoreReplies(true);
    try {
      const response = await blogService.getCommentReplies(comment._id);
      setAllReplies(response.data.replies);
      setShowAllReplies(true);
      toast.success('Loaded all replies');
    } catch (error) {
      toast.error('Failed to load replies');
    } finally {
      setLoadingMoreReplies(false);
    }
  };

  const handleEdit = () => {
    setEditContent(comment.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    const trimmed = editContent.trim();
    if (trimmed.length === 0) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (trimmed.length > 1000) {
      toast.error('Comment must be less than 1000 characters');
      return;
    }
    editMutation.mutate(trimmed);
  };

  const handleCancelEdit = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate();
  };

  const handleReplySuccess = () => {
    setShowReplyForm(false);
    // Refresh to show new reply
    queryClient.invalidateQueries(['blog-comments', blogId]);
  };

  const repliesToShow = showAllReplies ? allReplies : (comment.replies || []);

  return (
    <div className={`${depth > 0 ? 'ml-8 pl-4 border-l-2 border-gray-200 dark:border-gray-700' : ''}`}>
      <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center text-white font-semibold text-sm shrink-0">
              {comment.author?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            
            {/* Author & Time */}
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {comment.author?.name || 'Anonymous'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {isEditing ? (
          <div className="mb-3 space-y-2">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={3}
              disabled={editMutation.isPending}
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 focus:border-[#04642a] focus:outline-none transition-all resize-none"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {editContent.length}/1000
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancelEdit}
                  disabled={editMutation.isPending}
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  disabled={editMutation.isPending}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#04642a] text-white rounded-lg text-sm font-medium hover:bg-[#15a33d] transition-all"
                >
                  {editMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  Save
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap break-words">
            {comment.content}
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-4 text-sm">
          {/* Like Button */}
          <button
            onClick={() => likeMutation.mutate()}
            disabled={likeMutation.isPending}
            className={`inline-flex items-center gap-1.5 font-medium transition-all ${
              isLiked
                ? 'text-red-500 hover:text-red-600'
                : 'text-gray-600 dark:text-gray-400 hover:text-red-500'
            }`}
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
            <span>{likeCount}</span>
          </button>

          {/* Reply Button */}
          {canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-[#04642a] dark:hover:text-[#15a33d] font-medium transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Reply
            </button>
          )}

          {/* Edit Button (author only) */}
          {isAuthor && !isEditing && (
            <button
              onClick={handleEdit}
              className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-blue-500 font-medium transition-all"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
          )}

          {/* Delete Button (author only) */}
          {isAuthor && !isEditing && (
            <>
              {!showDeleteConfirm ? (
                <button
                  onClick={handleDelete}
                  className="inline-flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 font-medium transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              ) : (
                <div className="inline-flex items-center gap-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Confirm?</span>
                  <button
                    onClick={confirmDelete}
                    disabled={deleteMutation.isPending}
                    className="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-all"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Yes'}
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    disabled={deleteMutation.isPending}
                    className="px-2 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    No
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Reply Form */}
      {showReplyForm && canReply && (
        <div className="ml-8 mb-4">
          <CommentForm
            blogId={blogId}
            parentComment={comment._id}
            onSuccess={handleReplySuccess}
            onCancel={() => setShowReplyForm(false)}
            placeholder={`Reply to ${comment.author?.name}...`}
          />
        </div>
      )}

      {/* Nested Replies */}
      {repliesToShow.length > 0 && (
        <div className="space-y-0">
          {repliesToShow.map((reply) => (
            <CommentItem
              key={reply._id}
              comment={reply}
              blogId={blogId}
              depth={depth + 1}
              onDelete={() => queryClient.invalidateQueries(['blog-comments', blogId])}
              onUpdate={() => queryClient.invalidateQueries(['blog-comments', blogId])}
            />
          ))}
        </div>
      )}

      {/* Load More Replies Button */}
      {hasMoreReplies && !showAllReplies && (
        <div className="ml-8 mb-4">
          <button
            onClick={loadMoreReplies}
            disabled={loadingMoreReplies}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#04642a] dark:text-[#15a33d] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all"
          >
            {loadingMoreReplies ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <MessageCircle className="w-4 h-4" />
                Load {replyCount - initialRepliesShown} more {replyCount - initialRepliesShown === 1 ? 'reply' : 'replies'}
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
