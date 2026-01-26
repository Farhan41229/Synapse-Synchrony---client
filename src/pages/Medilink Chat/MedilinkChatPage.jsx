import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Bot, Loader2 } from 'lucide-react';
import { medilinkService } from '@/services/medilinkService';
import SessionSidebar from '@/components/Medilink/SessionSidebar';
import WelcomeScreen from '@/components/Medilink/WelcomeScreen';
import ChatMessages from '@/components/Medilink/ChatMessages';
import ChatInput from '@/components/Medilink/ChatInput';

export default function MedilinkChatPage() {
  const { sessionId: urlSessionId } = useParams();
  const navigate = useNavigate();

  const [sessionId, setSessionId] = useState(urlSessionId);
  const [sessions, setSessions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize: Create or load session
  useEffect(() => {
    const initChat = async () => {
      try {
        setIsLoading(true);
        if (!sessionId || sessionId === 'new') {
          const response = await medilinkService.createSession();
          const newSessionId = response.sessionId;
          setSessionId(newSessionId);
          navigate(`/medilink/chat/${newSessionId}`, { replace: true });
        } else {
          const historyResponse = await medilinkService.getSessionHistory(sessionId);
          if (historyResponse.success && Array.isArray(historyResponse.data)) {
            // Filter out system messages for display
            const userMessages = historyResponse.data.filter(
              (msg) => msg.role !== 'system'
            );
            setMessages(userMessages);
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        setMessages([
          {
            role: 'assistant',
            content:
              "I apologize, but I'm having trouble loading the chat session. Please try refreshing the page.",
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    initChat();
  }, [sessionId, navigate]);

  // Load all sessions
  useEffect(() => {
    const loadSessions = async () => {
      try {
        const response = await medilinkService.getAllSessions();
        if (response.success && Array.isArray(response.data)) {
          setSessions(response.data);
        }
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    };

    loadSessions();
  }, [messages]); // Reload when messages change

  const handleNewSession = async () => {
    try {
      setIsLoading(true);
      const response = await medilinkService.createSession();
      const newSessionId = response.sessionId;

      // Update state
      setSessionId(newSessionId);
      setMessages([]);
      navigate(`/medilink/chat/${newSessionId}`);

      // Refresh sessions list
      const sessionsResponse = await medilinkService.getAllSessions();
      if (sessionsResponse.success) {
        setSessions(sessionsResponse.data);
      }
    } catch (error) {
      console.error('Failed to create new session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSessionSelect = async (selectedSessionId) => {
    if (selectedSessionId === sessionId) return;

    try {
      setIsLoading(true);
      const response = await medilinkService.getSessionHistory(selectedSessionId);
      if (response.success && Array.isArray(response.data)) {
        const userMessages = response.data.filter((msg) => msg.role !== 'system');
        setMessages(userMessages);
        setSessionId(selectedSessionId);
        navigate(`/medilink/chat/${selectedSessionId}`);
      }
    } catch (error) {
      console.error('Failed to load session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const currentMessage = inputMessage.trim();

    if (!currentMessage || isTyping || !sessionId) return;

    setInputMessage('');
    setIsTyping(true);

    // Add user message immediately (optimistic UI)
    const userMessage = {
      role: 'user',
      content: currentMessage,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await medilinkService.sendMessage(sessionId, currentMessage);

      if (response.success) {
        // Add AI response
        const assistantMessage = {
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
          metadata: {
            analysis: response.data.analysis,
          },
        };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (text) => {
    setInputMessage(text);
    setTimeout(() => {
      const event = new Event('submit');
      handleSendMessage(event);
    }, 0);
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#04642a]" />
      </div>
    );
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4">
      <div className="flex h-[calc(100vh-4rem)] mt-20 gap-6">
        {/* Session Sidebar */}
        <SessionSidebar
          sessions={sessions}
          currentSessionId={sessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
          isLoading={isLoading}
        />

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#04642a]/10 text-[#04642a] flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-semibold text-gray-900 dark:text-white">
                  Medilink AI
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {messages.length} messages
                </p>
              </div>
            </div>
          </div>

          {/* Messages or Welcome Screen */}
          {messages.length === 0 ? (
            <WelcomeScreen onQuestionClick={handleSuggestedQuestion} />
          ) : (
            <ChatMessages messages={messages} isTyping={isTyping} />
          )}

          {/* Input */}
          <ChatInput
            message={inputMessage}
            setMessage={setInputMessage}
            onSubmit={handleSendMessage}
            isTyping={isTyping}
            disabled={!sessionId}
          />
        </div>
      </div>
    </div>
  );
}
