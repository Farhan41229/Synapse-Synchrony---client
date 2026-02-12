import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';
import {
  Home,
  ChevronUp,
  User2,
  Plus,
  LibraryBig,
  Mail,
  Info,
  BookType,
  ShoppingCart,
  ClipboardList,
  Handshake,
  GitPullRequest,
  X,
  MessageCircle,
  FileText,
  FilePenLine,
  Brain,
  Heart,
  Activity,
  Lightbulb,
  Calendar,
  CalendarDays,
  CalendarPlus,
  Stethoscope,
  BookmarkCheck,
  HeartHandshake,
  FilePlus2,
  StickyNote,
  ScanText,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router';
import { FaExchangeAlt } from 'react-icons/fa';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthStore } from '@/store/authStore';

const role = 'User';
const Name = 'Farhan Tahsin Khan';
const items = [
  {
    title: 'Home',
    url: '/dashboard',
    icon: Home,
  },
  {
    title: 'My Profile',
    url: '/dashboard/profile',
    icon: User2,
  },
  {
    title: 'Chats',
    url: '/dashboard/chat',
    icon: MessageCircle,
  },
];
const UserSidebar = () => {
  const { user } = useAuthStore();
  // console.log(user);
  const photourl = user?.avatar;
  return (
    <Sidebar collapsible="icon" className="z-20">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/">
                <img
                  src={photourl ? photourl : ''}
                  alt="logo"
                  width={30}
                  height={30}
                  className="rounded-full min-h-5 min-w-5"
                />
                <span>{role} Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Application Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                  {item.title === 'Inbox' && (
                    <SidebarMenuBadge>24</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Wellness/Medilink Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Medilink Wellness</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/wellness'}>
                    <Brain />
                    Wellness Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/wellness/mood-history'}>
                    <Heart />
                    Mood History
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/wellness/stress-history'}>
                    <Activity />
                    Stress History
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/wellness/suggestions'}>
                    <Lightbulb />
                    Suggestions
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Health Assessment Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Health Assessment</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/medilink/diagnosis'}>
                    <Stethoscope />
                    Health Assessments
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Books Group */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Books</SidebarGroupLabel>
          <SidebarGroupAction>
            <Plus /> <span className="sr-only">Add Book</span>
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/browse'}>
                    <LibraryBig />
                    See All Books
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/mybooks'}>
                    <BookType />
                    See My Listings
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}

        {/* Cart + Orders Group */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Cart + Orders</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/my-cart'}>
                    <ShoppingCart />
                    My Cart
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/my-orders'}>
                    <ClipboardList />
                    My Orders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        {/* Trades Group */}
        {/* <SidebarGroup>
          <SidebarGroupLabel>Trades</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/requested-trades'}>
                    <GitPullRequest />
                    Requested Trades
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/trade-requests'}>
                    <FaExchangeAlt />
                    Trade Requests
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/accepted-trades'}>
                    <Handshake />
                    Accepted Trades
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/rejected-trades'}>
                    <X />
                    Rejected Trades
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup> */}
        {/* navigation Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/about'}>
                    <Info />
                    About
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/contact'}>
                    <Mail />
                    Contact
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {/* Blog Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Blogs</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/my-blogs'}>
                    <FileText />
                    My Blogs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/bookmarked-blogs'}>
                    <BookmarkCheck />
                    Bookmarked Blogs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/liked-blogs'}>
                    <HeartHandshake />
                    Liked Blogs
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/blog/blogs/create'}>
                    <FilePenLine />
                    Create Blog
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Notes Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Notes</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/notes">
                    <StickyNote />
                    My Notes
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/notes/create">
                    <FilePlus2 />
                    Create Note
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/notes/image-to-text">
                    <ScanText />
                    Image to text
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Schedule Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Schedule</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/schedule">
                    <Calendar />
                    My Schedule
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to="/dashboard/schedule/upload">
                    <CalendarPlus />
                    Upload Schedule
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        {/* Event Group */}
        <SidebarGroup>
          <SidebarGroupLabel>Events</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/my-events'}>
                    <CalendarDays />
                    My Events
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link to={'/dashboard/create-event'}>
                    <CalendarPlus />
                    Create Event
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuSubButton>
                  <User2 /> {Name?.slice(0, 19)}{' '}
                  <ChevronUp className="ml-auto" />
                </SidebarMenuSubButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/profile">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Setting</DropdownMenuItem>
                <DropdownMenuItem>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
