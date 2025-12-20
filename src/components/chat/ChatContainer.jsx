import { useState } from 'react';
import { toast } from 'react-hot-toast';
import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../Loaders/Loader';
import * as messageService from '../../services/messageService';
import useChat from '../../hooks/useChat';
import useMessages from '../../hooks/useMessages';

const ChatContainer = () => {
  const {
    conversations,
    selectedConversation,
    selectedConversationId,
    isLoadingConversations,
    refreshConversations,
    selectConversation,
  } = useChat({ autoSelectFirst: true });

  const {
    messages,
    hasMore,
    isLoadingInitial,
    isLoadingOlder,
    loadOlder,
    appendMessage,
  } = useMessages(selectedConversationId, { limit: 50 });

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation);
  };

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      setIsSendingMessage(true);
      const newMessage = await messageService.sendMessage(
        selectedConversation.id,
        content
      );
      appendMessage(newMessage);
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

            {isLoadingInitial ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader />
              </div>
            ) : (
              <MessageList
                messages={messages}
                hasMore={hasMore}
                isLoadingOlder={isLoadingOlder}
                onLoadOlder={loadOlder}
              />
            )}

            <MessageInput
              onSendMessage={handleSendMessage}
              disabled={isSendingMessage}
            />
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
