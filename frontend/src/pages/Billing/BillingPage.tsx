import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion } from 'framer-motion';
import {
  CreditCardIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowDownTrayIcon,
  EyeIcon,
  PlusIcon,
  ChartBarIcon,
  ReceiptPercentIcon,
  BanknotesIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';

interface BillingPlan {
  id: string;
  name: string;
  tier: 'basic' | 'professional' | 'enterprise';
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
}

interface Invoice {
  id: string;
  subscriptionId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'paid' | 'failed';
  issueDate: string;
  dueDate: string;
  pdfUrl: string;
  description: string;
}

interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  plan: BillingPlan;
}

const BillingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'plans' | 'invoices' | 'subscription'>('overview');
  
  const billingPlans: BillingPlan[] = [
    {
      id: 'basic',
      name: 'Basic',
      tier: 'basic',
      price: 29,
      currency: 'USD',
      features: [
        'Up to 50 analyses per month',
        'Basic error code interpretation',
        'Email support',
        'Standard reporting',
        'Mobile app access',
      ],
    },
    {
      id: 'professional',
      name: 'Professional',
      tier: 'professional',
      price: 79,
      currency: 'USD',
      features: [
        'Up to 200 analyses per month',
        'Advanced AI analysis',
        'Priority support',
        'Custom reporting',
        'API access',
        'Team collaboration',
        'Advanced analytics',
      ],
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      tier: 'enterprise',
      price: 199,
      currency: 'USD',
      features: [
        'Unlimited analyses',
        'Premium AI analysis',
        '24/7 dedicated support',
        'Custom integrations',
        'White-label options',
        'Advanced security',
        'SLA guarantee',
        'Custom training',
      ],
    },
  ];

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      subscriptionId: 'SUB-001',
      amount: 79.00,
      currency: 'USD',
      status: 'paid',
      issueDate: '2024-01-01T00:00:00Z',
      dueDate: '2024-01-31T00:00:00Z',
      pdfUrl: '/invoices/INV-001.pdf',
      description: 'Professional Plan - January 2024',
    },
    {
      id: 'INV-002',
      subscriptionId: 'SUB-001',
      amount: 79.00,
      currency: 'USD',
      status: 'pending',
      issueDate: '2024-02-01T00:00:00Z',
      dueDate: '2024-02-29T00:00:00Z',
      pdfUrl: '/invoices/INV-002.pdf',
      description: 'Professional Plan - February 2024',
    },
    {
      id: 'INV-003',
      subscriptionId: 'SUB-001',
      amount: 79.00,
      currency: 'USD',
      status: 'paid',
      issueDate: '2023-12-01T00:00:00Z',
      dueDate: '2023-12-31T00:00:00Z',
      pdfUrl: '/invoices/INV-003.pdf',
      description: 'Professional Plan - December 2023',
    },
  ];

  const currentSubscription: Subscription = {
    id: 'SUB-001',
    userId: 'user-123',
    planId: 'professional',
    status: 'active',
    startDate: '2024-01-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    autoRenew: true,
    plan: billingPlans[1],
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
      case 'active':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'failed':
      case 'cancelled':
        return <XCircleIcon className="h-4 w-4" />;
      case 'inactive':
        return <ClockIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: ChartBarIcon },
    { id: 'plans', label: 'Plans', icon: CreditCardIcon },
    { id: 'invoices', label: 'Invoices', icon: DocumentTextIcon },
    { id: 'subscription', label: 'Subscription', icon: ReceiptPercentIcon },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-tajilabs-primary via-tajilabs-primary to-tajilabs-secondary rounded-3xl p-8 text-white shadow-tajilabs-lg relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 font-sf-pro">Billing & Subscription</h1>
              <p className="text-xl text-white/90 font-sf-pro-text mb-4">
                Manage your subscription, view invoices, and upgrade your plan
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Multi-currency billing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BanknotesIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Secure payments</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <CreditCardIcon className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-2"
      >
        <div className="flex space-x-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 font-sf-pro-text ${
                activeTab === tab.id
                  ? 'bg-tajilabs-primary text-white shadow-tajilabs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Current Subscription */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sf-pro">Current Subscription</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900 font-sf-pro">{currentSubscription.plan.name} Plan</h3>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full border font-sf-pro-text ${getStatusColor(currentSubscription.status)}`}>
                    <span className="flex items-center space-x-1">
                      {getStatusIcon(currentSubscription.status)}
                      <span className="capitalize">{currentSubscription.status}</span>
                    </span>
                  </span>
                </div>
                <div className="text-3xl font-bold text-tajilabs-primary font-sf-pro">
                  {formatCurrency(currentSubscription.plan.price, currentSubscription.plan.currency)}/month
                </div>
                <div className="space-y-2 text-sm text-gray-600 font-sf-pro-text">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Started: {formatDate(currentSubscription.startDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Renews: {formatDate(currentSubscription.endDate)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircleIcon className="h-4 w-4" />
                    <span>Auto-renewal: {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-gray-900 font-sf-pro">Plan Features</h4>
                <div className="space-y-2">
                  {currentSubscription.plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-600 font-sf-pro-text">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'This Month', value: formatCurrency(79.00, 'USD'), color: 'from-blue-500 to-blue-600' },
              { label: 'Total Paid', value: formatCurrency(237.00, 'USD'), color: 'from-green-500 to-green-600' },
              { label: 'Next Payment', value: formatCurrency(79.00, 'USD'), color: 'from-purple-500 to-purple-600' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 font-sf-pro-text">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 font-sf-pro">{stat.value}</p>
                  </div>
                  <div className={`h-12 w-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                    <CurrencyDollarIcon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'plans' && (
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl font-bold text-gray-900 font-sf-pro mb-4">Choose Your Plan</h2>
            <p className="text-lg text-gray-600 font-sf-pro-text">Select the perfect plan for your diagnostic needs</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {billingPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                className={`relative bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8 ${
                  plan.popular ? 'ring-2 ring-tajilabs-primary' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-4 py-2 rounded-full text-sm font-semibold font-sf-pro-text">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 font-sf-pro mb-2">{plan.name}</h3>
                  <div className="text-4xl font-bold text-tajilabs-primary font-sf-pro mb-2">
                    {formatCurrency(plan.price, plan.currency)}
                  </div>
                  <p className="text-gray-600 font-sf-pro-text">per month</p>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700 font-sf-pro-text">{feature}</span>
                    </div>
                  ))}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 font-sf-pro-text ${
                    plan.popular
                      ? 'bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white shadow-tajilabs hover:shadow-tajilabs-lg'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {currentSubscription.plan.id === plan.id ? 'Current Plan' : 'Choose Plan'}
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-sf-pro">Invoice History</h2>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 flex items-center space-x-2 font-sf-pro-text"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Download All</span>
            </motion.button>
          </div>

          <div className="space-y-4">
            {invoices.map((invoice, index) => (
              <motion.div
                key={invoice.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-tajilabs transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                      <DocumentTextIcon className="h-6 w-6 text-tajilabs-primary" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">{invoice.id}</h3>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full border font-sf-pro-text ${getStatusColor(invoice.status)}`}>
                          <span className="flex items-center space-x-1">
                            {getStatusIcon(invoice.status)}
                            <span className="capitalize">{invoice.status}</span>
                          </span>
                        </span>
                      </div>
                      <p className="text-gray-600 font-sf-pro-text mb-1">{invoice.description}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500 font-sf-pro-text">
                        <span>Issued: {formatDate(invoice.issueDate)}</span>
                        <span>Due: {formatDate(invoice.dueDate)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900 font-sf-pro">
                        {formatCurrency(invoice.amount, invoice.currency)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <EyeIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowDownTrayIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'subscription' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sf-pro">Subscription Management</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sf-pro mb-4">Current Plan Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-sf-pro-text">Plan:</span>
                      <span className="font-medium text-gray-900 font-sf-pro-text">{currentSubscription.plan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-sf-pro-text">Status:</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full font-sf-pro-text ${getStatusColor(currentSubscription.status)}`}>
                        {currentSubscription.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-sf-pro-text">Next Billing:</span>
                      <span className="font-medium text-gray-900 font-sf-pro-text">{formatDate(currentSubscription.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-sf-pro-text">Auto-renewal:</span>
                      <span className="font-medium text-gray-900 font-sf-pro-text">
                        {currentSubscription.autoRenew ? 'Enabled' : 'Disabled'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 font-sf-pro mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white py-3 px-6 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 font-sf-pro-text"
                    >
                      Upgrade Plan
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 font-sf-pro-text"
                    >
                      Update Payment Method
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-red-100 text-red-700 py-3 px-6 rounded-xl font-semibold hover:bg-red-200 transition-all duration-200 font-sf-pro-text"
                    >
                      Cancel Subscription
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BillingPage;