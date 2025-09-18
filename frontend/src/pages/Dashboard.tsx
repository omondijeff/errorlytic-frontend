import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Car, 
  FileText, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign,
  Clock,
  User,
  Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const stats = [
    { label: 'Total Quotations', value: '12', icon: FileText, color: 'from-blue-500 to-blue-700' },
    { label: 'Active Quotes', value: '5', icon: Car, color: 'from-green-500 to-green-700' },
    { label: 'Error Codes', value: '156', icon: AlertTriangle, color: 'from-orange-500 to-orange-700' },
    { label: 'Total Revenue', value: 'KES 45,000', icon: DollarSign, color: 'from-red-500 to-red-700' }
  ];

  const recentQuotations = [
    { id: '1', vehicle: 'Volkswagen Golf 2020', status: 'draft', amount: 'KES 12,500', date: '2025-08-17' },
    { id: '2', vehicle: 'Audi A4 2019', status: 'pending', amount: 'KES 18,750', date: '2025-08-16' },
    { id: '3', vehicle: 'Porsche 911 2021', status: 'approved', amount: 'KES 45,000', date: '2025-08-15' }
  ];

  const quickActions = [
    { title: 'Create Quotation', description: 'Start a new car repair quote', icon: Plus, link: '/quotations/create', color: 'from-red-500 to-red-700' },
    { title: 'View Error Codes', description: 'Browse VAG error code database', icon: AlertTriangle, link: '/error-codes', color: 'from-orange-500 to-orange-700' },
    { title: 'Manage Quotes', description: 'View and edit quotations', icon: FileText, link: '/quotations', color: 'from-blue-500 to-blue-700' }
  ];

  return (
    <div className="min-h-screen pt-16" style={{ 
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <img 
              src={theme === 'dark' ? "/logos/logo_light.png" : "/logos/logo_dark.png"} 
              alt="DeQuote Logo" 
              className="h-12 w-auto"
            />
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Welcome back, {user?.firstName}! 👋
              </h1>
              <p style={{ color: 'var(--text-secondary)' }}>
                Welcome to your VAG Culture Hub dashboard. Here's what's happening in your exclusive VAG community today.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="glass-card p-6 card-hover"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Quick Actions</h2>
              <div className="space-y-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.title}
                      to={action.link}
                      className="block p-4 rounded-lg transition-all duration-300 hover:scale-105"
                      style={{ 
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border-primary)'
                      }}
                    >
                      <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{action.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{action.description}</p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Recent Quotations */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold mb-6" style={{ color: 'var(--text-primary)' }}>Recent Quotations</h2>
              <div className="space-y-4">
                {recentQuotations.map((quote, index) => (
                  <motion.div
                    key={quote.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ background: 'var(--bg-secondary)' }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ 
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                      }}>
                        <Car className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>{quote.vehicle}</h3>
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>{quote.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>{quote.amount}</div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quote.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                        quote.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {quote.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <div className="glass-card p-8">
            <h2 className="text-2xl font-bold text-white mb-4">
              Ready to create your next quotation?
            </h2>
            <p className="text-dark-300 mb-6">
              Start building professional repair estimates for VAG vehicles with our AI-powered system.
            </p>
            <Link to="/quotations/create" className="glass-button inline-flex items-center space-x-2">
              <Plus className="w-5 h-5" />
              <span>Create New Quotation</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
