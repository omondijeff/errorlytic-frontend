import React from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon, 
  CurrencyDollarIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SuperAdminDashboard: React.FC = () => {
  // Mock data - replace with actual API calls
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
    },
    {
      name: 'Organizations',
      value: '45',
      change: '+8%',
      changeType: 'positive',
      icon: BuildingOfficeIcon,
    },
    {
      name: 'Analyses Today',
      value: '89',
      change: '+23%',
      changeType: 'positive',
      icon: DocumentTextIcon,
    },
    {
      name: 'Revenue (KES)',
      value: '2.4M',
      change: '+15%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
    },
    {
      name: 'System Health',
      value: '99.9%',
      change: '0%',
      changeType: 'neutral',
      icon: ShieldCheckIcon,
    },
    {
      name: 'API Calls/Hour',
      value: '1,234',
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: john.doe@example.com',
      timestamp: '2 minutes ago',
      icon: UsersIcon,
    },
    {
      id: 2,
      type: 'organization_created',
      message: 'New organization created: AutoFix Garage',
      timestamp: '15 minutes ago',
      icon: BuildingOfficeIcon,
    },
    {
      id: 3,
      type: 'analysis_completed',
      message: 'Analysis completed for VIN: 1HGBH41JXMN109186',
      timestamp: '1 hour ago',
      icon: DocumentTextIcon,
    },
    {
      id: 4,
      type: 'payment_received',
      message: 'Payment received: KES 15,000 from Premium Garage',
      timestamp: '2 hours ago',
      icon: CurrencyDollarIcon,
    },
    {
      id: 5,
      type: 'system_alert',
      message: 'High API usage detected from user: admin@garage.com',
      timestamp: '3 hours ago',
      icon: ExclamationTriangleIcon,
    },
  ];

  return (
    <div className="space-y-8 w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 font-sf-pro">Super Admin Dashboard</h1>
        <p className="mt-2 text-gray-600 font-sf-pro-text">
          Monitor and manage the VAGnosis platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-tajilabs p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-sf-pro-text">
                  {stat.name}
                </p>
                <p className="text-3xl font-bold text-gray-900 font-sf-pro mt-2">
                  {stat.value}
                </p>
                <div className="flex items-center mt-2">
                  <span
                    className={`text-sm font-medium ${
                      stat.changeType === 'positive'
                        ? 'text-green-600'
                        : stat.changeType === 'negative'
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">vs last month</span>
                </div>
              </div>
              <div className="h-12 w-12 bg-gradient-to-br from-red-50 to-red-100 rounded-xl flex items-center justify-center">
                <stat.icon className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-2xl shadow-tajilabs p-6 border border-gray-200"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 font-sf-pro">
            Recent Activity
          </h2>
          <button className="text-sm text-red-600 hover:text-red-700 font-medium font-sf-pro-text">
            View all
          </button>
        </div>
        
        <div className="space-y-4">
          {recentActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <activity.icon className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 font-sf-pro-text">
                  {activity.message}
                </p>
                <div className="flex items-center mt-1">
                  <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 font-sf-pro-text">
                    {activity.timestamp}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white rounded-2xl shadow-tajilabs p-6 border border-gray-200"
      >
        <h2 className="text-xl font-semibold text-gray-900 font-sf-pro mb-6">
          Quick Actions
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <UsersIcon className="h-8 w-8 text-red-600 mb-2" />
            <p className="font-medium text-gray-900 font-sf-pro-text">Add User</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Create new user account</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <BuildingOfficeIcon className="h-8 w-8 text-red-600 mb-2" />
            <p className="font-medium text-gray-900 font-sf-pro-text">Add Organization</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Create new organization</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <ChartBarIcon className="h-8 w-8 text-red-600 mb-2" />
            <p className="font-medium text-gray-900 font-sf-pro-text">Generate Report</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Create system report</p>
          </button>
          
          <button className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left">
            <ShieldCheckIcon className="h-8 w-8 text-red-600 mb-2" />
            <p className="font-medium text-gray-900 font-sf-pro-text">System Health</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Check system status</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SuperAdminDashboard;
