import React from 'react';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { MessageCircle } from 'lucide-react';

const CommentsSection = ({ blogId, commentCount = 0 }) => {
  return (
    <div className="mt-12" data-aos="fade-up">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <MessageCircle className="w-7 h-7 text-[#04642a] dark:text-[#15a33d]" />
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
          Comments {commentCount > 0 && `(${commentCount})`}
        </h3>
      </div>

      {/* Add Comment Form */}
      <div className="mb-8">
        <CommentForm blogId={blogId} />
      </div>

      {/* Divider */}
      <div className="mb-8 border-t border-gray-200 dark:border-gray-700" />

      {/* Comments List */}
      <CommentList blogId={blogId} commentCount={commentCount} />
    </div>
  );
};

export default CommentsSection;
