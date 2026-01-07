import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  UsersIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  WrenchScrewdriverIcon,
  UserIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { NavLink, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../../assets/logo-web-landscape.png';

const SuperAdminSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Overview', href: '/superadmin/dashboard', icon: HomeIcon },
    { name: 'Users', href: '/superadmin/users', icon: UsersIcon },
    { name: 'Organizations', href: '/superadmin/organizations', icon: BuildingOfficeIcon },
    { name: 'Analytics', href: '/superadmin/analytics', icon: ChartBarIcon },
    { name: 'Finance', href: '/superadmin/finance', icon: CurrencyDollarIcon },
    { name: 'Monitoring', href: '/superadmin/monitoring', icon: ShieldCheckIcon },
    { name: 'Audit Logs', href: '/superadmin/audit', icon: ClipboardDocumentListIcon },
    { name: 'Content', href: '/superadmin/content', icon: DocumentTextIcon },
    { name: 'Reports', href: '/superadmin/reports', icon: ChartBarIcon },
    { name: 'Support', href: '/superadmin/support', icon: WrenchScrewdriverIcon },
    { name: 'Settings', href: '/superadmin/settings', icon: Cog6ToothIcon },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 ${sidebarOpen ? 'w-72' : 'w-20'
      }`}>
      <div className="flex h-full flex-col bg-white/95 backdrop-blur-xl shadow-tajilabs-lg border-r border-tajilabs">
        {/* Logo */}
        <div className="flex h-20 items-center justify-center px-6 border-b border-tajilabs">
          <Link to="/superadmin/dashboard" className="flex items-center">
            <img src={logo} alt="Errorlytic Logo" className={`h-10 w-auto object-contain transition-all ${sidebarOpen ? '' : 'scale-150'}`} />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
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
                  `tajilabs-nav-item flex items-center text-ios-body font-sf-pro-text ${isActive
                    ? 'bg-red-600 text-white shadow-tajilabs'
                    : 'text-gray-700 hover:bg-red-50'
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
            <div className="h-12 w-12 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center shadow-tajilabs">
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
                  {user?.profile?.name || 'Super Admin'}
                </p>
                <p className="text-ios-caption1 text-red-600 truncate font-sf-pro-text">
                  Super Administrator
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
              className="w-full flex items-center px-4 py-3 text-ios-body text-gray-700 hover:bg-red-50 rounded-ios transition-colors font-sf-pro-text"
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

export default SuperAdminSidebar;


