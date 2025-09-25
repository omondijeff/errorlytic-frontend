import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  HomeIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  CreditCardIcon,
  UserIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
    { name: 'Analysis', href: '/analysis', icon: DocumentTextIcon },
    { name: 'Quotations', href: '/quotations', icon: ClipboardDocumentListIcon },
    { name: 'Billing', href: '/billing', icon: CreditCardIcon },
    { name: 'Profile', href: '/profile', icon: UserIcon },
  ];

  // Add admin-only routes
  if (user?.role === 'garage_admin' || user?.role === 'insurer_admin' || user?.role === 'superadmin') {
    navigation.splice(4, 0, { name: 'Analytics', href: '/analytics', icon: ChartBarIcon });
    navigation.splice(5, 0, { name: 'Settings', href: '/settings', icon: Cog6ToothIcon });
  }

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${
      sidebarOpen ? 'w-72' : 'w-20'
    }`}>
      <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl shadow-tajilabs-lg border-r border-tajilabs">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center px-6 border-b border-tajilabs">
          <div className="flex items-center space-x-4">
            <div className="h-12 w-12 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-ios-lg flex items-center justify-center shadow-tajilabs">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-ios-title2 text-gray-900 font-sf-pro">Errorlytic</h2>
                <p className="text-ios-caption1 text-gray-500 font-sf-pro-text">by Tajilabs</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.href}
                className={({ isActive }) =>
                  `tajilabs-nav-item flex items-center text-ios-body font-sf-pro-text ${
                    isActive
                      ? 'bg-tajilabs-primary text-white shadow-tajilabs'
                      : 'text-gray-700 hover:bg-tajilabs-primary/8'
                  }`
                }
              >
                <item.icon className="h-6 w-6 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="ml-4"
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* User Info */}
        <div className="border-t border-tajilabs p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-full flex items-center justify-center shadow-tajilabs">
              <UserIcon className="h-6 w-6 text-white" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex-1 min-w-0"
              >
                <p className="text-ios-body font-medium text-gray-900 truncate font-sf-pro-text">
                  {user?.profile?.name || 'User'}
                </p>
                <p className="text-ios-caption1 text-gray-500 truncate font-sf-pro-text">
                  {user?.role?.replace('_', ' ')}
                </p>
              </motion.div>
            )}
          </div>
          
              {sidebarOpen && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  onClick={handleLogout}
                  className="w-full flex items-center px-4 py-3 text-ios-body text-gray-700 hover:bg-tajilabs-primary/8 rounded-ios transition-colors font-sf-pro-text"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                  Sign out
                </motion.button>
              )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
