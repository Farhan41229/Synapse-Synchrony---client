import { createBrowserRouter } from 'react-router';
import RootLayout from '../layouts/RootLayout';
import AuthLayout from '../layouts/AuthLayout';
import Home from '../pages/HomePage/Home';
import AuthHomePage from '../pages/AuthPage/AuthHomePage';
import SignUpPage from '../pages/AuthPage/SignUpPage';
import LoginPage from '../pages/AuthPage/LoginPage';
import VerifyEmailPage from '../pages/AuthPage/VerifyEmailPage';
import ProtectedRoute from '../components/ProtectedRoute';
import ChatPage from '../pages/ChatPage/ChatPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          {
            index: true,
            element: <AuthHomePage />,
          },
          {
            path: 'signup',
            element: <SignUpPage />,
          },
          {
            path: 'login',
            element: <LoginPage />,
          },
          {
            path: 'verify-email',
            element: <VerifyEmailPage />,
          },
        ],
      },
    ],
  },
  // ✅ Changed from '/chat' to '/inclusive-chat'
  {
    path: '/inclusive-chat',
    element: (
      <ProtectedRoute>
        <ChatPage />
      </ProtectedRoute>
    ),
  },
]);

export default router;
