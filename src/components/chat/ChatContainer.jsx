import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

import Sidebar from './Sidebar';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Loader from '../Loaders/Loader';

import * as messageService from '../../services/messageService';
import useChat from '../../hooks/useChat';
import useMessages from '../../hooks/useMessages';
import useSocket from '../../hooks/useSocket';

import { SOCKET_EVENTS } from '../../constants/socketEvents';

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
    updateMessage,
    markMessageDeleted,
  } = useMessages(selectedConversationId, { limit: 50 });

  const { socket, isConnected } = useSocket();

  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const handleSelectConversation = (conversation) => {
    selectConversation(conversation);
  };

  // Join / leave room when conversation changes
  useEffect(() => {
    if (!socket || !isConnected || !selectedConversationId) return;

    socket.emit(
      SOCKET_EVENTS.CONVERSATION_JOIN,
      { conversationId: selectedConversationId },
      (ack) => {
        // optional debug ack
        if (ack?.success === false) console.error('Join failed:', ack);
      }
    );

    return () => {
      socket.emit(SOCKET_EVENTS.CONVERSATION_LEAVE, { conversationId: selectedConversationId });
    };
  }, [socket, isConnected, selectedConversationId]);

  // Realtime listeners: new/edited/deleted
  useEffect(() => {
    if (!socket) return;

    function onMessageNew(payload) {
      // backend: { success: true, message: {...} }
      if (!payload?.success) return;
      const msg = payload.message;
      if (!msg) return;

      if (msg.conversationId && selectedConversationId && msg.conversationId !== selectedConversationId) return;

      appendMessage({
        ...msg,
        id: msg._id,
        senderId: msg.senderId?._id || msg.senderId, // backend sends senderId object
        sender: msg.senderId,
        attachments: msg.attachments || [],
      });
    }

    function onMessageEdited(payload) {
      // backend: { success: true, message: { _id, conversationId, content, isEdited, updatedAt } }
      if (!payload?.success) return;
      const msg = payload.message;
      if (!msg?._id) return;

      if (msg.conversationId && selectedConversationId && msg.conversationId !== selectedConversationId) return;

      updateMessage({
        id: msg._id,
        content: msg.content,
        isEdited: msg.isEdited,
        updatedAt: msg.updatedAt,
      });
    }

    function onMessageDeleted(payload) {
      // backend: { success: true, messageId, conversationId, deletedAt }
      if (!payload?.success) return;

      const { messageId, conversationId } = payload;
      if (conversationId && selectedConversationId && conversationId !== selectedConversationId) return;
      if (!messageId) return;

      markMessageDeleted(messageId);
    }

    socket.on(SOCKET_EVENTS.MESSAGE_NEW, onMessageNew);
    socket.on(SOCKET_EVENTS.MESSAGE_EDITED, onMessageEdited);
    socket.on(SOCKET_EVENTS.MESSAGE_DELETED, onMessageDeleted);

    return () => {
      socket.off(SOCKET_EVENTS.MESSAGE_NEW, onMessageNew);
      socket.off(SOCKET_EVENTS.MESSAGE_EDITED, onMessageEdited);
      socket.off(SOCKET_EVENTS.MESSAGE_DELETED, onMessageDeleted);
    };
  }, [socket, selectedConversationId, appendMessage, updateMessage, markMessageDeleted]);

  const handleSendMessage = async (content) => {
    if (!selectedConversation || !content.trim()) return;

    try {
      setIsSendingMessage(true);

      // REST send
      const newMessage = await messageService.sendMessage(selectedConversation.id, content);

      // Optimistic append; dedupe prevents double when socket echoes it back
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
