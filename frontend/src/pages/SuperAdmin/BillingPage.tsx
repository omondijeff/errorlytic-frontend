import React, { useState } from 'react';
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { useGetRevenueQuery } from '../../services/api';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  subtitle?: string;
  bgColor: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, subtitle, bgColor, icon }) => (
  <div className={`${bgColor} rounded-3xl p-6 relative overflow-hidden`}>
    <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
        </div>
        <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
          {icon}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {change !== undefined ? (
          <>
            {change >= 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-300" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-300" />
            )}
            <span className={`text-sm font-medium ${change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
              {change >= 0 ? '+' : ''}{change}%
            </span>
            <span className="text-sm text-white/70">vs last period</span>
          </>
        ) : (
          <span className="text-sm text-white/70">{subtitle}</span>
        )}
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-10">
      <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
    </div>
  </div>
);

const BillingPage: React.FC = () => {
  const [period, setPeriod] = useState('30d');

  const { data: revenueData, isLoading } = useGetRevenueQuery({ period });

  const revenue = revenueData?.data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPlanBadge = (plan: string) => {
    if (plan === 'enterprise') return 'bg-purple-100 text-purple-800';
    if (plan === 'pro') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getStatusBadge = (status: string) => {
    return status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
  };

  // Calculate ARR from MRR
  const mrr = revenue?.mrr || 0;
  const arr = mrr * 12;

  // Calculate total subscriptions
  const totalSubscriptions = revenue?.subscriptionsByPlan?.reduce(
    (sum: number, plan: { count: number }) => sum + plan.count,
    0
  ) || 0;

  const metrics = [
    {
      title: 'Total Revenue',
      value: formatCurrency(revenue?.totalRevenue || 0),
      subtitle: 'All time revenue',
      bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
      icon: <CurrencyDollarIcon className="h-6 w-6 text-white" />,
    },
    {
      title: 'Monthly Recurring Revenue',
      value: formatCurrency(mrr),
      subtitle: 'Estimated MRR',
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
      icon: <ChartBarIcon className="h-6 w-6 text-white" />,
    },
    {
      title: 'Active Subscriptions',
      value: totalSubscriptions.toString(),
      subtitle: 'Paying users',
      bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
      icon: <UserGroupIcon className="h-6 w-6 text-orange-700" />,
    },
    {
      title: 'Annual Run Rate',
      value: formatCurrency(arr),
      subtitle: 'Projected ARR',
      bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
      icon: <ChartBarIcon className="h-6 w-6 text-blue-700" />,
    },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">Monitor revenue and subscription metrics</p>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent bg-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscriptions by Plan */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscriptions by Plan</h3>
            {revenue?.subscriptionsByPlan?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No subscription data</div>
            ) : (
              <div className="space-y-4">
                {revenue?.subscriptionsByPlan?.map((plan: { plan: string; count: number }) => {
                  const percentage = totalSubscriptions > 0
                    ? Math.round((plan.count / totalSubscriptions) * 100)
                    : 0;
                  const planPrices: Record<string, number> = { starter: 0, pro: 29, enterprise: 99 };
                  const monthlyRevenue = plan.count * (planPrices[plan.plan] || 0);

                  return (
                    <div key={plan.plan} className="p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPlanBadge(plan.plan)}`}>
                            {plan.plan.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-500">{plan.count} users</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {formatCurrency(monthlyRevenue)}/mo
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            plan.plan === 'enterprise' ? 'bg-purple-500' :
                            plan.plan === 'pro' ? 'bg-blue-500' :
                            'bg-gray-400'
                          }`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-xs text-gray-500">{percentage}% of users</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Transactions</h3>
            {revenue?.recentPayments?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">No recent transactions</div>
            ) : (
              <div className="space-y-4">
                {revenue?.recentPayments?.map((payment: {
                  id: string;
                  amount: number;
                  status: string;
                  user: { name: string; email: string };
                  createdAt: string
                }) => (
                  <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className="h-10 w-10 rounded-full bg-[#EA6A47] flex items-center justify-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{payment.user?.name || 'Unknown'}</p>
                        <p className="text-sm text-gray-500">{payment.user?.email || '-'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(payment.amount)}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(payment.status)}`}>
                        {payment.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Revenue Chart */}
      {!isLoading && revenue?.paymentsByDay?.length > 0 && (
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Revenue Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-1 overflow-x-auto pb-8">
            {revenue.paymentsByDay.slice(-30).map((day: { _id: string; amount: number; count: number }) => {
              const maxAmount = Math.max(...revenue.paymentsByDay.map((d: { amount: number }) => d.amount));
              const height = maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0;
              return (
                <div key={day._id} className="flex-1 min-w-[20px] flex flex-col items-center group">
                  <div className="relative w-full">
                    <div
                      className="w-full bg-gradient-to-t from-green-500 to-green-300 rounded-t-lg transition-all duration-300 hover:from-green-600 hover:to-green-400 cursor-pointer"
                      style={{ height: `${Math.max(height, 8)}%`, minHeight: '8px' }}
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatCurrency(day.amount)} ({day.count} txn)
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                    {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Stats */}
      {!isLoading && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Avg Transaction Value</h4>
            <p className="text-3xl font-bold text-gray-900">
              {revenue?.recentPayments?.length > 0
                ? formatCurrency(
                    revenue.recentPayments.reduce((sum: number, p: { amount: number }) => sum + p.amount, 0) /
                    revenue.recentPayments.length
                  )
                : '$0'
              }
            </p>
            <p className="text-sm text-gray-500 mt-1">Based on recent transactions</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Transactions This Period</h4>
            <p className="text-3xl font-bold text-gray-900">
              {revenue?.paymentsByDay?.reduce((sum: number, d: { count: number }) => sum + d.count, 0) || 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">In selected time range</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h4 className="text-sm font-medium text-gray-500 mb-2">Period Revenue</h4>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(
                revenue?.paymentsByDay?.reduce((sum: number, d: { amount: number }) => sum + d.amount, 0) || 0
              )}
            </p>
            <p className="text-sm text-gray-500 mt-1">Total in selected period</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingPage;
