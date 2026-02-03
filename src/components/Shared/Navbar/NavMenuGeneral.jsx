import { ModeToggle } from '@/components/mode-toggle';
import NavButton from './NavButton';
import { useNavigate, Link } from 'react-router';
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
import { ChartBar, LogOut, MessageCircle, User, FileText, Heart, LayoutDashboard } from 'lucide-react';

const NavMenuGeneral = () => {
  const navigate = useNavigate();
  const { user, isLoading, logout } = useAuthStore(); // Placeholder for your auth logic
  const photourl = user?.avatar || null;

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
              <AvatarImage src={photourl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={20}>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/dashboard" className="cursor-pointer">
                <LayoutDashboard /> Dashboard
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/profile" className="cursor-pointer">
                <User /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/dashboard/chat" className="cursor-pointer">
                <MessageCircle /> Chat
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/blog" className="cursor-pointer">
                <FileText /> Blog
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/medilink" className="cursor-pointer">
                <Heart /> Medilink
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={() => {
                HandleLogout();
              }}
            >
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
