import { ModeToggle } from '@/components/mode-toggle';
import NavButton from './NavButton';
import { useNavigate } from 'react-router';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChartBar, LogOut, MessageCircle, User } from 'lucide-react';

const NavMenuGeneral = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuthStore(); // Placeholder for your auth logic

  const HandleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      console.log(error);
      toast.error('Error logging out. Please try again.');
    }
  };

  return (
    <div className="flex justify-center items-center gap-2">
      <NavButton label="Home" address="/" />
      <NavButton label="About Us" address="/about" />
      <NavButton label="Contact Us" address="/contact" />

      <ModeToggle />

      {/* {user && (
        <>
          <NavButton label="My Habits" address="/dashboard/my-habits" />
          <NavButton label="Add Habit" address="/dashboard/add-habit" />
        </>
      )} */}

      {user ? (
        // <button
        //   className="btn bg-[#097133] text-white hover:bg-[#04642a] border-none ml-2 px-6"
        //   onClick={() => {
        //     HandleLogout();
        //   }}
        //   disabled={isLoading}
        // >
        //   {isLoading ? 'Logging out...' : 'Logout'}
        // </button>
        //
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className={'mx-2 hover:cursor-pointer outline-0'}>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={20}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              {' '}
              <User /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              {' '}
              <MessageCircle /> Chat
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive">
              {' '}
              <LogOut /> Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <button
          onClick={() => navigate('/auth/login')}
          className="btn bg-[#097133] text-white hover:bg-[#04642a] border-none ml-2 px-6"
        >
          Login
        </button>
      )}
    </div>
  );
};

export default NavMenuGeneral;
