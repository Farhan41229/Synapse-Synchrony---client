import { getOtherUserAndGroup } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { useLocation } from 'react-router';
import AvatarWithBadge from '@/components/DashboardComponents/Shared/Chat/AvatarWithBadge';
import { formatChatTime } from '@/lib/helper';
import { Bot } from 'lucide-react';

const ChatListItem = ({ chat, currentUserId, onClick }) => {
  const { pathname } = useLocation();
  const { lastMessage, createdAt } = chat;

  const { name, avatar, isOnline, isGroup } = getOtherUserAndGroup(
    chat,
    currentUserId
  );

  // ✅ Check if this is an AI chat
  const isAIChat = chat.participants?.some(
    (p) => p.isAI === true || p.name === 'Whoop AI'
  );

  const getLastMessageText = () => {
    if (!lastMessage) {
      return isGroup
        ? chat.createdBy === currentUserId
          ? 'Group created'
          : 'You were added'
        : isAIChat
        ? 'Ask me anything!'
        : 'Send a message';
    }
    if (lastMessage.image) return '📷 Photo';

    if (isGroup && lastMessage.sender) {
      return `${
        lastMessage.sender._id === currentUserId
          ? 'You'
          : lastMessage.sender.name
      }: ${lastMessage.content}`;
    }

    return lastMessage.content;
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        `w-full flex items-center gap-2 p-2 rounded-sm
         hover:bg-sidebar-accent transition-colors text-left`,
        pathname.includes(chat._id) && 'bg-sidebar-accent!',
        isAIChat && 'border-l-2 border-purple-500'
      )}
    >
      {/* Avatar with AI badge */}
      <div className="relative shrink-0">
        <AvatarWithBadge
          name={name}
          src={avatar}
          isGroup={isGroup}
          isOnline={isOnline}
        />
        {isAIChat && (
          <div
            className="absolute -bottom-0.5 -right-0.5 
            w-4 h-4 bg-purple-600 rounded-full 
            flex items-center justify-center
            border border-white"
          >
            <Bot className="w-2.5 h-2.5 text-white" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-1.5">
            <h5 className="text-sm font-semibold truncate">{name}</h5>
            {isAIChat && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded">
                AI
              </span>
            )}
          </div>
          <span className="text-xs ml-2 shrink-0 text-muted-foreground">
            {formatChatTime(lastMessage?.updatedAt || createdAt)}
          </span>
        </div>
        <p className="text-xs truncate text-muted-foreground -mt-px">
          {getLastMessageText()}
        </p>
      </div>
    </button>
  );
};

export default ChatListItem;
