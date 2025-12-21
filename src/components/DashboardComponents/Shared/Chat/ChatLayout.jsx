import React from 'react';
import ChatList from './ChatList';

const ChatLayout = () => {
  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Chat List Sidebar */}
      <ChatList />
      
      {/* Empty state for when no chat is selected */}
      <div className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <p className="text-lg">Select a chat to start messaging</p>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
