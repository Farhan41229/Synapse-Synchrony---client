import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../Loaders/Loader';
import * as chatService from '../../services/chatService';
import * as messageService from '../../services/messageService';

/**
 * ChatContainer Component
 * 2-column layout with real API integration
 */
const ChatContainer = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({});
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setIsLoadingConversations(true);
      const data = await chatService.getConversations();
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
      console.error('Error loading conversations:', error);
    } finally {
      setIsLoadingConversations(false);
    }
  };

// Fetch messages for a conversation
const fetchMessages = async (conversationId) => {
  try {
    setIsLoadingMessages(true);
    const data = await messageService.getMessages(conversationId);
    
    setMessages((prev) => ({
      ...prev,
      [conversationId]: data.messages, // Get messages from transformed data
    }));

    // Mark messages as read
    await messageService.markMessagesAsRead(conversationId);
  } catch (error) {
    toast.error('Failed to load messages');
    console.error('Error loading messages:', error);
  } finally {
    setIsLoadingMessages(false);
  }
};


  // Handle conversation selection
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    
    // Load messages if not already loaded
    if (!messages[conversation.id]) {
      await fetchMessages(conversation.id);
    }
  };

  // Handle sending a message
  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      setIsSendingMessage(true);
      
      // Send message to backend
      const newMessage = await messageService.sendMessage(
        selectedConversation.id,
        content
      );

      // Add message to local state
      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [
          ...(prev[selectedConversation.id] || []),
          newMessage,
        ],
      }));

      // Update conversation's last message
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? {
                ...conv,
                lastMessage: {
                  content: newMessage.content,
                  senderId: newMessage.senderId,
                  timestamp: newMessage.createdAt,
                },
                updatedAt: newMessage.createdAt,
              }
            : conv
        )
      );

      toast.success('Message sent!');
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Show loader while loading conversations
  if (isLoadingConversations) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversation?.id}
        onSelectConversation={handleSelectConversation}
      />

      {/* Chat Area */}
      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <ChatHeader conversation={selectedConversation} />

            {/* Messages List */}
            {isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <MessageList
                messages={messages[selectedConversation.id] || []}
              />
            )}

            {/* Message Input */}
            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isSendingMessage}
            />
          </>
        ) : (
          // No conversation selected
          <div className="flex-1 flex items-center justify-center bg-secondary/20">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-12 h-12 text-primary"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Welcome to Chat</h3>
              <p className="text-muted-foreground">
                {conversations.length === 0
                  ? 'No conversations yet. Start chatting!'
                  : 'Select a conversation to start messaging'}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatContainer;
