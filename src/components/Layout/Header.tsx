import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import {
  MagnifyingGlassIcon,
  BellIcon,
  PlusIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import UploadModal from '../Upload/UploadModal';

const Header: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [imageError, setImageError] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Get page title and subtitle based on route
  const getPageInfo = () => {
    const path = location.pathname;

    // Super Admin routes (check specific routes first)
    if (path.includes('/user-management')) {
      return { title: 'User Management', subtitle: 'Manage platform users and permissions' };
    } else if (path.includes('/organizations')) {
      return { title: 'Organizations', subtitle: 'Manage garages and insurance companies' };
    } else if (path.includes('/analytics')) {
      return { title: 'System Analytics', subtitle: 'Platform-wide insights and performance metrics' };
    } else if (path.includes('/activity-logs')) {
      return { title: 'Activity Logs', subtitle: 'Track all platform activities and events' };
    } else if (path.includes('/platform-settings')) {
      return { title: 'Platform Settings', subtitle: 'Configure system-wide settings' };
    } else if (path.includes('/api-management')) {
      return { title: 'API Management', subtitle: 'Manage API keys and endpoints' };
    }

    // Regular routes
    if (path.includes('/dashboard')) {
      return { title: 'Dashboard', subtitle: 'Your overview of reports uploaded' };
    } else if (path.match(/\/analysis\/[^/]+$/)) {
      // This is a specific analysis detail page (e.g., /app/analysis/:id)
      return { title: 'AI Diagnostic Summary', subtitle: "Here's what we found after analyzing your VCDS report." };
    } else if (path.includes('/analysis')) {
      return { title: 'Reports', subtitle: 'Your overview of reports uploaded' };
    } else if (path.includes('/quotations')) {
      return { title: 'Quotations', subtitle: 'Manage your quotations and pricing' };
    } else if (path.includes('/billing')) {
      return { title: 'Billing & Revenue', subtitle: 'Monitor revenue and subscription metrics' };
    } else if (path.includes('/profile')) {
      return { title: 'Profile', subtitle: 'Manage your account settings' };
    } else if (path.includes('/users')) {
      return { title: 'Users', subtitle: 'Manage team members and permissions' };
    } else if (path.includes('/diagnostic-summary')) {
      return { title: 'Diagnostic Summary', subtitle: 'Detailed diagnostic report analysis' };
    }
    return { title: 'Dashboard', subtitle: 'Your overview of reports uploaded' };
  };

  const { title, subtitle } = getPageInfo();

  return (
    <header className="bg-white border-b border-gray-200 px-8 h-20 flex items-center">
      <div className="flex items-center justify-between w-full">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-bold text-black">{title}</h1>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-6">
          {/* Search Bar */}
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search VIN, Report ID, or License plate"
              className="pl-12 pr-4 py-3 w-96 bg-gray-50 border border-gray-200 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            />
          </div>

          {/* Upload Button */}
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium"
          >
            <span>Upload</span>
            <PlusIcon className="h-5 w-5" />
          </button>

          {/* Notification Bell */}
          <button className="relative p-2 hover:bg-gray-50 rounded-full transition-colors">
            <BellIcon className="h-6 w-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Avatar with Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              {user?.profile?.picture && !imageError ? (
                <img
                  src={user.profile.picture}
                  alt="User avatar"
                  className="h-10 w-10 rounded-full object-cover border-2 border-gray-200 hover:border-[#EA6A47] transition-colors"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#EA6A47] to-[#d85a37] flex items-center justify-center hover:shadow-lg transition-shadow">
                  <UserCircleIcon className="h-6 w-6 text-white" />
                </div>
              )}
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">{user?.profile?.name || 'User'}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                {/* Menu Items */}
                <button
                  onClick={() => {
                    navigate('/app/profile');
                    setIsProfileDropdownOpen(false);
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <UserIcon className="h-5 w-5 mr-3 text-gray-400" />
                  Profile Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3 text-red-500" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
      />
    </header>
  );
};

export default Header;
