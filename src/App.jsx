import { RouterProvider } from 'react-router';
import router from './routes/Router';
import { ThemeProvider } from './components/theme-provider';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
