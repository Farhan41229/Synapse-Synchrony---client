import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Loader from './components/Loaders/Loader';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function App() {
  const { isCheckingAuth, checkAuth, isLoading } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  if (isCheckingAuth || isLoading) {
    return <Loader />;
  }

  const queryclient = new QueryClient();
  // console.log('Is Authenticated: ', isAuthenticated);
  // console.log('User: ', user);

  return (
    <QueryClientProvider client={queryclient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <RouterProvider router={router} />
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
