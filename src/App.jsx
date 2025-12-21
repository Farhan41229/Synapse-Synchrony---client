import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Loader from './components/Loaders/Loader';

function App() {
  const { isCheckingAuth, isAuthenticated, user, checkAuth, isLoading } =
    useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth || isLoading) {
    return <Loader />;
  }
  // console.log('Is Authenticated: ', isAuthenticated);
  // console.log('User: ', user);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
