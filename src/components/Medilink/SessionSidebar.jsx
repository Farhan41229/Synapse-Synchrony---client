import React from 'react';
import { MessageSquare, PlusCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export default function SessionSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  isLoading,
}) {
  return (
    <div className="w-80 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/30">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chat Sessions
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onNewSession}
            className="hover:bg-[#04642a]/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <PlusCircle className="w-5 h-5" />
            )}
          </Button>
        </div>
        <Button
          variant="outline"
          className="w-full justify-start gap-2"
          onClick={onNewSession}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <MessageSquare className="w-4 h-4" />
          )}
          New Session
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.sessionId}
              className={`p-3 rounded-lg text-sm cursor-pointer hover:bg-[#04642a]/5 transition-colors ${
                session.sessionId === currentSessionId
                  ? 'bg-[#04642a]/10 text-[#04642a] dark:bg-[#04642a]/20'
                  : 'bg-white dark:bg-gray-800'
              }`}
              onClick={() => onSessionSelect(session.sessionId)}
            >
              <div className="flex items-center gap-2 mb-1">
                <MessageSquare className="w-4 h-4" />
                <span className="font-medium truncate">
                  {(() => {
                    const firstUserMsg = session.messages.find(m => m.role === 'user');
                    return firstUserMsg?.content?.slice(0, 30) || 'New Chat';
                  })()}
                </span>
              </div>
              <p className="line-clamp-2 text-gray-600 dark:text-gray-400">
                {(() => {
                  const lastNonSystemMsg = [...session.messages].reverse().find(m => m.role !== 'system');
                  return lastNonSystemMsg?.content || 'No messages yet';
                })()}
              </p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {session.messages.length} messages
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {(() => {
                    try {
                      const date = new Date(session.updatedAt);
                      if (isNaN(date.getTime())) {
                        return 'Just now';
                      }
                      return formatDistanceToNow(date, { addSuffix: true });
                    } catch (error) {
                      return 'Just now';
                    }
                  })()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
