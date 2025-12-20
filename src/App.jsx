import { RouterProvider } from 'react-router-dom';
import router from './routes/Router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import Loader from './components/Loaders/Loader';
import SocketProvider  from './contexts/SocketProvider';


function App() {
  const { isCheckingAuth, checkAuth, isLoading } =
    useAuthStore();

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ✅ run once on initial load

  if (isCheckingAuth || isLoading) {
    return <Loader />;
  }

  // console.log('Is Authenticated: ', isAuthenticated);
  // console.log('User: ', user);

  return (
    <SocketProvider>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
    </SocketProvider>
  );
}

export default App;
