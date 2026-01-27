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
import AudioCallPage from '@/components/DashboardComponents/Shared/Chat/AudioCallPage';
import About from '@/pages/About Page/About';
import Contact from '@/pages/Contact Page/Contact';

import BlogLayout from '@/layouts/BlogLayout';
import Blog from '@/pages/Blog Page/Blog';
import BlogDetail from '@/pages/Blog Details Page/BlogDetail';
import EventDetail from '@/pages/Event Details Page/EventDetail';
import AllBlogs from '@/pages/All Blogs Page/AllBlogs';
import AllEvents from '@/pages/All Events Page/AllEvents';
import AddBlog from '@/pages/Create Blog Page/AddBlog';
import MyBlogs from '@/components/DashboardComponents/Shared/Blogs/My Blogs/MyBlogs';
import MedilinkLayout from '@/layouts/MedilinkLayout';
import Medilink from '@/pages/Medilink Home Page/Medilink';
import MedilinkChatPage from '@/pages/Medilink Chat/MedilinkChatPage';
import SessionSelectPage from '@/pages/Medilink Chat/SessionSelectPage';
import WellnessDashboard from '@/pages/Wellness Dashboard/WellnessDashboard';
import MoodHistoryPage from '@/pages/Wellness Dashboard/MoodHistoryPage';
import StressHistoryPage from '@/pages/Wellness Dashboard/StressHistoryPage';
import SuggestionsPage from '@/pages/Wellness Dashboard/SuggestionsPage';

const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About },
      { path: 'contact', Component: Contact },
    ],
  },
  {
    path: '/medilink',
    Component: MedilinkLayout,
    children: [
      { index: true, Component: Medilink },
      { path: 'sessions', Component: SessionSelectPage },
      { path: 'chat/:sessionId', Component: MedilinkChatPage },
    ],
  },
  {
    path: '/blog',
    Component: BlogLayout,
    children: [
      { index: true, Component: Blog },
      { path: 'BlogDetail/:id', Component: BlogDetail },
      { path: 'EventDetail/:id', Component: EventDetail },
      { path: 'all', Component: AllBlogs },
      { path: 'events/all', Component: AllEvents },
      { path: 'blogs/create', Component: AddBlog },
    ],
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
      { path: 'my-blogs', Component: MyBlogs },
      // Wellness/Medilink routes
      { path: 'wellness', Component: WellnessDashboard },
      { path: 'wellness/mood-history', Component: MoodHistoryPage },
      { path: 'wellness/stress-history', Component: StressHistoryPage },
      { path: 'wellness/suggestions', Component: SuggestionsPage },
    ],
  },
  {
    path: '/call/:callId',
    element: <VideoCallPage />,
  },
  {
    path: '/audio-call/:callId',
    element: <AudioCallPage />,
  },
]);

export default router;
