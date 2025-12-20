import { useEffect, useRef } from 'react';
import MessageItem from './MessageItem';

/**
 * MessageList Component
 * Scrollable container for messages
 */
const MessageList = ({
  messages = [],
  hasMore = false,
  isLoadingOlder = false,
  onLoadOlder,
}) => {
  const listRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Track previous length to decide if we should auto-scroll
  const prevLenRef = useRef(messages.length);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const prevLen = prevLenRef.current;
    const newLen = messages.length;

    // Auto-scroll only when messages are appended (common case: new outgoing/incoming msg)
    if (newLen > prevLen) {
      scrollToBottom();
    }

    prevLenRef.current = newLen;
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 bg-secondary/20">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Send a message to start the conversation</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex-1 overflow-y-auto p-6 bg-secondary/20">
      {hasMore && (
        <div className="flex justify-center mb-4">
          <button
            className="text-sm px-3 py-1 rounded border"
            onClick={onLoadOlder}
            disabled={isLoadingOlder || !onLoadOlder}
          >
            {isLoadingOlder ? 'Loading...' : 'Load older'}
          </button>
        </div>
      )}

      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
