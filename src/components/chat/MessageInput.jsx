import { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';

/**
 * MessageInput Component
 * Input field with send button
 */
const MessageInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    // Send on Enter, add new line on Shift+Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-20 border-t border-border px-6 flex items-center gap-3"
    >
      {/* Attachment Button */}
      <button
        type="button"
        className="p-2 hover:bg-secondary rounded-lg transition-colors"
        title="Attach File"
        disabled={disabled}
      >
        <Paperclip className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Message Input */}
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1 px-4 py-2 rounded-lg bg-secondary border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {/* Emoji Button */}
      <button
        type="button"
        className="p-2 hover:bg-secondary rounded-lg transition-colors"
        title="Add Emoji"
        disabled={disabled}
      >
        <Smile className="w-5 h-5 text-muted-foreground" />
      </button>

      {/* Send Button */}
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <Send className="w-4 h-4" />
        <span>Send</span>
      </button>
    </form>
  );
};

export default MessageInput;
