import React from 'react';
import { Outlet } from 'react-router';
import ChatList from './ChatList';

const ChatLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Chat List Sidebar */}
      <ChatList />

      {/* Chat Content Area - SingleChat will render here */}
      <div className="flex-1 flex items-center justify-center bg-background">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;
