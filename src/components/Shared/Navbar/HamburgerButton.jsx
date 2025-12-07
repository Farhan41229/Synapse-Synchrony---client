import { useState } from 'react';
import { Menu, UserRound, X } from 'lucide-react';
import HamburgerSidebar from './HamburgerSidebar';

const HamburgerButton = () => {
  const user = undefined; // Placeholder
  const [isSideBar, setIsSideBar] = useState(false);

  const toggleSidebar = () => {
    setIsSideBar((prev) => !prev);
  };

  return (
    <>
      <div
        className="flex items-center justify-center w-12 h-12 
        border border-gray-300 text-gray-700 hover:bg-gray-100
        dark:border-gray-600 dark:text-white dark:hover:bg-white/10 
        rounded-full cursor-pointer transition-colors md:hidden z-50 relative"
        onClick={toggleSidebar}
      >
        {isSideBar ? <X size={24} /> : <Menu size={24} />}

        {/* Optional: Show mini avatar inside button if you want, usually hidden in hamburger icon though */}
        {/* {user?.photoURL && ... } */}
      </div>

      {/* Overlay Backdrop */}
      {isSideBar && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 z-50 transform transition-transform duration-300 ease-in-out ${
          isSideBar ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <HamburgerSidebar closeSidebar={() => setIsSideBar(false)} />
      </div>
    </>
  );
};

export default HamburgerButton;
