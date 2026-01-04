import React, { useState } from 'react';
import {
  KeyIcon,
  ChartBarIcon,
  GlobeAltIcon,
  ClockIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  ArrowPathIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import Modal from '../../components/UI/Modal';

interface MetricCardProps {
  title: string;
  value: string;
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
        <span className="text-sm text-white/70">vs last week</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-10">
      <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
    </div>
  </div>
);

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdBy: string;
  createdAt: string;
  lastUsed: string;
  requestCount: number;
  status: 'active' | 'inactive';
}

const APIManagementPage: React.FC = () => {
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [selectedKey, setSelectedKey] = useState<APIKey | null>(null);
  const [showViewKey, setShowViewKey] = useState(false);

  const apiKeys: APIKey[] = [
    { id: '1', name: 'Mobile App Key', key: 'ek_live_abc123...', createdBy: 'john@example.com', createdAt: '2024-01-15', lastUsed: '2 hours ago', requestCount: 5678, status: 'active' },
    { id: '2', name: 'Web Dashboard Key', key: 'ek_live_def456...', createdBy: 'jane@example.com', createdAt: '2024-02-20', lastUsed: '5 minutes ago', requestCount: 12345, status: 'active' },
    { id: '3', name: 'Test Environment Key', key: 'ek_test_ghi789...', createdBy: 'admin@errorlytic.com', createdAt: '2024-03-01', lastUsed: '1 day ago', requestCount: 234, status: 'active' },
    { id: '4', name: 'Legacy Integration', key: 'ek_live_jkl012...', createdBy: 'developer@example.com', createdAt: '2023-12-01', lastUsed: '1 month ago', requestCount: 456, status: 'inactive' },
  ];

  const metrics = [
    { title: 'Total API Keys', value: '12', change: '+2', isPositive: true, bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]', icon: <KeyIcon className="h-6 w-6 text-white" /> },
    { title: 'Requests Today', value: '15.6K', change: '+24%', isPositive: true, bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500', icon: <ChartBarIcon className="h-6 w-6 text-white" /> },
    { title: 'Active Endpoints', value: '8', change: '+1', isPositive: true, bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300', icon: <GlobeAltIcon className="h-6 w-6 text-orange-700" /> },
    { title: 'Avg Response Time', value: '234ms', change: '-12%', isPositive: true, bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300', icon: <ClockIcon className="h-6 w-6 text-blue-700" /> },
  ];

  const handleDeleteKey = (keyId: string) => {
    if (window.confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      console.log('Deleting key:', keyId);
      // API call would go here
    }
  };

  const handleRegenerateKey = (keyId: string) => {
    if (window.confirm('Regenerate this API key? The old key will stop working immediately.')) {
      console.log('Regenerating key:', keyId);
      // API call would go here
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">API Management</h2>
          <button
            onClick={() => setShowCreateKey(true)}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium"
          >
            <PlusIcon className="h-4 w-4 inline-block mr-2" />
            Create API Key
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">API Keys</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Name</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Key</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Created By</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Last Used</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Requests</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {apiKeys.map((apiKey) => (
                  <tr key={apiKey.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900">{apiKey.name}</td>
                    <td className="py-4 px-4">
                      <code className="px-2 py-1 bg-gray-100 rounded text-xs font-mono text-gray-800">
                        {apiKey.key}
                      </code>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{apiKey.createdBy}</td>
                    <td className="py-4 px-4 text-gray-600">{apiKey.lastUsed}</td>
                    <td className="py-4 px-4 font-medium text-gray-900">{apiKey.requestCount.toLocaleString()}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(apiKey.status)}`}>
                        {apiKey.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setSelectedKey(apiKey);
                            setShowViewKey(true);
                          }}
                          className="px-4 py-1.5 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4 inline-block" />
                        </button>
                        <button
                          onClick={() => handleRegenerateKey(apiKey.id)}
                          className="px-4 py-1.5 border-2 border-orange-500 text-orange-600 rounded-full hover:bg-orange-50 transition-colors font-medium text-sm"
                          title="Regenerate Key"
                        >
                          <ArrowPathIcon className="h-4 w-4 inline-block" />
                        </button>
                        <button
                          onClick={() => handleDeleteKey(apiKey.id)}
                          className="px-4 py-1.5 border-2 border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-colors font-medium text-sm"
                          title="Delete Key"
                        >
                          <TrashIcon className="h-4 w-4 inline-block" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Rate Limits & Endpoints */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-black mb-4">Rate Limits</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Requests per minute</span>
              <span className="font-semibold text-gray-900">100</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Requests per hour</span>
              <span className="font-semibold text-gray-900">5,000</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Requests per day</span>
              <span className="font-semibold text-gray-900">100,000</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-700">Max VCDS file size</span>
              <span className="font-semibold text-gray-900">10 MB</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-black mb-4">Popular Endpoints</h3>
          <div className="space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm text-[#EA6A47]">POST /api/v1/reports/upload</code>
              <p className="text-xs text-gray-600 mt-1">Upload VCDS report for analysis</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm text-[#EA6A47]">GET /api/v1/analysis/:id</code>
              <p className="text-xs text-gray-600 mt-1">Retrieve analysis results</p>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg">
              <code className="text-sm text-[#EA6A47]">GET /api/v1/vehicles</code>
              <p className="text-xs text-gray-600 mt-1">List all vehicles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Create API Key Modal */}
      <Modal isOpen={showCreateKey} onClose={() => setShowCreateKey(false)} title="Create API Key" size="md">
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
            <input
              type="text"
              placeholder="e.g., Mobile App Key"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="Describe what this API key will be used for..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-[#EA6A47] focus:ring-[#EA6A47]" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Read Access</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-[#EA6A47] focus:ring-[#EA6A47]" defaultChecked />
                <span className="ml-2 text-sm text-gray-700">Write Access</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded text-[#EA6A47] focus:ring-[#EA6A47]" />
                <span className="ml-2 text-sm text-gray-700">Admin Access</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowCreateKey(false)}
              className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors"
            >
              Create Key
            </button>
          </div>
        </form>
      </Modal>

      {/* View API Key Details Modal */}
      {selectedKey && (
        <Modal
          isOpen={showViewKey}
          onClose={() => {
            setShowViewKey(false);
            setSelectedKey(null);
          }}
          title="API Key Details"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{selectedKey.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">API Key</label>
              <div className="mt-1 p-3 bg-gray-100 rounded-lg">
                <code className="text-xs font-mono text-gray-900 break-all">{selectedKey.key}</code>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created By</label>
              <p className="mt-1 text-sm text-gray-900">{selectedKey.createdBy}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Created At</label>
              <p className="mt-1 text-sm text-gray-900">{selectedKey.createdAt}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Used</label>
              <p className="mt-1 text-sm text-gray-900">{selectedKey.lastUsed}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Total Requests</label>
              <p className="mt-1 text-sm text-gray-900">{selectedKey.requestCount.toLocaleString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedKey.status)}`}>
                  {selectedKey.status.toUpperCase()}
                </span>
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default APIManagementPage;
