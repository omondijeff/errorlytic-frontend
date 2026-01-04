import React, { useState } from 'react';
import {
  ChartBarIcon,
  UsersIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
} from '@heroicons/react/24/outline';
import { useGetAnalyticsQuery } from '../../services/api';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
  bgColor: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon, bgColor }) => {
  const isPositive = change >= 0;
  return (
    <div className={`${bgColor} rounded-3xl p-6 relative overflow-hidden`}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-white/90 mb-1">{title}</p>
            <p className="text-4xl font-bold text-white">{value}</p>
          </div>
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            {icon}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isPositive ? (
            <ArrowTrendingUpIcon className="h-4 w-4 text-green-300" />
          ) : (
            <ArrowTrendingDownIcon className="h-4 w-4 text-red-300" />
          )}
          <span className={`text-sm font-medium ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
            {isPositive ? '+' : ''}{change}%
          </span>
          <span className="text-sm text-white/70">vs last period</span>
        </div>
      </div>
      <div className="absolute top-0 right-0 opacity-10">
        <ChartBarIcon className="h-32 w-32 text-white" />
      </div>
    </div>
  );
};

const SystemAnalyticsPage: React.FC = () => {
  const [period, setPeriod] = useState('30d');

  const { data: analyticsData, isLoading } = useGetAnalyticsQuery({ period });

  const analytics = analyticsData?.data;

  const metrics = analytics ? [
    {
      title: 'Total Users',
      value: analytics.overview.totalUsers,
      change: analytics.overview.userGrowth || 0,
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
    },
    {
      title: 'New Users',
      value: analytics.overview.newUsers,
      change: analytics.overview.userGrowth || 0,
      icon: <UsersIcon className="h-6 w-6 text-white" />,
      bgColor: 'bg-gradient-to-br from-blue-400 to-blue-600',
    },
    {
      title: 'Organizations',
      value: analytics.overview.totalOrganizations,
      change: 0,
      icon: <BuildingOfficeIcon className="h-6 w-6 text-white" />,
      bgColor: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      title: 'Total Reports',
      value: analytics.overview.totalAnalyses,
      change: analytics.overview.analysisGrowth || 0,
      icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
      bgColor: 'bg-gradient-to-br from-green-400 to-green-600',
    },
  ] : [];

  const roleColors: Record<string, string> = {
    individual: 'bg-blue-500',
    garage_user: 'bg-green-500',
    garage_admin: 'bg-green-700',
    insurer_user: 'bg-purple-500',
    insurer_admin: 'bg-purple-700',
    superadmin: 'bg-red-500',
  };

  const roleLabels: Record<string, string> = {
    individual: 'Individual',
    garage_user: 'Garage User',
    garage_admin: 'Garage Admin',
    insurer_user: 'Insurer User',
    insurer_admin: 'Insurer Admin',
    superadmin: 'Super Admin',
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-gray-500">Monitor platform performance and user engagement</p>
        </div>
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

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
        </div>
      ) : analytics ? (
        <>
          {/* Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <MetricCard key={index} {...metric} />
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Users by Role */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Users by Role</h3>
              {analytics.usersByRole.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No user data available</div>
              ) : (
                <div className="space-y-4">
                  {analytics.usersByRole.map((item: { role: string; count: number }) => {
                    const total = analytics.overview.totalUsers;
                    const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0;
                    return (
                      <div key={item.role}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            {roleLabels[item.role] || item.role}
                          </span>
                          <span className="text-sm text-gray-500">
                            {item.count} ({percentage}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${roleColors[item.role] || 'bg-gray-500'}`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Organizations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Organizations by Reports</h3>
              {analytics.topOrganizations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No organizations yet
                </div>
              ) : (
                <div className="space-y-4">
                  {analytics.topOrganizations.map((org: { _id: string; name: string; type: string; analysisCount: number }, index: number) => (
                    <div
                      key={org._id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-white ${
                          index === 0 ? 'bg-yellow-500' :
                          index === 1 ? 'bg-gray-400' :
                          index === 2 ? 'bg-orange-400' :
                          'bg-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{org.name}</p>
                          <p className="text-sm text-gray-500 capitalize">{org.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#EA6A47]">{org.analysisCount}</p>
                        <p className="text-xs text-gray-500">reports</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Reports Activity Chart */}
          <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Reports Activity</h3>
            {analytics.analysesByDay.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No report activity in this period
              </div>
            ) : (
              <div className="h-64 flex items-end justify-between space-x-1 overflow-x-auto pb-8">
                {analytics.analysesByDay.slice(-30).map((day: { _id: string; count: number }) => {
                  const maxCount = Math.max(...analytics.analysesByDay.map((d: { count: number }) => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 100 : 0;
                  return (
                    <div key={day._id} className="flex-1 min-w-[20px] flex flex-col items-center group">
                      <div className="relative w-full">
                        <div
                          className="w-full bg-gradient-to-t from-[#EA6A47] to-[#f59e73] rounded-t-lg transition-all duration-300 hover:from-[#d85a37] hover:to-[#EA6A47] cursor-pointer"
                          style={{ height: `${Math.max(height, 8)}%`, minHeight: '8px' }}
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                          {day.count} reports
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 transform -rotate-45 origin-top-left whitespace-nowrap">
                        {new Date(day._id).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">New Reports (Period)</h4>
              <p className="text-3xl font-bold text-gray-900">{analytics.overview.newAnalyses}</p>
              <p className="text-sm text-gray-500 mt-1">
                <span className={analytics.overview.analysisGrowth >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {analytics.overview.analysisGrowth >= 0 ? '+' : ''}{analytics.overview.analysisGrowth}%
                </span>
                {' '}from previous period
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Avg Reports/Day</h4>
              <p className="text-3xl font-bold text-gray-900">
                {analytics.analysesByDay.length > 0
                  ? Math.round(analytics.analysesByDay.reduce((sum: number, d: { count: number }) => sum + d.count, 0) / analytics.analysesByDay.length)
                  : 0
                }
              </p>
              <p className="text-sm text-gray-500 mt-1">Based on selected period</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Active Period</h4>
              <p className="text-3xl font-bold text-gray-900 capitalize">
                {period === '7d' ? '7 Days' : period === '30d' ? '30 Days' : period === '90d' ? '90 Days' : '1 Year'}
              </p>
              <p className="text-sm text-gray-500 mt-1">Current analysis window</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Failed to load analytics data
        </div>
      )}
    </div>
  );
};

export default SystemAnalyticsPage;
