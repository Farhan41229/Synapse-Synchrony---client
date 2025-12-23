import React, { memo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import AvatarWithBadge from './AvatarWithBadge';
import { formatChatTime } from '@/lib/helper';
import { Button } from '@/components/ui/button';
import { ReplyIcon, Bot, Sparkles } from 'lucide-react';

const ChatBodyMessage = memo(({ message, onReply }) => {
  const { user } = useAuthStore();
  // ✅ CRITICAL: Check if message exists BEFORE accessing any properties
  if (!message) {
    console.warn('ChatBodyMessage received undefined message');
    return null;
  }

  const userId = user?._id || null;
  const isCurrentUser = message?.sender?._id === userId;

  // ✅ Check if this is an AI message
  const isAIMessage =
    message?.sender?.isAI === true || message?.sender?.name === 'Whoop AI';

  // ✅ Check if this is a "thinking" message
  const isThinking =
    message?.status === 'generating...' ||
    message?.content === '⏳ Thinking...';

  const senderName = isCurrentUser ? 'You' : message?.sender?.name || 'Unknown';

  const replySendername =
    message?.replyTo?.sender?._id === userId
      ? 'You'
      : message?.replyTo?.sender?.name || 'Unknown';

  const containerClass = cn(
    'group flex gap-2 py-3 px-4',
    isCurrentUser && 'flex-row-reverse text-left',
    isAIMessage && !isCurrentUser && 'bg-purple-50/50 dark:bg-purple-950/20'
  );

  const contentWrapperClass = cn(
    'max-w-[70%]  flex flex-col relative',
    isCurrentUser && 'items-end'
  );

  const messageClass = cn(
    'min-w-[200px] px-3 py-2 text-sm break-words shadow-sm',
    isCurrentUser
      ? 'bg-accent dark:bg-primary/40 rounded-tr-xl rounded-l-xl'
      : isAIMessage
      ? 'bg-gradient-to-br from-purple-500/10 to-purple-600/10 dark:from-purple-500/20 dark:to-purple-600/20 border border-purple-200/50 dark:border-purple-700/50 rounded-bl-xl rounded-r-xl'
      : 'bg-[#F5F5F5] dark:bg-accent rounded-bl-xl rounded-r-xl'
  );

  const replyBoxClass = cn(
    `mb-2 p-2 text-xs rounded-md border-l-4 shadow-md !text-left`,
    isCurrentUser
      ? 'bg-primary/20 border-l-primary'
      : isAIMessage
      ? 'bg-purple-100 dark:bg-purple-900/30 border-l-purple-500'
      : 'bg-gray-200 dark:bg-secondary border-l-[#CC4A31]'
  );

  return (
    <div className={containerClass}>
      {!isCurrentUser && (
        <div className="shrink-0 flex items-start">
          <div className="relative">
            <AvatarWithBadge
              name={message?.sender?.name || 'Unknown'}
              src={message?.sender?.avatar || ''}
              className={isAIMessage ? 'ring-2 ring-purple-500/50' : ''}
            />
            {isAIMessage && (
              <div
                className="absolute -bottom-0.5 -right-0.5 
                w-4 h-4 bg-purple-600 rounded-full 
                flex items-center justify-center
                border border-white dark:border-gray-900"
              >
                <Bot className="w-2.5 h-2.5 text-white" />
              </div>
            )}
          </div>
        </div>
      )}

      <div className={contentWrapperClass}>
        <div
          className={cn(
            'flex items-center gap-1',
            isCurrentUser && 'flex-row-reverse'
          )}
        >
          <div className={messageClass}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-0.5 pb-1">
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'text-xs font-semibold',
                    isAIMessage && 'text-purple-700 dark:text-purple-300'
                  )}
                >
                  {senderName}
                </span>
                {isAIMessage && (
                  <span className="px-1.5 py-0.5 text-[9px] font-medium bg-purple-600 text-white rounded">
                    AI
                  </span>
                )}
              </div>
              <span className="text-[11px] text-gray-700 dark:text-gray-300">
                {formatChatTime(message?.createdAt)}
              </span>
            </div>

            {/* ReplyToBox */}
            {message?.replyTo && (
              <div className={replyBoxClass}>
                <h5 className="font-medium">{replySendername}</h5>
                <p
                  className="font-normal text-muted-foreground
                 max-w-[250px]  truncate
                "
                >
                  {message?.replyTo?.content ||
                    (message?.replyTo?.image ? '📷 Photo' : '')}
                </p>
              </div>
            )}

            {message?.image && (
              <img src={message.image} alt="" className="rounded-lg max-w-xs" />
            )}

            {/* ✅ Message content with thinking indicator */}
            {message?.content && (
              <p
                className={cn(
                  isThinking &&
                    'flex items-center gap-2 text-purple-600 dark:text-purple-400'
                )}
              >
                {isThinking && <Sparkles className="w-4 h-4 animate-pulse" />}
                {message.content}
              </p>
            )}
          </div>

          {/* Reply Icon Button - Hide for AI messages */}
          {!isAIMessage && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => onReply(message)}
              className="flex opacity-0 group-hover:opacity-100
              transition-opacity rounded-full size-8!
              "
            >
              <ReplyIcon
                size={16}
                className={cn(
                  'text-gray-500 dark:text-white stroke-[1.9]!',
                  isCurrentUser && 'scale-x-[-1]'
                )}
              />
            </Button>
          )}
        </div>

        {message?.status && (
          <span
            className="block
           text-[10px] text-gray-400 mt-0.5"
          >
            {message.status}
          </span>
        )}
      </div>
    </div>
  );
});

ChatBodyMessage.displayName = 'ChatBodyMessage';

export default ChatBodyMessage;
