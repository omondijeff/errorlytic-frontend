import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { toggleSidebar } from '../../store/slices/uiSlice';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Bars3Icon, 
  BellIcon, 
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { notifications } = useSelector((state: RootState) => state.ui);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white/95 backdrop-blur-xl shadow-tajilabs border-b border-tajilabs px-8 py-6">
      <div className="flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center space-x-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => dispatch(toggleSidebar())}
            className="p-3 rounded-ios hover:bg-tajilabs-primary/8 transition-colors"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </motion.button>
          
          <div>
            <h1 className="text-ios-title2 text-gray-900 font-sf-pro">
              Errorlytic
            </h1>
            <p className="text-ios-caption1 text-gray-500 font-sf-pro-text">
              Automotive Diagnostic Platform
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-ios hover:bg-tajilabs-primary/8 transition-colors relative"
            >
              <BellIcon className="h-6 w-6 text-gray-600" />
              {notifications.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 h-6 w-6 bg-tajilabs-primary text-white text-ios-caption2 rounded-full flex items-center justify-center font-sf-pro-text shadow-tajilabs"
                >
                  {notifications.length}
                </motion.span>
              )}
            </motion.button>
          </div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-ios hover:bg-tajilabs-primary/8 transition-colors"
          >
            <Cog6ToothIcon className="h-6 w-6 text-gray-600" />
          </motion.button>

              {/* User Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 pl-4 hover:bg-gray-50 rounded-xl p-2 transition-colors"
                >
                  <div className="text-right">
                    <p className="text-ios-body font-medium text-gray-900 font-sf-pro-text">
                      {user?.profile?.name || 'User'}
                    </p>
                    <p className="text-ios-caption1 text-gray-500 capitalize font-sf-pro-text">
                      {user?.role?.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-full flex items-center justify-center shadow-tajilabs">
                    <UserCircleIcon className="h-6 w-6 text-white" />
                  </div>
                  <ChevronDownIcon className={`h-4 w-4 text-gray-500 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-tajilabs-lg border border-gray-200/50 py-2 z-50"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 font-sf-pro-text">
                        {user?.profile?.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-500 font-sf-pro-text">
                        {user?.email}
                      </p>
                    </div>
                    
                    <div className="py-2">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-sf-pro-text"
                      >
                        <UserIcon className="h-5 w-5 mr-3" />
                        Profile Settings
                      </button>
                      
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 font-sf-pro-text"
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-3" />
                        Settings
                      </button>
                      
                      <div className="border-t border-gray-100 my-2"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-sf-pro-text"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                        Sign out
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
