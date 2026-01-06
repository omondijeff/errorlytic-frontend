import React, { useState } from 'react';
import {
  UsersIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ArrowTrendingUpIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';
import {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation
} from '../../services/api';
import AddUserModal from '../../components/SuperAdmin/AddUserModal';
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
        <span className="text-sm text-white/70">vs last month</span>
      </div>
    </div>
    <div className="absolute top-0 right-0 opacity-10">
      <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
    </div>
  </div>
);

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organization?: string;
  plan: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  isActive: boolean;
}

const UserManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddUser, setShowAddUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewUser, setShowViewUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    refetch: refetchUsers
  } = useGetUsersQuery({
    page: 1,
    limit: 100,
    role: selectedRole !== 'all' ? selectedRole : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
    search: searchTerm || undefined,
  });

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersData?.data || [];

  const stats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    garages: users.filter(u => u.role.includes('garage')).length,
    insurers: users.filter(u => u.role.includes('insurer')).length,
  };

  const metrics = [
    {
      title: 'Total Users',
      value: stats.total.toString(),
      change: '+12%',
      isPositive: true,
      bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
      icon: <UsersIcon className="h-6 w-6 text-white" />,
    },
    {
      title: 'Active Users',
      value: stats.active.toString(),
      change: '+18%',
      isPositive: true,
      bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
      icon: <CheckCircleIcon className="h-6 w-6 text-white" />,
    },
    {
      title: 'Garage Users',
      value: stats.garages.toString(),
      change: '+15%',
      isPositive: true,
      bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
      icon: <BuildingOfficeIcon className="h-6 w-6 text-orange-700" />,
    },
    {
      title: 'Insurance Users',
      value: stats.insurers.toString(),
      change: '+8%',
      isPositive: true,
      bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
      icon: <ShieldCheckIcon className="h-6 w-6 text-blue-700" />,
    },
  ];

  const handleCreateUser = async (userData: any) => {
    try {
      await createUser(userData).unwrap();
      setShowAddUser(false);
      refetchUsers();
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await updateUser({ id: user.id, status: newStatus }).unwrap();
      refetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditUser(true);
  };

  const handleUpdateUser = async (userData: { role: string; organization?: string }) => {
    if (!editingUser) return;
    try {
      await updateUser({ 
        id: editingUser.id, 
        role: userData.role,
        organization: userData.organization 
      }).unwrap();
      setShowEditUser(false);
      setEditingUser(null);
      refetchUsers();
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId).unwrap();
        refetchUsers();
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'superadmin') return 'bg-orange-100 text-orange-800';
    if (role.includes('admin')) return 'bg-blue-100 text-blue-800';
    if (role.includes('user')) return 'bg-green-100 text-green-800';
    return 'bg-gray-100 text-gray-800';
  };

const getStatusBadgeColor = (status: string) => {
  if (status === 'active') return 'bg-green-100 text-green-800';
  if (status === 'inactive') return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSubmit: (data: { role: string; organization?: string }) => void;
}

const EditUserModal: React.FC<EditUserModalProps> = ({ isOpen, onClose, user, onSubmit }) => {
  const [selectedRole, setSelectedRole] = useState(user.role);
  const [organization, setOrganization] = useState(user.organization || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updateData: { role: string; organization?: string } = { role: selectedRole };
      if (selectedRole !== 'individual' && selectedRole !== 'superadmin') {
        updateData.organization = organization;
      }
      await onSubmit(updateData);
    } catch (error) {
      console.error('Failed to update user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User
          </label>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
          >
            <option value="individual">Individual</option>
            <option value="garage_user">Garage User</option>
            <option value="garage_admin">Garage Admin</option>
            <option value="insurer_user">Insurer User</option>
            <option value="insurer_admin">Insurer Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>

        {(selectedRole === 'garage_user' || selectedRole === 'garage_admin' || 
          selectedRole === 'insurer_user' || selectedRole === 'insurer_admin') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization *
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Enter organization name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            />
          </div>
        )}

        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Updating...' : 'Update User'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

  return (
    <div className="p-8 bg-gray-50">
      {/* Overview Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">User Management</h2>
          <button
            onClick={() => setShowAddUser(true)}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium"
          >
            <PlusIcon className="h-4 w-4 inline-block mr-2" />
            Add User
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Users Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="superadmin">Super Admin</option>
              <option value="garage_admin">Garage Admin</option>
              <option value="garage_user">Garage User</option>
              <option value="insurer_admin">Insurer Admin</option>
              <option value="insurer_user">Insurer User</option>
              <option value="individual">Individual</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">User</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Role</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Organization</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Status</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Last Login</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersLoading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
                      </div>
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full border-2 border-[#EA6A47] flex items-center justify-center">
                            <span className="text-[#EA6A47] text-sm font-medium">{user.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{user.organization || '-'}</td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(user.status)} hover:opacity-75 transition-opacity`}
                        >
                          {user.status.toUpperCase()}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{user.lastLogin}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setSelectedUser(user);
                              setShowViewUser(true);
                            }}
                            className="px-4 py-1.5 border-2 border-blue-500 text-blue-600 rounded-full hover:bg-blue-50 transition-colors font-medium text-sm"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="px-4 py-1.5 border-2 border-[#EA6A47] text-[#EA6A47] rounded-full hover:bg-orange-50 transition-colors font-medium text-sm"
                          >
                            <PencilIcon className="h-4 w-4 inline-block mr-1" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
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

      {/* Add User Modal */}
      <AddUserModal
        isOpen={showAddUser}
        onClose={() => setShowAddUser(false)}
        onSubmit={handleCreateUser}
        isLoading={isCreating}
      />

      {/* View User Modal */}
      {selectedUser && (
        <Modal
          isOpen={showViewUser}
          onClose={() => {
            setShowViewUser(false);
            setSelectedUser(null);
          }}
          title="User Details"
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Name</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Role</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(selectedUser.role)}`}>
                  {selectedUser.role.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
            {selectedUser.organization && (
              <div>
                <label className="text-sm font-medium text-gray-700">Organization</label>
                <p className="mt-1 text-sm text-gray-900">{selectedUser.organization}</p>
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-gray-700">Status</label>
              <p className="mt-1">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(selectedUser.status)}`}>
                  {selectedUser.status.toUpperCase()}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Plan</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.plan}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Last Login</label>
              <p className="mt-1 text-sm text-gray-900">{selectedUser.lastLogin}</p>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          isOpen={showEditUser}
          onClose={() => {
            setShowEditUser(false);
            setEditingUser(null);
          }}
          user={editingUser}
          onSubmit={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserManagement;
