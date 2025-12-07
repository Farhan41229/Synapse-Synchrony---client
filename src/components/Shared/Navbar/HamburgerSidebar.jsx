import { useNavigate } from 'react-router';
import HabitudeLogo from './HabitudeLogo';
import NavButton from './NavButton';

const HamburgerSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const user = undefined;

  // Wrapper to close sidebar on click
  const handleNavClick = (path) => {
    if (closeSidebar) closeSidebar();
    // Navigate handled by NavButton's NavLink, this just closes menu
  };

  return (
    <div
      className="flex flex-col items-start pl-6 pt-8 h-screen w-full shadow-2xl
      bg-white text-gray-900 border-r border-gray-200
      dark:bg-[#111827] dark:text-white dark:border-gray-800 transition-colors"
    >
      {/* 1. Logo Section */}
      <div className="mb-6">
        <HabitudeLogo />
      </div>

      <hr className="w-5/6 mb-6 border-gray-200 dark:border-gray-700" />

      {/* 2. Links Section */}
      <div className="flex flex-col gap-4 w-full pr-6">
        <div onClick={closeSidebar}>
          <NavButton label="Home" address="/" />
        </div>
        <div onClick={closeSidebar}>
          <NavButton label="About Us" address="/about" />
        </div>
        <div onClick={closeSidebar}>
          <NavButton label="Contact Us" address="/contact" />
        </div>
        <div onClick={closeSidebar}>
          <NavButton label="All Habits" address="/browse-habits" />
        </div>

        {user && (
          <>
            <div onClick={closeSidebar}>
              <NavButton label="My Habits" address="/dashboard/my-habits" />
            </div>
            <div onClick={closeSidebar}>
              <NavButton label="Add Habit" address="/dashboard/add-habit" />
            </div>
          </>
        )}

        <div className="mt-4">
          {user ? (
            <button
              className="btn w-full bg-gray-900 text-white dark:bg-white dark:text-black"
              onClick={() => {
                closeSidebar();
              }}
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/auth');
                closeSidebar();
              }}
              className="btn w-full bg-[#EF4444] text-white hover:bg-[#dc2626] border-none"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default HamburgerSidebar;
