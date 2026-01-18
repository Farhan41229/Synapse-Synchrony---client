import DashboardNavbar from '@/components/DashboardComponents/Shared/DashboardNavbar';
import UserSidebar from '@/components/DashboardComponents/UserDashboard/UserSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet, useLocation } from 'react-router';

const DashboardLayout = () => {
  const location = useLocation();
  const isChatRoute = location.pathname.includes('/dashboard/chat');

  return (
    <div className="flex">
      <SidebarProvider>
        <UserSidebar />
        <main className="w-full">
          <DashboardNavbar />
          {/* Conditionally apply padding - no padding for chat routes */}
          <div className={isChatRoute ? '' : 'px-4'}>
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
