import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';

export default function ChatMessages({ messages, isTyping }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  useEffect(() => {
    if (!isTyping) {
      scrollToBottom();
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto scroll-smooth">
      <div className="max-w-3xl mx-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`px-6 py-8 ${
                msg.role === 'assistant'
                  ? 'bg-gray-50 dark:bg-gray-800/30'
                  : 'bg-white dark:bg-gray-900'
              }`}
            >
              <div className="flex gap-4">
                <div className="w-8 h-8 shrink-0 mt-1">
                  {msg.role === 'assistant' ? (
                    <div className="w-8 h-8 rounded-full bg-[#04642a]/10 text-[#04642a] flex items-center justify-center ring-1 ring-[#04642a]/20">
                      <Bot className="w-5 h-5" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center">
                      <User className="w-5 h-5" />
                    </div>
                  )}
                </div>
                <div className="flex-1 space-y-2 overflow-hidden min-h-[2rem]">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {msg.role === 'assistant' ? 'Medilink AI' : 'You'}
                    </p>
                    {msg.metadata?.analysis && (
                      <Badge variant="secondary" className="text-xs">
                        {msg.metadata.analysis.emotionalState || 'supportive'}
                      </Badge>
                    )}
                  </div>
                  <div className="prose prose-sm dark:prose-invert leading-relaxed max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  {msg.metadata?.analysis?.themes &&
                    msg.metadata.analysis.themes.length > 0 && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Themes: {msg.metadata.analysis.themes.join(', ')}
                      </p>
                    )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-8 flex gap-4 bg-gray-50 dark:bg-gray-800/30"
          >
            <div className="w-8 h-8 shrink-0">
              <div className="w-8 h-8 rounded-full bg-[#04642a]/10 text-[#04642a] flex items-center justify-center ring-1 ring-[#04642a]/20">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-medium text-sm text-gray-900 dark:text-white">
                Medilink AI
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Typing...
              </p>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
