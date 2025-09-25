import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion } from 'framer-motion';
import {
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import ModernButton from '../../components/UI/ModernButton';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ElementType;
  trend?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon: Icon, trend }) => (
  <motion.div
    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6 hover:shadow-tajilabs-lg transition-all duration-300"
    whileHover={{ scale: 1.02, y: -2 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 font-sf-pro-text mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 font-sf-pro mb-2">{value}</p>
        <div className="flex items-center space-x-2">
          {changeType === 'positive' ? (
            <ArrowUpIcon className="h-4 w-4 text-green-500" />
          ) : (
            <ArrowDownIcon className="h-4 w-4 text-red-500" />
          )}
          <p className={`text-sm font-medium font-sf-pro-text ${
            changeType === 'positive' ? 'text-green-600' : 'text-red-600'
          }`}>
            {change}
          </p>
          <p className="text-sm text-gray-500 font-sf-pro-text">from last month</p>
        </div>
      </div>
      <div className={`h-16 w-16 bg-gradient-to-br from-tajilabs-primary/10 to-tajilabs-secondary/10 rounded-2xl flex items-center justify-center shadow-sm ${
        title === 'Total Analyses' ? 'animate-engine-start' :
        title === 'Active Quotations' ? 'animate-wrench-turn' :
        title === 'Success Rate' ? 'animate-success-check' :
        'animate-dashboard-glow'
      }`}>
        <Icon className="h-8 w-8 text-tajilabs-primary" />
      </div>
    </div>
  </motion.div>
);

const QuickActionCard: React.FC<{ title: string; description: string; icon: React.ElementType; color: string }> = ({ 
  title, 
  description, 
  icon: Icon, 
  color 
}) => (
  <motion.div
    className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6 hover:shadow-tajilabs-lg transition-all duration-300 cursor-pointer"
    whileHover={{ scale: 1.02, y: -2 }}
    whileTap={{ scale: 0.98 }}
    transition={{ duration: 0.2 }}
  >
    <div className="flex items-start space-x-4">
      <div className={`h-12 w-12 ${color} rounded-xl flex items-center justify-center shadow-sm ${
        title === 'New Analysis' ? 'animate-diagnostic-scan' :
        title === 'View Reports' ? 'animate-scan-wave' :
        title === 'Generate Quote' ? 'animate-wrench-turn' :
        'animate-oil-drip'
      }`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900 font-sf-pro mb-1">{title}</h3>
        <p className="text-sm text-gray-600 font-sf-pro-text">{description}</p>
      </div>
    </div>
  </motion.div>
);

const DashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const stats = [
    {
      name: 'Total Analyses',
      value: '24',
      change: '+12%',
      changeType: 'positive' as const,
      icon: DocumentTextIcon,
      trend: 12,
    },
    {
      name: 'Active Quotations',
      value: '8',
      change: '+3',
      changeType: 'positive' as const,
      icon: ClipboardDocumentListIcon,
      trend: 8,
    },
    {
      name: 'Success Rate',
      value: '94%',
      change: '+2%',
      changeType: 'positive' as const,
      icon: ChartBarIcon,
      trend: 2,
    },
    {
      name: 'Avg. Response Time',
      value: '2.4m',
      change: '-0.3m',
      changeType: 'positive' as const,
      icon: ClockIcon,
      trend: -0.3,
    },
  ];

  const quickActions = [
    {
      title: 'New Analysis',
      description: 'Upload diagnostic file and get AI-powered analysis',
      icon: PlusIcon,
      color: 'bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary',
    },
    {
      title: 'View Reports',
      description: 'Browse through your analysis history and reports',
      icon: EyeIcon,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
    },
    {
      title: 'Generate Quote',
      description: 'Create professional quotations for your clients',
      icon: ClipboardDocumentListIcon,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
    },
    {
      title: 'Manage Users',
      description: 'Add team members and manage permissions',
      icon: UsersIcon,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'analysis',
      title: 'New analysis completed',
      description: 'VW Golf 2018 - P0300 error code',
      time: '2 minutes ago',
      status: 'completed',
    },
    {
      id: 2,
      type: 'quotation',
      title: 'Quotation sent',
      description: 'Customer accepted quotation #QT-001',
      time: '15 minutes ago',
      status: 'sent',
    },
    {
      id: 3,
      type: 'analysis',
      title: 'Analysis in progress',
      description: 'BMW X3 2020 - Multiple DTCs detected',
      time: '1 hour ago',
      status: 'processing',
    },
    {
      id: 4,
      type: 'billing',
      title: 'Payment received',
      description: 'Monthly subscription payment processed',
      time: '2 hours ago',
      status: 'paid',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="relative min-h-screen">
      <AnimatedBackground variant="particles" intensity="subtle" />
      
      <div className="relative z-10 space-y-8 p-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-tajilabs-primary via-tajilabs-primary to-tajilabs-secondary rounded-3xl p-8 text-white shadow-tajilabs-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-sf-pro">
                Welcome back, {user?.profile?.name || 'User'}!
              </h1>
              <p className="text-xl text-white/90 font-sf-pro-text mb-4">
                Here's what's happening with your automotive diagnostics today.
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 bg-white/30 rounded-full"></div>
                  <span className="text-sm font-medium font-sf-pro-text">All systems operational</span>
                </div>
                  <div className="flex items-center space-x-2">
                    <ArrowTrendingUpIcon className="h-4 w-4 text-white/80" />
                    <span className="text-sm font-medium font-sf-pro-text">Performance up 12%</span>
                  </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ChartBarIcon className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <StatCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 font-sf-pro">Recent Activities</h3>
              <button className="text-sm font-medium text-tajilabs-primary hover:text-tajilabs-secondary transition-colors font-sf-pro-text">
                View all
              </button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50/50 transition-colors"
                >
                  <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    {activity.type === 'analysis' ? (
                      <DocumentTextIcon className="h-6 w-6 text-tajilabs-primary" />
                    ) : activity.type === 'quotation' ? (
                      <ClipboardDocumentListIcon className="h-6 w-6 text-tajilabs-primary" />
                    ) : (
                      <CurrencyDollarIcon className="h-6 w-6 text-tajilabs-primary" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-gray-900 font-sf-pro">{activity.title}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full font-sf-pro-text ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                    <p className="text-gray-600 font-sf-pro-text mb-1">{activity.description}</p>
                    <p className="text-sm text-gray-500 font-sf-pro-text">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 font-sf-pro">Quick Actions</h3>
            <div className="space-y-4">
              <ModernButton
                variant="gradient"
                size="lg"
                fullWidth
                icon={<PlusIcon className="h-5 w-5" />}
                className="py-4"
              >
                New Analysis
              </ModernButton>
              <ModernButton
                variant="secondary"
                size="lg"
                fullWidth
                icon={<EyeIcon className="h-5 w-5" />}
                className="py-4"
              >
                View Reports
              </ModernButton>
              <ModernButton
                variant="outline"
                size="lg"
                fullWidth
                icon={<CurrencyDollarIcon className="h-5 w-5" />}
                className="py-4"
              >
                Manage Billing
              </ModernButton>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
      >
        <h3 className="text-2xl font-bold text-gray-900 mb-6 font-sf-pro">Performance Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl border border-green-200">
            <div className="h-16 w-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ArrowTrendingUpIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-2">Efficiency</h4>
            <p className="text-3xl font-bold text-green-600 font-sf-pro">94%</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Above industry average</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="h-16 w-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <ClockIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-2">Response Time</h4>
            <p className="text-3xl font-bold text-blue-600 font-sf-pro">2.4m</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Average processing time</p>
          </div>
          
          <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
            <div className="h-16 w-16 bg-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
              <UsersIcon className="h-8 w-8 text-white" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-2">Satisfaction</h4>
            <p className="text-3xl font-bold text-purple-600 font-sf-pro">4.8/5</p>
            <p className="text-sm text-gray-600 font-sf-pro-text">Customer rating</p>
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;