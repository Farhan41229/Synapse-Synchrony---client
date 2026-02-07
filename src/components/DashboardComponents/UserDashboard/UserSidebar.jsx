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
  SidebarSeparator,
} from '@/components/ui/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Home,
  ChevronUp,
  ChevronDown,
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
  Pill,
  BookmarkCheck,
  HeartHandshake,
  FilePlus2,
  StickyNote,
  ScanText,
  LayoutDashboard,
  HeartPulse,
  Compass,
  Settings,
  LogOut,
  Circle,
} from 'lucide-react';
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router';
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
  const location = useLocation();
  const pathname = location.pathname;
  
  // State for collapsible groups
  const [openGroups, setOpenGroups] = useState({
    application: true,      // Default open
    wellness: false,        // Default closed
    medical: false,         // Default closed
    navigation: true,       // Default open
    blogs: false,           // Default closed
    notes: false,           // Default closed
    schedule: false,        // Default closed
    events: false,          // Default closed
  });
  
  // console.log(user);
  const photourl = user?.avatar;
  return (
    <Sidebar collapsible="icon" className="z-20">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="size-8 rounded-lg overflow-hidden">
            <img
              src={photourl || '/default-avatar.png'}
              alt="logo"
              className="size-8 object-cover"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm">Synapse Synchrony</span>
            <span className="text-xs text-sidebar-muted">User Dashboard</span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-y-auto overflow-x-hidden px-2">
        {/* Application Group */}
        <Collapsible open={openGroups.application} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, application: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="size-4" />
                  <span>Application</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={pathname === item.url} tooltip={item.title}>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                      {item.title === 'Inbox' && (
                        <SidebarMenuBadge>24</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
        {/* Wellness/Medilink Group */}
        <Collapsible open={openGroups.wellness} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, wellness: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <HeartPulse className="size-4" />
                  <span>Medilink Wellness</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
        {/* Medical Diagnosis Group */}
        <Collapsible open={openGroups.medical} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, medical: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <Stethoscope className="size-4" />
                  <span>Medical Diagnosis</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/medilink/diagnosis'}>
                        <Stethoscope />
                        Diagnosis Sessions
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/my-medications'}>
                        <Pill />
                        My Medications
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
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
        </Collapsible>
        
        {/* Navigation Group */}
        <Collapsible open={openGroups.navigation} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, navigation: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <Compass className="size-4" />
                  <span>Navigation</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/about'}>
                        <Info />
                        About
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/contact'}>
                        <Mail />
                        Contact
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
        {/* Blogs Group */}
        <Collapsible open={openGroups.blogs} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, blogs: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <FileText className="size-4" />
                  <span>Blogs</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/blogs'}>
                        <FileText />
                        All Blogs
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/my-blogs'}>
                        <BookmarkCheck />
                        My Blogs
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link to={'/dashboard/create-blog'}>
                        <FilePenLine />
                        Create Blog
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>

        {/* Notes Group */}
        <Collapsible open={openGroups.notes} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, notes: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <StickyNote className="size-4" />
                  <span>Notes</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
        {/* Schedule Group */}
        <Collapsible open={openGroups.schedule} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, schedule: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <Calendar className="size-4" />
                  <span>Schedule</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        
        {/* Event Group */}
        <Collapsible open={openGroups.events} onOpenChange={(open) => setOpenGroups(prev => ({ ...prev, events: open }))}>
          <SidebarGroup>
            <CollapsibleTrigger asChild>
              <SidebarGroupLabel className="text-sidebar-group-label font-semibold tracking-wide uppercase text-xs flex items-center justify-between cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 transition-colors group">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4" />
                  <span>Events</span>
                </div>
                <ChevronDown className="size-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
              </SidebarGroupLabel>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuSubButton className="h-12 hover:bg-sidebar-accent transition-colors">
                  <div className="size-8 rounded-full bg-sidebar-accent flex items-center justify-center overflow-hidden">
                    {photourl ? (
                      <img src={photourl} alt="User" className="size-8 rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-medium">{user?.name?.[0] || 'U'}</span>
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0 text-left">
                    <span className="text-sm font-medium truncate">{user?.name || Name}</span>
                    <span className="text-xs text-sidebar-muted truncate">{user?.email || 'user@synapse.com'}</span>
                  </div>
                  <ChevronUp className="size-4" />
                </SidebarMenuSubButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56" side="top">
                <DropdownMenuItem asChild className="cursor-pointer">
                  <Link to="/dashboard/profile" className="flex items-center gap-2">
                    <User2 className="size-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2">
                  <Settings className="size-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive">
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
