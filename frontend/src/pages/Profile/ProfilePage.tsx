import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion } from 'framer-motion';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  CameraIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  KeyIcon,
  BellIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  country: string;
  role: string;
  joinDate: string;
  lastLogin: string;
  avatar?: string;
  bio?: string;
  company?: string;
  website?: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: user?.profile?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: '+254 700 000 000',
    country: 'Kenya',
    role: user?.role || 'individual',
    joinDate: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    bio: 'Automotive diagnostic professional with 5+ years of experience in vehicle repair and maintenance.',
    company: 'Tajilabs Automotive',
    website: 'https://tajilabs.com',
    notifications: {
      email: true,
      sms: false,
      push: true,
    },
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: UserIcon },
    { id: 'security', label: 'Security', icon: ShieldCheckIcon },
    { id: 'notifications', label: 'Notifications', icon: BellIcon },
    { id: 'preferences', label: 'Preferences', icon: GlobeAltIcon },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'garage_admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'insurer_admin':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'garage_user':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'insurer_user':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'individual':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleSave = () => {
    // Here you would typically save the profile data to the backend
    setIsEditing(false);
    // Show success message
  };

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
              <h1 className="text-4xl font-bold mb-2 font-sf-pro">Profile Settings</h1>
              <p className="text-xl text-white/90 font-sf-pro-text mb-4">
                Manage your account information, security settings, and preferences
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <ShieldCheckIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Secure & encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Profile verified</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <UserIcon className="h-12 w-12 text-white/80" />
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
      {activeTab === 'profile' && (
        <div className="space-y-6">
          {/* Profile Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8"
          >
            <div className="flex items-start space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-24 w-24 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-2xl flex items-center justify-center shadow-tajilabs">
                  <UserIcon className="h-12 w-12 text-white" />
                </div>
                <button className="absolute -bottom-2 -right-2 h-8 w-8 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <CameraIcon className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 font-sf-pro">{profileData.name}</h2>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border font-sf-pro-text ${getRoleColor(profileData.role)}`}>
                        {profileData.role.replace('_', ' ').toUpperCase()}
                      </span>
                      <div className="flex items-center space-x-1 text-sm text-gray-500 font-sf-pro-text">
                        <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 flex items-center space-x-2 font-sf-pro-text"
                  >
                    <PencilIcon className="h-5 w-5" />
                    <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
                  </motion.button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 font-sf-pro-text">
                  <div className="flex items-center space-x-2">
                    <EnvelopeIcon className="h-4 w-4" />
                    <span>{profileData.email}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>{profileData.phone}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profileData.country}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="h-4 w-4" />
                    <span>Joined {formatDate(profileData.joinDate)}</span>
                  </div>
                </div>

                {profileData.bio && (
                  <div className="mt-4">
                    <p className="text-gray-700 font-sf-pro-text">{profileData.bio}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Profile Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-sf-pro">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Full Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Phone Number</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Country</label>
                <select
                  value={profileData.country}
                  onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
                  disabled={!isEditing}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Ethiopia">Ethiopia</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Bio</label>
                <textarea
                  value={profileData.bio || ''}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  disabled={!isEditing}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text disabled:bg-gray-50 disabled:cursor-not-allowed"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 font-sf-pro-text"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 font-sf-pro-text"
                >
                  Save Changes
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}

      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-sf-pro">Security Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-900 font-sf-pro-text">Password</h4>
                    <p className="text-sm text-green-700 font-sf-pro-text">Last changed 30 days ago</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors font-sf-pro-text"
                >
                  Change Password
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-semibold text-blue-900 font-sf-pro-text">Two-Factor Authentication</h4>
                    <p className="text-sm text-blue-700 font-sf-pro-text">Add an extra layer of security</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors font-sf-pro-text"
                >
                  Enable 2FA
                </motion.button>
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-center space-x-3">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                  <div>
                    <h4 className="font-semibold text-yellow-900 font-sf-pro-text">Login Sessions</h4>
                    <p className="text-sm text-yellow-700 font-sf-pro-text">Manage active sessions</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-700 transition-colors font-sf-pro-text"
                >
                  View Sessions
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 font-sf-pro">Notification Preferences</h3>
          <div className="space-y-6">
            {Object.entries(profileData.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <h4 className="font-semibold text-gray-900 font-sf-pro-text capitalize">{key} Notifications</h4>
                  <p className="text-sm text-gray-600 font-sf-pro-text">
                    {key === 'email' && 'Receive notifications via email'}
                    {key === 'sms' && 'Receive notifications via SMS'}
                    {key === 'push' && 'Receive push notifications'}
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setProfileData({
                      ...profileData,
                      notifications: { ...profileData.notifications, [key]: e.target.checked }
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-tajilabs-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-tajilabs-primary"></div>
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'preferences' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 font-sf-pro">Application Preferences</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Language</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text">
                  <option value="en">English</option>
                  <option value="sw">Swahili</option>
                  <option value="fr">French</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Currency</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text">
                  <option value="USD">USD ($)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="UGX">UGX (USh)</option>
                  <option value="TZS">TZS (TSh)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">Time Zone</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text">
                  <option value="Africa/Nairobi">East Africa Time (EAT)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time (ET)</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ProfilePage;