import React, { useEffect, useRef } from 'react';
import { useChat } from '@/hooks/use-chat';
import { useSocket } from '@/hooks/use-socket';
import ChatBodyMessage from './ChatBodyMessage';

const ChatBody = ({ chatId, messages, onReply }) => {
  const { socket } = useSocket();
  const { addNewMessage } = useChat();
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    if (!socket) return;

    const handleNewMessage = (msg) => addNewMessage(chatId, msg);

    socket.on('message:new', handleNewMessage);
    return () => {
      socket.off('message:new', handleNewMessage);
    };
  }, [socket, chatId, addNewMessage]);

  useEffect(() => {
    if (!messages.length) return;
    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    });
  }, [messages]);

  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col px-3 py-2">
      {messages.map((message) => (
        <ChatBodyMessage
          key={message?._id}
          message={message}
          onReply={onReply}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatBody;
