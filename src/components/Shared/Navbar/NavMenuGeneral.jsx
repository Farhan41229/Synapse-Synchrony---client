import { ModeToggle } from '@/components/mode-toggle';
import NavButton from './NavButton';
import { useNavigate } from 'react-router';

const NavMenuGeneral = () => {
  const navigate = useNavigate();
  const user = undefined; // Placeholder for your auth logic

  return (
    <div className="flex justify-center items-center gap-2">
      <NavButton label="Home" address="/" />
      <NavButton label="About Us" address="/about" />
      <NavButton label="Contact Us" address="/contact" />

      <ModeToggle />

      {user && (
        <>
          <NavButton label="My Habits" address="/dashboard/my-habits" />
          <NavButton label="Add Habit" address="/dashboard/add-habit" />
        </>
      )}

      {user ? (
        <button
          className="btn bg-gray-900 text-white hover:bg-gray-700 dark:bg-white dark:text-black dark:hover:bg-gray-200 ml-2"
          onClick={() => {}}
        >
          Logout
        </button>
      ) : (
        <button
          onClick={() => navigate('/auth')}
          className="btn bg-[#097133] text-white hover:bg-[#04642a] border-none ml-2 px-6"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default NavMenuGeneral;
