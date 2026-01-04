import React from 'react';
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import SuperAdminSidebar from './SuperAdminSidebar';
import Header from './Header';

const SuperAdminLayout: React.FC = () => {
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      {/* Main Content */}
      <div className={`transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-20'
      }`}>
        <Header />
        
        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
