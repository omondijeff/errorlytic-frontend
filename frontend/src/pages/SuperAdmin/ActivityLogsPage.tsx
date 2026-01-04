import React, { useState } from 'react';
import {
  ClockIcon,
  UserIcon,
  DocumentTextIcon,
  BuildingOfficeIcon,
  ArrowTrendingUpIcon,
  Cog6ToothIcon,
  TrashIcon,
  PencilIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useGetAuditLogsQuery } from '../../services/api';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive: boolean;
  bgColor: string;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, isPositive, bgColor, icon }) => (
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
        <span className={`text-sm font-medium ${isPositive ? 'text-green-300' : 'text-red-300'}`}>
          {change}
        </span>
        <span className="text-sm text-white/70">total events</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-10">
      <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
    </div>
  </div>
);

interface AuditLog {
  id: string;
  action: string;
  actor: {
    id: string;
    name: string;
    email: string;
  };
  target: {
    type: string;
    id: string;
    name?: string;
    email?: string;
  };
  meta: any;
  ipAddress: string;
  createdAt: string;
}

const ActivityLogsPage: React.FC = () => {
  const [filterAction, setFilterAction] = useState('all');
  const [page, setPage] = useState(1);

  const { data: logsData, isLoading } = useGetAuditLogsQuery({
    page,
    limit: 20,
    action: filterAction !== 'all' ? filterAction : undefined,
  });

  const logs: AuditLog[] = logsData?.data || [];
  const total = logsData?.total || 0;
  const totalPages = logsData?.pages || 1;

  // Calculate metrics from logs
  const userEvents = logs.filter(l => l.action.includes('user')).length;
  const orgEvents = logs.filter(l => l.action.includes('organization')).length;
  const settingsEvents = logs.filter(l => l.action.includes('settings')).length;

  const metrics = [
    { title: 'Total Events', value: total, change: `${total} logged`, isPositive: true, bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]', icon: <ClockIcon className="h-6 w-6 text-white" /> },
    { title: 'User Events', value: userEvents, change: 'in current page', isPositive: true, bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500', icon: <UserIcon className="h-6 w-6 text-white" /> },
    { title: 'Org Events', value: orgEvents, change: 'in current page', isPositive: true, bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300', icon: <BuildingOfficeIcon className="h-6 w-6 text-orange-700" /> },
    { title: 'Settings Events', value: settingsEvents, change: 'in current page', isPositive: true, bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300', icon: <Cog6ToothIcon className="h-6 w-6 text-blue-700" /> },
  ];

  const getActionIcon = (action: string) => {
    if (action.includes('created')) return <UserIcon className="h-4 w-4" />;
    if (action.includes('updated')) return <PencilIcon className="h-4 w-4" />;
    if (action.includes('deleted')) return <TrashIcon className="h-4 w-4" />;
    if (action.includes('login')) return <ArrowRightOnRectangleIcon className="h-4 w-4" />;
    if (action.includes('settings')) return <Cog6ToothIcon className="h-4 w-4" />;
    return <DocumentTextIcon className="h-4 w-4" />;
  };

  const getActionBadgeColor = (action: string) => {
    if (action.includes('created')) return 'bg-green-100 text-green-800';
    if (action.includes('updated')) return 'bg-blue-100 text-blue-800';
    if (action.includes('deleted')) return 'bg-red-100 text-red-800';
    if (action.includes('login')) return 'bg-purple-100 text-purple-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatAction = (action: string) => {
    return action
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500">Track all platform activities and events</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Activity Timeline</h3>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value);
                setPage(1);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            >
              <option value="all">All Activities</option>
              <option value="user_created">User Created</option>
              <option value="user_updated">User Updated</option>
              <option value="user_deleted">User Deleted</option>
              <option value="organization_created">Org Created</option>
              <option value="organization_updated">Org Updated</option>
              <option value="organization_deleted">Org Deleted</option>
              <option value="settings_updated">Settings Updated</option>
            </select>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No activity logs found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Time</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Action</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Performed By</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Target</th>
                      <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-900">{formatTimeAgo(log.createdAt)}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(log.createdAt).toLocaleString()}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                              {getActionIcon(log.action)}
                              <span className="ml-1">{formatAction(log.action)}</span>
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{log.actor.name}</div>
                          <div className="text-sm text-gray-500">{log.actor.email}</div>
                        </td>
                        <td className="py-4 px-4">
                          {log.target ? (
                            <div>
                              <div className="text-sm text-gray-900 capitalize">{log.target.type}</div>
                              <div className="text-xs text-gray-500">
                                {log.target.name || log.target.email || log.target.id}
                              </div>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          {log.ipAddress ? (
                            <div className="text-xs text-gray-500">
                              IP: {log.ipAddress}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-500">
                    Page {page} of {totalPages} ({total} total events)
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;
