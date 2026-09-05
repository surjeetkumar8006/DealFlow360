import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const MainLayout = () => {
  const location = useLocation();

  if (['/login', '/signup'].includes(location.pathname)) {
    return <Outlet />;
  }

  return (
    <div className="h-screen max-h-screen overflow-hidden flex bg-[var(--paper-dim)] text-[var(--text)] font-sans antialiased">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <TopBar />
        <main className="flex-1 p-3 sm:p-5 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
