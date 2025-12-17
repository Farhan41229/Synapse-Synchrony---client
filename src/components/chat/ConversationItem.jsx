import { formatDistanceToNow } from 'date-fns';

/**
 * ConversationItem Component
 * Individual conversation card in the sidebar
 */
const ConversationItem = ({ conversation, isActive, onClick }) => {
  const {
    name,
    avatar,
    lastMessage,
    updatedAt,
    unreadCount = 0,
  } = conversation;

  // Format timestamp
  const timeAgo = updatedAt
    ? formatDistanceToNow(new Date(updatedAt), { addSuffix: true })
    : '';

  return (
    <div
      onClick={onClick}
      className={`
        flex items-start gap-3 p-4 cursor-pointer transition-colors
        hover:bg-secondary/50
        ${isActive ? 'bg-secondary' : ''}
      `}
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">
              {name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-1">
          <h3 className="font-semibold truncate">{name || 'Unknown'}</h3>
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {timeAgo}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground truncate">
            {lastMessage?.content || 'No messages yet'}
          </p>
          {unreadCount > 0 && (
            <span className="flex-shrink-0 bg-primary text-primary-foreground text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConversationItem;
