import { useState } from 'react';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

// MOCK CONVERSATIONS
const mockConversations = [
  {
    id: '1',
    name: 'John Doe',
    avatar: null,
    type: 'direct',
    lastMessage: {
      content: 'Hey! How are you doing?',
      senderId: '2',
    },
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    unreadCount: 2,
  },
  {
    id: '2',
    name: 'Jane Smith',
    avatar: null,
    type: 'direct',
    lastMessage: {
      content: 'See you tomorrow!',
      senderId: '1',
    },
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
  },
  {
    id: '3',
    name: 'Project Team',
    avatar: null,
    type: 'group',
    lastMessage: {
      content: 'Meeting at 3 PM',
      senderId: '3',
    },
    updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unreadCount: 5,
  },
];

// MOCK MESSAGES
const mockMessages = {
  '1': [
    {
      id: 'm1',
      conversationId: '1',
      senderId: '2',
      senderName: 'John Doe',
      content: 'Hey! How are you doing?',
      createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    },
    {
      id: 'm2',
      conversationId: '1',
      senderId: '1',
      content: "I'm good! Thanks for asking. How about you?",
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    },
    {
      id: 'm3',
      conversationId: '1',
      senderId: '2',
      senderName: 'John Doe',
      content: 'Doing great! Working on the new project.',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    },
  ],
  '2': [
    {
      id: 'm4',
      conversationId: '2',
      senderId: '1',
      content: 'Hey Jane! Are we still on for tomorrow?',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm5',
      conversationId: '2',
      senderId: '2',
      senderName: 'Jane Smith',
      content: 'Yes! See you tomorrow at 10 AM.',
      createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  ],
  '3': [
    {
      id: 'm6',
      conversationId: '3',
      senderId: '3',
      senderName: 'Mike Johnson',
      content: 'Team meeting at 3 PM today.',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'm7',
      conversationId: '3',
      senderId: '4',
      senderName: 'Sarah Lee',
      content: "Got it! I'll be there.",
      createdAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    },
  ],
};

/**
 * ChatContainer Component
 * 2-column layout: Sidebar (conversations) + Chat Area (messages)
 */
const ChatContainer = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState({});

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    
    // Load messages for this conversation (mock data)
    if (!messages[conversation.id]) {
      setMessages((prev) => ({
        ...prev,
        [conversation.id]: mockMessages[conversation.id] || [],
      }));
    }
  };

  const handleSendMessage = (content) => {
    if (!selectedConversation) return;

    const newMessage = {
      id: `m${Date.now()}`,
      conversationId: selectedConversation.id,
      senderId: '1', // Current user ID (mock)
      content,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedConversation.id]: [
        ...(prev[selectedConversation.id] || []),
        newMessage,
      ],
    }));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        conversations={mockConversations}
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
            <MessageList
              messages={messages[selectedConversation.id] || []}
            />

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
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
                Select a conversation to start messaging
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ChatContainer;
