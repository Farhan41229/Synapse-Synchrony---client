import DashboardNavbar from '@/components/DashboardComponents/Shared/DashboardNavbar';
import UserSidebar from '@/components/DashboardComponents/UserDashboard/UserSidebar';
import Navbar from '@/components/Shared/Navbar/Navbar';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import { Outlet } from 'react-router';

const DashboardLayout = () => {
  return (
    <>
      <div className="flex">
        <SidebarProvider>
          <UserSidebar />
          <main className="w-full">
            <DashboardNavbar />
            <div className="px-4">
              {/* {children} */}
              <Outlet />
            </div>
          </main>
        </SidebarProvider>
      </div>
    </>
  );
};

export default DashboardLayout;
