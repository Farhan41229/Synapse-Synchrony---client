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
import BookmarkedBlogs from '@/pages/Dashboard/BookmarkedBlogs';
import LikedBlogs from '@/pages/Dashboard/LikedBlogs';
import MyEvents from '@/components/DashboardComponents/Shared/Events/MyEvents';
import AddEvent from '@/pages/Create Event Page/AddEvent';
import MedilinkLayout from '@/layouts/MedilinkLayout';
import Medilink from '@/pages/Medilink Home Page/Medilink';
import MedilinkChatPage from '@/pages/Medilink Chat/MedilinkChatPage';
import SessionSelectPage from '@/pages/Medilink Chat/SessionSelectPage';
import WellnessDashboard from '@/pages/Wellness Dashboard/WellnessDashboard';
import MoodHistoryPage from '@/pages/Wellness Dashboard/MoodHistoryPage';
import StressHistoryPage from '@/pages/Wellness Dashboard/StressHistoryPage';
import SuggestionsPage from '@/pages/Wellness Dashboard/SuggestionsPage';
import ProfilePage from '@/pages/Profile Page/ProfilePage';
import EditBlog from '@/pages/Edit Blog Page/EditBlog';
import EditEvent from '@/pages/Edit Event Page/EditEvent';
import DiagnosisSessionsPage from '@/pages/Diagnosis/DiagnosisSessionsPage';
import DiagnosisChatPage from '@/pages/Diagnosis/DiagnosisChatPage';

import MyNotes from '@/pages/Dashboard/MyNotes';
import CreateNote from '@/pages/Dashboard/CreateNote';
import EditNote from '@/pages/Dashboard/EditNote';
import NoteDetail from '@/pages/Dashboard/NoteDetail';
import ImageToText from '@/pages/Dashboard/ImageToText';
import MySchedule from '@/pages/Dashboard/MySchedule';
import UploadSchedule from '@/pages/Dashboard/UploadSchedule';
import EditSchedule from '@/pages/Dashboard/EditSchedule';
import Dashboard from '@/pages/Dashboard/Dashboard';
import NotFound from '@/pages/NotFound';

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
      { path: 'diagnosis', Component: DiagnosisSessionsPage },
      { path: 'diagnosis/session/:sessionId', Component: DiagnosisChatPage },
      { path: 'diagnosis/new', Component: DiagnosisChatPage },
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
      { index: true, Component: Dashboard },
      { path: 'chat', Component: ChatLayout },
      {
        path: 'chat/:id',
        Component: SingleChat,
      },
      // Profile
      { path: 'profile', Component: ProfilePage },
      // Blog Management
      { path: 'my-blogs', Component: MyBlogs },
      { path: 'bookmarked-blogs', Component: BookmarkedBlogs },
      { path: 'liked-blogs', Component: LikedBlogs },
      { path: 'edit-blog/:id', Component: EditBlog },
      // Notes
      { path: 'notes', Component: MyNotes },
      { path: 'notes/create', Component: CreateNote },
      { path: 'notes/image-to-text', Component: ImageToText },
      { path: 'notes/:id/edit', Component: EditNote },
      { path: 'notes/:id', Component: NoteDetail },
      // Schedule
      { path: 'schedule', Component: MySchedule },
      { path: 'schedule/upload', Component: UploadSchedule },
      { path: 'schedule/:id/edit', Component: EditSchedule },
      // Event Management
      { path: 'my-events', Component: MyEvents },
      { path: 'create-event', Component: AddEvent },
      { path: 'edit-event/:id', Component: EditEvent },
      // Wellness/Medilink routes
      { path: 'wellness', Component: WellnessDashboard },
      { path: 'wellness/mood-history', Component: MoodHistoryPage },
      { path: 'wellness/stress-history', Component: StressHistoryPage },
      { path: 'wellness/suggestions', Component: SuggestionsPage },
      // Medical Diagnosis (medications page removed in diagnosis overhaul)
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
  {
    path: '*',
    Component: NotFound,
  },
]);

export default router;
