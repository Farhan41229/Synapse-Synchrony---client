import UserSidebar from '@/components/DashboardComponents/UserDashboard/UserSidebar';
import Navbar from '@/components/Shared/Navbar/Navbar';
import { Sidebar, SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

const DashboardLayout = () => {
  return (
    <>
      <div>
        <nav className="sticky top-0 z-100">
          <Navbar />
        </nav>
        <main className="flex gap-2">
          <SidebarProvider>
            <UserSidebar />
          </SidebarProvider>
        </main>
      </div>
    </>
  );
};

export default DashboardLayout;
