import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

/**
 * MessageItem Component
 * Individual message bubble
 */
const MessageItem = ({ message }) => {
  const { user } = useAuthStore();

  // Supports:
  // - senderId: "userId"
  // - senderId: { _id, name, ... }
  // - sender: { _id, name, ... }  (from your normalizeMessage)
  const senderUserId =
    message?.senderId?._id ||
    message?.sender?._id ||
    message?.senderId ||
    message?.sender ||
    null;

  const currentUserId = user?._id || user?.id || null;

  const isOwnMessage = !!senderUserId && !!currentUserId && senderUserId === currentUserId;

  const senderName =
    message?.senderName ||
    message?.sender?.name ||
    message?.senderId?.name ||
    null;

  const isDeleted = !!message?.isDeleted;

  const timestamp = message?.createdAt
    ? format(new Date(message.createdAt), 'h:mm a')
    : '';

  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`
          max-w-[70%] rounded-2xl px-4 py-2
          ${isOwnMessage ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground'}
        `}
      >
        {/* Sender Name (only for received messages in groups) */}
        {!isOwnMessage && senderName && (
          <p className="text-xs font-semibold mb-1 opacity-70">{senderName}</p>
        )}

        {/* Message Content */}
        {isDeleted ? (
          <p className="text-sm break-words italic opacity-70">This message was deleted</p>
        ) : (
          <p className="text-sm break-words">{message?.content}</p>
        )}

        {/* Timestamp */}
        <p
          className={`
            text-xs mt-1 text-right
            ${isOwnMessage ? 'opacity-70' : 'text-muted-foreground'}
          `}
        >
          {timestamp}
        </p>
      </div>
    </div>
  );
};

export default MessageItem;
