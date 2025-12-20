import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Loader from './Loaders/Loader';

/**
 * Protected Route Component
 * Redirects to login if user is not authenticated
 * Shows loader while checking auth status
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();

  // Show loader while checking authentication
  if (isCheckingAuth) {
    return <Loader />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
