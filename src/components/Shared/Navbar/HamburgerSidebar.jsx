import { useNavigate } from 'react-router-dom';
import HabitudeLogo from './HabitudeLogo';
import NavButton from './NavButton';
import { useAuthStore } from '../../../store/authStore';

const HamburgerSidebar = ({ closeSidebar }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isLoading } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    closeSidebar?.();
    navigate('/auth/login');
  };

  return (
    <div
      className="flex flex-col items-start pl-6 pt-8 h-screen w-full shadow-2xl
      bg-white text-gray-900 border-r border-gray-200
      dark:bg-[#111827] dark:text-white dark:border-gray-800 transition-colors"
    >
      <div className="mb-6">
        <HabitudeLogo />
      </div>

      <hr className="w-5/6 mb-6 border-gray-200 dark:border-gray-700" />

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

        {isAuthenticated && user && (
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
          {isAuthenticated ? (
            <button
              className="btn w-full bg-gray-900 text-white dark:bg-white dark:text-black disabled:opacity-60"
              onClick={handleLogout}
              disabled={isLoading}
              type="button"
            >
              {isLoading ? 'Logging out...' : 'Logout'}
            </button>
          ) : (
            <button
              onClick={() => {
                navigate('/auth/login');
                closeSidebar?.();
              }}
              className="btn w-full bg-[#EF4444] text-white hover:bg-[#dc2626] border-none"
              type="button"
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
