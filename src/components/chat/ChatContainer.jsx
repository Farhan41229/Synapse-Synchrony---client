// /Synapse-Synchrony---client/src/components/chat/ChatContainer.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../Loaders/Loader';
import * as messageService from '../../services/messageService';
import useChat from '../../hooks/useChat';

const ChatContainer = () => {
  const {
    conversations,
    selectedConversation,
    selectedConversationId,
    isLoadingConversations,
    refreshConversations,
    selectConversation,
  } = useChat({ autoSelectFirst: true });

  const [messages, setMessages] = useState({});
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchMessages = async (conversationId) => {
    try {
      setIsLoadingMessages(true);

      const data = await messageService.getMessages(conversationId);

      setMessages((prev) => ({
        ...prev,
        [conversationId]: data.messages,
      }));

      await messageService.markMessagesAsRead(conversationId);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error loading messages:', error);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  // Load messages when selected conversation changes (only once per conversation)
  useEffect(() => {
    if (!selectedConversationId) return;
    if (messages[selectedConversationId]) return;
    fetchMessages(selectedConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  const handleSelectConversation = async (conversation) => {
    selectConversation(conversation);
    if (conversation?.id && !messages[conversation.id]) {
      await fetchMessages(conversation.id);
    }
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      setIsSendingMessage(true);

      const newMessage = await messageService.sendMessage(
        selectedConversation.id,
        content
      );

      setMessages((prev) => ({
        ...prev,
        [selectedConversation.id]: [
          ...(prev[selectedConversation.id] || []),
          newMessage,
        ],
      }));
    } catch (error) {
      toast.error('Failed to send message');
      console.error('Error sending message:', error);
    } finally {
      setIsSendingMessage(false);
    }
  };

  if (isLoadingConversations) return <Loader />;

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        conversations={conversations}
        selectedConversationId={selectedConversationId}
        onSelectConversation={handleSelectConversation}
        onConversationCreated={async () => {
          await refreshConversations();
        }}
      />

      <main className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <ChatHeader conversation={selectedConversation} />

            {isLoadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <MessageList messages={messages[selectedConversation.id] || []} />
            )}

            <MessageInput onSendMessage={handleSendMessage} disabled={isSendingMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-secondary/20">
            <div className="text-center">
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
