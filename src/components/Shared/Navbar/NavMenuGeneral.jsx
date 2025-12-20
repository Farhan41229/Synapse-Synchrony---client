import { ModeToggle } from '../../mode-toggle';
import NavButton from './NavButton';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

const NavMenuGeneral = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/'); // or '/auth/login' if you prefer
    } catch (error) {
      console.error(error);
      toast.error('Error logging out. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <NavButton label="Home" address="/" />
      <NavButton label="About Us" address="/about" />
      <NavButton label="Contact Us" address="/contact" />

      <ModeToggle />

      {isAuthenticated && user && (
        <>
          <NavButton label="My Habits" address="/dashboard/my-habits" />
          <NavButton label="Add Habit" address="/dashboard/add-habit" />
        </>
      )}

      {isAuthenticated ? (
        <button
          className="btn bg-[#097133] text-white hover:bg-[#04642a] border-none ml-2 px-6 disabled:opacity-60"
          onClick={handleLogout}
          disabled={isLoading}
          type="button"
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>
      ) : (
        <button
          onClick={() => navigate('/auth/login')}
          className="btn bg-[#097133] text-white hover:bg-[#04642a] border-none ml-2 px-6"
          type="button"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default NavMenuGeneral;
