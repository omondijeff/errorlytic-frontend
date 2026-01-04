import React, { useState } from 'react';
import {
  BuildingOfficeIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Modal from '../../components/UI/Modal';
import {
  useGetOrganizationsQuery,
  useCreateOrganizationMutation,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} from '../../services/api';

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
        <span className="text-sm text-white/70">vs last month</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-10">
      <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
    </div>
  </div>
);

interface Organization {
  id: string;
  name: string;
  type: 'garage' | 'insurer';
  email: string;
  phone: string;
  address: string;
  country: string;
  currency: string;
  plan: string;
  status: 'active' | 'inactive';
  userCount: number;
  reportsCount: number;
  createdAt: string;
}

const OrganizationsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [showViewOrg, setShowViewOrg] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    type: 'garage' as 'garage' | 'insurer',
    email: '',
    phone: '',
    address: '',
    country: 'Kenya',
    currency: 'KES',
    plan: 'pro',
  });

  // API hooks
  const {
    data: orgsData,
    isLoading,
    refetch,
  } = useGetOrganizationsQuery({
    page: 1,
    limit: 100,
    type: selectedType !== 'all' ? selectedType : undefined,
    search: searchTerm || undefined,
  });

  const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
  const [updateOrganization] = useUpdateOrganizationMutation();
  const [deleteOrganization] = useDeleteOrganizationMutation();

  const organizations: Organization[] = orgsData?.data || [];

  const stats = {
    total: organizations.length,
    garages: organizations.filter(o => o.type === 'garage').length,
    insurers: organizations.filter(o => o.type === 'insurer').length,
    active: organizations.filter(o => o.status === 'active').length,
  };

  const metrics = [
    { title: 'Total Organizations', value: stats.total.toString(), change: '+8%', isPositive: true, bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]', icon: <BuildingOfficeIcon className="h-6 w-6 text-white" /> },
    { title: 'Garages', value: stats.garages.toString(), change: '+12%', isPositive: true, bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500', icon: <WrenchScrewdriverIcon className="h-6 w-6 text-white" /> },
    { title: 'Insurance Companies', value: stats.insurers.toString(), change: '+3%', isPositive: true, bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300', icon: <ShieldCheckIcon className="h-6 w-6 text-orange-700" /> },
    { title: 'Active', value: stats.active.toString(), change: '+5%', isPositive: true, bgColor: 'bg-gradient-to-br from-green-200 to-green-300', icon: <BuildingOfficeIcon className="h-6 w-6 text-green-700" /> },
  ];

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createOrganization(formData).unwrap();
      setShowAddOrg(false);
      setFormData({
        name: '',
        type: 'garage',
        email: '',
        phone: '',
        address: '',
        country: 'Kenya',
        currency: 'KES',
        plan: 'pro',
      });
      refetch();
    } catch (error) {
      console.error('Failed to create organization:', error);
    }
  };

  const handleToggleStatus = async (org: Organization) => {
    try {
      await updateOrganization({
        id: org.id,
        isActive: org.status !== 'active',
      }).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to update organization:', error);
    }
  };

  const handleDeleteOrg = async (orgId: string) => {
    if (window.confirm('Are you sure you want to delete this organization?')) {
      try {
        await deleteOrganization(orgId).unwrap();
        refetch();
      } catch (error: any) {
        alert(error?.data?.message || 'Failed to delete organization');
      }
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500">Manage all registered garages and insurance companies</p>
          </div>
          <button
            onClick={() => setShowAddOrg(true)}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium flex items-center"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Organization
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="garage">Garages</option>
              <option value="insurer">Insurance Companies</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Organization</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Type</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Location</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Users</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Reports</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
                      </div>
                    </td>
                  </tr>
                ) : organizations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-500">
                      No organizations found. Add your first organization to get started.
                    </td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr key={org.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                            org.type === 'garage'
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-purple-100 text-purple-600'
                          }`}>
                            {org.type === 'garage' ? (
                              <WrenchScrewdriverIcon className="h-5 w-5" />
                            ) : (
                              <ShieldCheckIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{org.name}</div>
                            <div className="text-sm text-gray-500">{org.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          org.type === 'garage'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}>
                          {org.type === 'garage' ? 'Garage' : 'Insurance'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{org.country}</td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{org.userCount}</span>
                        <span className="text-gray-500 text-sm ml-1">users</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{org.reportsCount}</span>
                        <span className="text-gray-500 text-sm ml-1">reports</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(org)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            org.status === 'active'
                              ? 'bg-green-100 text-green-800 hover:bg-green-200'
                              : 'bg-red-100 text-red-800 hover:bg-red-200'
                          }`}
                        >
                          {org.status === 'active' ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedOrg(org);
                              setShowViewOrg(true);
                            }}
                            className="px-4 py-1.5 border-2 border-[#EA6A47] text-[#EA6A47] rounded-full hover:bg-orange-50 transition-colors font-medium text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDeleteOrg(org.id)}
                            className="px-4 py-1.5 border-2 border-red-500 text-red-600 rounded-full hover:bg-red-50 transition-colors font-medium text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Organization Modal */}
      <Modal isOpen={showAddOrg} onClose={() => setShowAddOrg(false)} title="Add Organization" size="lg">
        <form onSubmit={handleCreateOrg} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Organization Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'garage' | 'insurer' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              required
            >
              <option value="garage">Auto Repair Garage</option>
              <option value="insurer">Insurance Company</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <select
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
                required
              >
                <option value="Kenya">Kenya</option>
                <option value="Uganda">Uganda</option>
                <option value="Tanzania">Tanzania</option>
                <option value="Rwanda">Rwanda</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <select
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              >
                <option value="KES">KES - Kenyan Shilling</option>
                <option value="UGX">UGX - Ugandan Shilling</option>
                <option value="TZS">TZS - Tanzanian Shilling</option>
                <option value="USD">USD - US Dollar</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
              <select
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              >
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47]"
              rows={2}
            />
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => setShowAddOrg(false)}
              className="px-6 py-2 border border-gray-300 rounded-full hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="px-6 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] disabled:opacity-50"
            >
              {isCreating ? 'Creating...' : 'Create Organization'}
            </button>
          </div>
        </form>
      </Modal>

      {/* View Organization Modal */}
      {selectedOrg && (
        <Modal
          isOpen={showViewOrg}
          onClose={() => {
            setShowViewOrg(false);
            setSelectedOrg(null);
          }}
          title="Organization Details"
          size="md"
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-4 pb-4 border-b">
              <div className={`h-16 w-16 rounded-full flex items-center justify-center ${
                selectedOrg.type === 'garage'
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-purple-100 text-purple-600'
              }`}>
                {selectedOrg.type === 'garage' ? (
                  <WrenchScrewdriverIcon className="h-8 w-8" />
                ) : (
                  <ShieldCheckIcon className="h-8 w-8" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{selectedOrg.name}</h3>
                <p className="text-sm text-gray-500">
                  {selectedOrg.type === 'garage' ? 'Auto Repair Garage' : 'Insurance Company'}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Email</label>
                <p className="text-gray-900">{selectedOrg.email || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Phone</label>
                <p className="text-gray-900">{selectedOrg.phone || '-'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Country</label>
                <p className="text-gray-900">{selectedOrg.country}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Currency</label>
                <p className="text-gray-900">{selectedOrg.currency}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Plan</label>
                <p className="text-gray-900 capitalize">{selectedOrg.plan}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedOrg.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {selectedOrg.status}
                  </span>
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#EA6A47]">{selectedOrg.userCount}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-[#EA6A47]">{selectedOrg.reportsCount}</p>
                <p className="text-sm text-gray-500">Reports Processed</p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default OrganizationsPage;
