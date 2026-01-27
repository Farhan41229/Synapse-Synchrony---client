import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Loader2, Heart, Activity, Lightbulb, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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
                <div className="flex-1 space-y-3 overflow-hidden min-h-[2rem]">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {msg.role === 'assistant' ? 'Medilink AI' : 'You'}
                    </p>
                  </div>
                  <div className="prose prose-sm dark:prose-invert leading-relaxed max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>

                  {/* NEW: Display Mood & Stress Reports */}
                  {msg.role === 'assistant' && msg.metadata?.analysis?.mood && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {/* Mood Report */}
                      <Card className="border-pink-200 dark:border-pink-800 bg-pink-50/50 dark:bg-pink-900/10">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-pink-500" />
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                Mood Detected
                              </span>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {msg.metadata.analysis.mood.intensity}/10
                            </Badge>
                          </div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {msg.metadata.analysis.mood.mood}
                          </p>
                          {msg.metadata.analysis.mood.emotions && (
                            <div className="flex flex-wrap gap-1">
                              {msg.metadata.analysis.mood.emotions.slice(0, 3).map((emotion, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {emotion}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Stress Report */}
                      <Card className="border-orange-200 dark:border-orange-800 bg-orange-50/50 dark:bg-orange-900/10">
                        <CardContent className="p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-orange-500" />
                              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                                Stress Level
                              </span>
                            </div>
                            <Badge 
                              className={
                                msg.metadata.analysis.stress.level >= 7
                                  ? 'bg-red-500'
                                  : msg.metadata.analysis.stress.level >= 4
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                              }
                            >
                              {msg.metadata.analysis.stress.level}/10
                            </Badge>
                          </div>
                          {msg.metadata.analysis.stress.stressors && 
                           msg.metadata.analysis.stress.stressors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {msg.metadata.analysis.stress.stressors.slice(0, 3).map((stressor, idx) => (
                                <Badge key={idx} variant="outline" className="text-xs">
                                  {stressor}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* NEW: Display Wellness Suggestions */}
                  {msg.role === 'assistant' && msg.metadata?.analysis?.suggestions?.items && 
                   msg.metadata.analysis.suggestions.items.length > 0 && (
                    <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-900/10 mt-3">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-500" />
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            Wellness Suggestions
                          </span>
                          <Badge 
                            className={
                              msg.metadata.analysis.suggestions.urgency === 'high'
                                ? 'bg-red-500'
                                : 'bg-yellow-500'
                            }
                          >
                            {msg.metadata.analysis.suggestions.urgency}
                          </Badge>
                        </div>
                        {msg.metadata.analysis.suggestions.reasoning && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                            {msg.metadata.analysis.suggestions.reasoning}
                          </p>
                        )}
                        <ul className="space-y-2">
                          {msg.metadata.analysis.suggestions.items.map((suggestion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <TrendingUp className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
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
