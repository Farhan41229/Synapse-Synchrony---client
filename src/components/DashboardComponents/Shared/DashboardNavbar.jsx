import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/store/authStore';
import { LogOut, Settings, User } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';

const DashboardNavbar = () => {
  const { user } = useAuthStore();
  console.log(user);
  const photourl = user?.avatar;
  const dbUser = undefined;

  return (
    <nav className="p-4 flex items-center justify-between">
      <SidebarTrigger />
      <div className="flex items-center gap-4">
        <Link to={'/'}>Home</Link>
        <ModeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src={photourl ?? undefined}
                alt={dbUser?.image ?? 'User avatar'}
                referrerPolicy="no-referrer"
                key={dbUser?.image ?? 'no-photo'}
                onError={(e) => {
                  e.currentTarget.src = '/avatar-placeholder.png';
                }}
              />
              <AvatarFallback>
                {dbUser?.displayName
                  ?.split(' ')
                  .map((s) => s[0])
                  .join('')
                  .slice(0, 2) || 'CN'}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link className="flex gap-2" to={'/dashboard/myProfile'}>
                <User className="h-[1.2rem] w-[1.2rem] mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
