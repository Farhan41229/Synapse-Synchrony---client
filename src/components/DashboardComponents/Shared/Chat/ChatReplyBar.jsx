import React from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ChatReplyBar = ({ replyTo, currentUserId, onCancel }) => {
  const replySenderName =
    replyTo?.sender?._id === currentUserId ? 'You' : replyTo?.sender?.name;

  return (
    <div
      className="absolute bottom-[72px] left-0 right-0
      bg-muted/80 backdrop-blur-sm border-t border-border
      px-8.5 py-2 z-[998]
    "
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="w-1 h-10 bg-primary rounded-full" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary">
                Replying to {replySenderName}
              </p>
              <p className="text-sm text-muted-foreground truncate">
                {replyTo?.content || (replyTo?.image ? '📷 Photo' : '')}
              </p>
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8 rounded-full"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatReplyBar;
