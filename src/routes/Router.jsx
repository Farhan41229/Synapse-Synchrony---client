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

import ChatLayout from '@/components/DashboardComponents/Shared/Chat/ChatLayout';
import SingleChat from '@/components/DashboardComponents/Shared/Chat/SingleChat';
import VideoCallPage from '@/components/DashboardComponents/Shared/Chat/VideoCallPage';
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
    children: [
      { path: 'chat', Component: ChatLayout },
      {
        path: 'chat/:id',
        Component: SingleChat,
      },
    ],
  },
  {
    path: '/call/:callId',
    element: <VideoCallPage />,
  },
]);

export default router;
