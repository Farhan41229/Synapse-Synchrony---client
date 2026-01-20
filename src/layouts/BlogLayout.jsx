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
        <Footer />
      </div>
    </>
  );
};

export default BlogLayout;
