import { format } from 'date-fns';
import { useAuthStore } from '../../store/authStore';

/**
 * MessageItem Component
 * Individual message bubble
 */
const MessageItem = ({ message }) => {
  const { user } = useAuthStore();
  const { content, senderId, createdAt, senderName } = message;

  // Check if message is from current user
  const isOwnMessage = senderId === user?.id;

  // Format timestamp
  const timestamp = createdAt
    ? format(new Date(createdAt), 'h:mm a')
    : '';

  return (
    <div
      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`
          max-w-[70%] rounded-2xl px-4 py-2
          ${
            isOwnMessage
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-foreground'
          }
        `}
      >
        {/* Sender Name (only for received messages in groups) */}
        {!isOwnMessage && senderName && (
          <p className="text-xs font-semibold mb-1 opacity-70">
            {senderName}
          </p>
        )}

        {/* Message Content */}
        <p className="text-sm break-words">{content}</p>

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
