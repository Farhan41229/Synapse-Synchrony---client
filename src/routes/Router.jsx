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

import MedilinkLayout from '@/layouts/MedilinkLayout';
import Medilink from '@/pages/Medilink Home Page/Medilink';
import MedilinkChatPage from '@/pages/Medilink Chat/MedilinkChatPage';
import SessionSelectPage from '@/pages/Medilink Chat/SessionSelectPage';
import WellnessDashboard from '@/pages/Wellness Dashboard/WellnessDashboard';
import MoodHistoryPage from '@/pages/Wellness Dashboard/MoodHistoryPage';
import StressHistoryPage from '@/pages/Wellness Dashboard/StressHistoryPage';
import SuggestionsPage from '@/pages/Wellness Dashboard/SuggestionsPage';
import ProfilePage from '@/pages/Profile Page/ProfilePage';
import DiagnosisSessionsPage from '@/pages/Diagnosis/DiagnosisSessionsPage';
import DiagnosisChatPage from '@/pages/Diagnosis/DiagnosisChatPage';

import MyReports from '@/pages/Dashboard/MyReports';
import ExtractReport from '@/pages/Dashboard/ExtractReport';
import ReportDetail from '@/pages/Dashboard/ReportDetail';
import MyMedicineSchedules from '@/pages/Dashboard/MyMedicineSchedules';
import ExtractMedicineSchedule from '@/pages/Dashboard/ExtractMedicineSchedule';
import MedicineScheduleDetail from '@/pages/Dashboard/MedicineScheduleDetail';
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
      // Reports
      { path: 'reports', Component: MyReports },
      { path: 'reports/extract', Component: ExtractReport },
      { path: 'reports/:id', Component: ReportDetail },
      // Medicine Schedule
      { path: 'medicine', Component: MyMedicineSchedules },
      { path: 'medicine/extract', Component: ExtractMedicineSchedule },
      { path: 'medicine/:id', Component: MedicineScheduleDetail },
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
