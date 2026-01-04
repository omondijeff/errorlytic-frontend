import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  DocumentTextIcon,
  UsersIcon,
  ClipboardDocumentListIcon,
  Cog6ToothIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  KeyIcon,
  BoltIcon,
  TagIcon,
} from '@heroicons/react/24/outline';
import type { RootState } from '../../store';

const Sidebar: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  // Define role-based navigation
  const navigation = useMemo(() => {
    const baseNav = [
      // Common routes
      { name: 'Dashboard', href: '/app/dashboard', icon: HomeIcon, roles: ['individual', 'garage_user', 'garage_admin', 'insurer_user', 'insurer_admin', 'superadmin'] },
      { name: 'Reports', href: '/app/analysis', icon: DocumentTextIcon, roles: ['individual', 'garage_user', 'garage_admin', 'insurer_user', 'insurer_admin', 'superadmin'] },

      // Credits for individual users
      { name: 'Buy Credits', href: '/app/credits', icon: BoltIcon, roles: ['individual'] },

      // Regular user management (garage/insurer admins)
      { name: 'Users', href: '/app/users', icon: UsersIcon, roles: ['garage_admin', 'insurer_admin'] },

      // Super Admin specific routes
      { name: 'User Management', href: '/app/user-management', icon: UsersIcon, roles: ['superadmin'], divider: true },
      { name: 'Organizations', href: '/app/organizations', icon: BuildingOfficeIcon, roles: ['superadmin'] },
      { name: 'System Analytics', href: '/app/analytics', icon: ChartBarIcon, roles: ['superadmin'] },
      { name: 'Activity Logs', href: '/app/activity-logs', icon: ClockIcon, roles: ['superadmin'] },
      { name: 'Billing & Revenue', href: '/app/billing', icon: CurrencyDollarIcon, roles: ['superadmin'] },
      { name: 'Pricing', href: '/app/pricing', icon: TagIcon, roles: ['superadmin'] },
      { name: 'Platform Settings', href: '/app/platform-settings', icon: ShieldCheckIcon, roles: ['superadmin'] },
      { name: 'API Management', href: '/app/api-management', icon: KeyIcon, roles: ['superadmin'] },

      // Common routes
      { name: 'Diagnostic Summary', href: '/app/diagnostic-summary', icon: ClipboardDocumentListIcon, roles: ['garage_user', 'garage_admin', 'insurer_user', 'insurer_admin', 'superadmin'], divider: true },
      { name: 'Settings', href: '/app/profile', icon: Cog6ToothIcon, roles: ['individual', 'garage_user', 'garage_admin', 'insurer_user', 'insurer_admin', 'superadmin'] },
    ];

    // Filter navigation based on user role
    return baseNav.filter((item) => item.roles.includes(user?.role || 'individual'));
  }, [user?.role]);

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-20 px-8 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-[#EA6A47]">Errorlytic</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-8 space-y-1 overflow-y-auto">
        {navigation.map((item, index) => (
          <React.Fragment key={item.name}>
            {item.divider && <div className="my-4 mx-8 border-t border-gray-200"></div>}
            <NavLink
              to={item.href}
              className={({ isActive }) =>
                `flex items-center px-8 py-3 text-base font-medium transition-colors relative ${
                  isActive
                    ? 'text-[#EA6A47]'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              {/* Left border indicator for active state */}
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#EA6A47] rounded-r-md"></span>
                  )}
                  <item.icon className="h-6 w-6 mr-3" />
                  {item.name}
                </>
              )}
            </NavLink>
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
