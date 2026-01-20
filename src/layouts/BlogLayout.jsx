import { Outlet } from 'react-router';
import Footer from '../components/Shared/Footer';
import Navbar from '../components/Shared/Navbar/Navbar';

const BlogLayout = () => {
  return (
    <>
      <div>
        <nav className="sticky top-0 z-100">
          <Navbar />
        </nav>
        <main className="min-h-[calc(100vh-40px)]">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default BlogLayout;
