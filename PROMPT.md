The UI is looking bad. Here are the codes to help you . 

## Router.jsx 


```jsx
import React from 'react';
import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import Home from '../pages/HomePage/Home';
import AuthLayout from '@/layouts/AuthLayout';
import AuthHomePage from '@/pages/AuthPage/AuthHomePage';
import SignUpPage from '@/pages/AuthPage/SignUpPage';
import LoginPage from '@/pages/AuthPage/LoginPage';
import VerifyEmailPage from '@/pages/AuthPage/VerifyEmailPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import Chat from '@/components/DashboardComponents/Shared/Chat';
import ChatList from '@/components/DashboardComponents/Shared/Chat/ChatList';

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [{ index: true, Component: Home }],
  },
  {
    path: '/auth',
    Component: AuthLayout,
    children: [
      { index: true, Component: AuthHomePage },
      {
        path: 'signup',
        Component: SignUpPage,
      },
      {
        path: 'login',
        Component: LoginPage,
      },
      {
        path: 'verify-email',
        Component: VerifyEmailPage,
      },
    ],
  },
  {
    path: '/dashboard',
    Component: DashboardLayout,
    children: [{ path: 'chat', Component: ChatList }],
  },
]);

export default router;

```

## DashboardLayout.jsx
```jsx
import DashboardNavbar from '@/components/DashboardComponents/Shared/DashboardNavbar';
import UserSidebar from '@/components/DashboardComponents/UserDashboard/UserSidebar';
import Navbar from '@/components/Shared/Navbar/Navbar';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <>
      <div className="flex">
        <SidebarProvider>
          <UserSidebar />
          <main className="w-full">
            <DashboardNavbar />
            <div className="px-4">
              {/* {children} */}
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;

```

### ChatList.jsx
```jsx
import { useChat } from '@/hooks/use-chat';
import { useAuthStore } from '@/store/authStore';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import ChatListItem from './ChatListItem';
import { useSocket } from '@/hooks/use-socket';
import ChatListHeader from './ChatListHeader';
import { Spinner } from '@/components/ui/spinner';

const ChatList = () => {
  const navigate = useNavigate();
  const { socket } = useSocket();
  const {
    fetchChats,
    chats,
    isChatsLoading,
    addNewChat,
    updateChatLastMessage,
  } = useChat();
  const { user } = useAuthStore();
  const currentUserId = user?._id || null;

  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats =
    chats?.filter(
      (chat) =>
        chat.groupName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        chat.participants?.some(
          (p) =>
            p._id !== currentUserId &&
            p.name?.toLowerCase().includes(searchQuery.toLowerCase())
        )
    ) || [];

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    if (!socket) return;

    const handleNewChat = (newChat) => {
      console.log('Received new chat', newChat);
      addNewChat(newChat);
    };

    socket.on('chat:new', handleNewChat);

    return () => {
      socket.off('chat:new', handleNewChat);
    };
  }, [addNewChat, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleChatUpdate = (data) => {
      console.log('Received update on chat', data.lastMessage);
      updateChatLastMessage(data.chatId, data.lastMessage);
    };

    socket.on('chat:update', handleChatUpdate);

    return () => {
      socket.off('chat:update', handleChatUpdate);
    };
  }, [socket, updateChatLastMessage]);

  const onRoute = (id) => {
    navigate(`/chat/${id}`);
  };

  return (
    <div
      className="fixed inset-y-0
      pb-20 lg:pb-0
      lg:max-w-[379px]
      lg:block
      border-r
      border-border
      bg-sidebar
      max-w-[calc(100%-40px)]
      w-full
      left-10
      z-[98]
    "
    >
      <div className="flex-col">
        <ChatListHeader onSearch={setSearchQuery} />

        <div
          className="
         flex-1 h-[calc(100vh-100px)]
         overflow-y-auto"
        >
          <div className="px-2 pb-10 pt-1 space-y-1">
            {isChatsLoading ? (
              <div className="flex items-center justify-center">
                <Spinner className="w-7 h-7" />
              </div>
            ) : filteredChats?.length === 0 ? (
              <div className="flex items-center justify-center text-muted-foreground">
                {searchQuery ? 'No chat found' : 'No chats created'}
              </div>
            ) : (
              filteredChats?.map((chat) => (
                <ChatListItem
                  key={chat._id}
                  chat={chat}
                  currentUserId={currentUserId}
                  onClick={() => onRoute(chat._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;

```