import React, { useState, useEffect, useRef } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { medilinkService } from '@/services/medilinkService';
import { MessageSquare, Send, X, Minimize2, Maximize2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export default function MedilinkChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const scrollRef = useRef(null);

  // Create session on mount
  const { mutate: createSession, isPending: isCreatingSession } = useMutation({
    mutationFn: medilinkService.createSession,
    onSuccess: (data) => {
      if (data.success) {
        setSessionId(data.sessionId);
        // Add welcome message
        setMessages([
          {
            role: 'assistant',
            content: "Hi! I'm Medilink AI. I'm here to provide a safe, supportive space for you. How are you feeling today?",
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    },
  });

  // Send message mutation
  const { mutate: sendMsg, isPending: isSending } = useMutation({
    mutationFn: ({ sessionId, message }) =>
      medilinkService.sendMessage(sessionId, message),
    onSuccess: (data) => {
      if (data.success) {
        // Add AI response to messages with mood, stress, and suggestions
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.data.response,
            timestamp: new Date().toISOString(),
            metadata: { 
              analysis: {
                mood: data.data.moodReport,
                stress: data.data.stressReport,
                suggestions: data.data.suggestions || null,
              }
            },
          },
        ]);
      }
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleOpen = () => {
    setIsOpen(true);
    if (!sessionId && !isCreatingSession) {
      createSession();
    }
  };

  const handleSend = () => {
    if (!inputMessage.trim() || !sessionId || isSending) return;

    // Add user message immediately
    const userMsg = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Send to backend
    sendMsg({ sessionId, message: inputMessage });
    setInputMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={handleOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 flex items-center justify-center z-50"
        >
          <MessageSquare className="h-6 w-6" />
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-6 right-6 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 flex flex-col ${
              isMinimized ? 'h-16 w-80' : 'h-[600px] w-96'
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-[#04642a] to-[#15a33d] rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white">Medilink AI</h3>
                  <p className="text-xs text-white/80">Your mental health companion</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  {isMinimized ? (
                    <Maximize2 className="h-4 w-4" />
                  ) : (
                    <Minimize2 className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-4"
                >
                  {isCreatingSession ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-8 w-8 animate-spin text-[#04642a]" />
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-3 ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        {msg.role === 'assistant' && (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center flex-shrink-0">
                            <MessageSquare className="h-4 w-4 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[75%] rounded-2xl p-3 ${
                            msg.role === 'user'
                              ? 'bg-[#04642a] text-white'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                          <span className="text-xs opacity-70 mt-1 block">
                            {formatDistanceToNow(new Date(msg.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                  {isSending && (
                    <div className="flex gap-3 justify-start">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] flex items-center justify-center">
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl p-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Thinking...
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      disabled={!sessionId || isSending}
                      className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#04642a] disabled:opacity-50"
                    />
                    <button
                      onClick={handleSend}
                      disabled={!inputMessage.trim() || !sessionId || isSending}
                      className="h-10 w-10 rounded-full bg-gradient-to-r from-[#04642a] to-[#15a33d] text-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
