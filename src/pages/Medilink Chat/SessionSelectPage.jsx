import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MessageSquare, PlusCircle, Loader2, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { medilinkService } from '@/services/medilinkService';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SessionSelectPage() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await medilinkService.getAllSessions();
        if (response.success && Array.isArray(response.data)) {
          setSessions(response.data);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const handleNewSession = async () => {
    try {
      setIsCreating(true);
      const response = await medilinkService.createSession();
      if (response.success) {
        navigate(`/medilink/chat/${response.sessionId}`);
      }
    } catch (error) {
      console.error('Failed to create session:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleSessionSelect = (sessionId) => {
    navigate(`/medilink/chat/${sessionId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#04642a]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Medilink AI
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Continue a previous conversation or start a new therapy session
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* New Session Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-dashed border-[#04642a]/30 hover:border-[#04642a] transition-all cursor-pointer group">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#04642a]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <PlusCircle className="w-8 h-8 text-[#04642a]" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Start New Session
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Begin a fresh conversation with Medilink AI
              </p>
              <Button
                onClick={handleNewSession}
                disabled={isCreating}
                className="w-full bg-[#04642a] hover:bg-[#034d20] text-white"
              >
                {isCreating ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <PlusCircle className="w-4 h-4 mr-2" />
                )}
                Create New Session
              </Button>
            </div>
          </div>

          {/* Previous Sessions Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Previous Sessions
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {sessions.length} total
              </span>
            </div>

            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No previous sessions yet
                </p>
              </div>
            ) : (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {sessions.slice(0, 10).map((session) => (
                    <div
                      key={session.sessionId}
                      onClick={() => handleSessionSelect(session.sessionId)}
                      className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-[#04642a] hover:bg-[#04642a]/5 transition-all cursor-pointer group"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-[#04642a]" />
                          <span className="font-medium text-sm text-gray-900 dark:text-white truncate">
                            {(() => {
                              const firstUserMsg = session.messages.find(
                                (m) => m.role === 'user'
                              );
                              return (
                                firstUserMsg?.content?.slice(0, 40) || 'New Chat'
                              );
                            })()}
                          </span>
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#04642a] transition-colors" />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {(() => {
                          const lastNonSystemMsg = [...session.messages]
                            .reverse()
                            .find((m) => m.role !== 'system');
                          return lastNonSystemMsg?.content || 'No messages yet';
                        })()}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{session.messages.length} messages</span>
                        <span>
                          {(() => {
                            try {
                              const date = new Date(session.updatedAt);
                              if (isNaN(date.getTime())) return 'Just now';
                              return formatDistanceToNow(date, { addSuffix: true });
                            } catch {
                              return 'Just now';
                            }
                          })()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
