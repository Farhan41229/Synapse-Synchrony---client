import React from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatInput({
  message,
  setMessage,
  onSubmit,
  isTyping,
  disabled,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e);
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
      <form
        onSubmit={onSubmit}
        className="max-w-3xl mx-auto flex gap-4 items-end relative"
      >
        <div className="flex-1 relative group">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              disabled ? 'Please wait...' : 'Ask me anything...'
            }
            className={`w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 pr-12 min-h-[48px] max-h-[200px] focus:outline-none focus:ring-2 focus:ring-[#04642a]/50 transition-all duration-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-white ${
              isTyping || disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            rows={1}
            disabled={isTyping || disabled}
            onKeyDown={handleKeyDown}
          />
          <Button
            type="submit"
            size="icon"
            className={`absolute right-1.5 bottom-3.5 h-[36px] w-[36px] rounded-xl transition-all duration-200 bg-[#04642a] hover:bg-[#034d20] shadow-sm shadow-[#04642a]/20 ${
              isTyping || disabled || !message.trim()
                ? 'opacity-50 cursor-not-allowed'
                : 'group-hover:scale-105 group-focus-within:scale-105'
            }`}
            disabled={isTyping || disabled || !message.trim()}
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </form>
      <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
        Press <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800">Enter ↵</kbd>{' '}
        to send,
        <kbd className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 ml-1">
          Shift + Enter
        </kbd>{' '}
        for new line
      </div>
    </div>
  );
}
