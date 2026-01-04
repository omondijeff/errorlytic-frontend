import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  MagnifyingGlassIcon,
  ChartBarIcon,
  TruckIcon,
  UsersIcon as UsersIconSolid,
  ChevronRightIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';

interface MetricsData {
  totalUsers: number;
  totalCars: number;
  activeUsers: number;
  changePercentage: number;
}

interface User {
  id: string;
  name: string;
  registrationNo: string;
  carType: string;
  email: string;
  status: 'Active' | 'Inactive';
}

const UsersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('Newest');
  const [users, setUsers] = useState<User[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    totalUsers: 0,
    totalCars: 0,
    activeUsers: 0,
    changePercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage, sortBy, searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch metrics and users in parallel
      const [metricsResponse, usersResponse] = await Promise.all([
        api.get('/vehicles/metrics'),
        api.get('/vehicles', {
          params: {
            page: currentPage,
            limit: usersPerPage,
            search: searchQuery || undefined,
          },
        }),
      ]);

      // Set metrics data
      if (metricsResponse.data && metricsResponse.data.data) {
        setMetrics(metricsResponse.data.data);
      }

      // Set users data
      if (usersResponse.data && usersResponse.data.data) {
        setUsers(usersResponse.data.data);
        setTotalPages(usersResponse.data.pages || 1);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="p-8 bg-gray-50 space-y-6">
      {/* Overview Metrics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Overview</h2>
          <button className="flex items-center space-x-2 px-4 py-2 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <span className="font-medium text-gray-700">Add user</span>
            <PlusIcon className="h-5 w-5 text-gray-700" />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 text-sm font-medium">Total users</span>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <ChartBarIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {loading ? '...' : metrics.totalUsers.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium text-sm">+{metrics.changePercentage}%</span>
              <span className="text-gray-500 text-sm">Compared to Last Month</span>
            </div>
            <svg className="absolute bottom-4 right-4 opacity-20" width="80" height="50" viewBox="0 0 80 50" fill="none">
              <path d="M0 50L20 30L40 35L60 20L80 25" stroke="currentColor" strokeWidth="3" className="text-green-500"/>
            </svg>
          </motion.div>

          {/* Total Cars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#EA6A47] to-[#d85a37] rounded-xl border border-[#EA6A47] p-6 text-white relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-4 relative z-10">
              <span className="text-white text-sm font-medium">Total Cars</span>
              <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <TruckIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-4xl font-bold mb-2 relative z-10">
              {loading ? '...' : metrics.totalCars.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 relative z-10">
              <span className="text-white font-medium text-sm">+{metrics.changePercentage}%</span>
              <span className="text-white/80 text-sm">Compared to Last Month</span>
            </div>
            <svg className="absolute bottom-4 right-4 opacity-20" width="80" height="50" viewBox="0 0 80 50" fill="none">
              <path d="M0 50L20 30L40 35L60 20L80 25" stroke="currentColor" strokeWidth="3" className="text-white"/>
            </svg>
          </motion.div>

          {/* Active Users */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl border border-blue-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 text-sm font-medium">Active Users</span>
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <UsersIconSolid className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-4xl font-bold text-gray-900 mb-2">
              {loading ? '...' : metrics.activeUsers.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium text-sm">+{metrics.changePercentage}%</span>
              <span className="text-gray-500 text-sm">Compared to Last Month</span>
            </div>
            <svg className="absolute bottom-4 right-4 opacity-20" width="80" height="50" viewBox="0 0 80 50" fill="none">
              <path d="M0 50L20 30L40 35L60 20L80 25" stroke="currentColor" strokeWidth="3" className="text-green-500"/>
            </svg>
          </motion.div>
        </div>
      </div>

      {/* All Users Table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">All users</h2>
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent text-sm w-64"
              />
            </div>

            {/* Sort by */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
              >
                <option value="Newest">Newest</option>
                <option value="Oldest">Oldest</option>
                <option value="Name">Name</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <UsersIconSolid className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">No users found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-3 text-sm font-medium text-gray-700">Users Name</div>
                  <div className="col-span-2 text-sm font-medium text-gray-700">Registration No.</div>
                  <div className="col-span-3 text-sm font-medium text-gray-700">Car type</div>
                  <div className="col-span-3 text-sm font-medium text-gray-700">Email</div>
                  <div className="col-span-1 text-sm font-medium text-gray-700">Status</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* User Name */}
                    <div className="col-span-3">
                      <span className="font-medium text-gray-900">{user.name}</span>
                    </div>

                    {/* Registration No */}
                    <div className="col-span-2">
                      <span className="text-gray-900">{user.registrationNo}</span>
                    </div>

                    {/* Car Type */}
                    <div className="col-span-3">
                      <span className="text-gray-900">{user.carType}</span>
                    </div>

                    {/* Email */}
                    <div className="col-span-3">
                      <span className="text-gray-900">{user.email}</span>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Active'
                            ? 'bg-green-100 text-green-700 border border-green-300'
                            : 'bg-red-100 text-red-700 border border-red-300'
                        }`}
                      >
                        {user.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              <div className="border-t border-gray-200 px-6 py-4 bg-white">
                <div className="flex items-center justify-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                  >
                    Previous
                  </button>

                  {/* Page Numbers */}
                  {getPageNumbers().map((page, index) => (
                    <button
                      key={index}
                      onClick={() => typeof page === 'number' && setCurrentPage(page)}
                      disabled={page === '...'}
                      className={`min-w-[36px] h-9 px-3 rounded-lg font-medium transition-colors text-sm ${
                        page === currentPage
                          ? 'bg-[#EA6A47] text-white'
                          : page === '...'
                          ? 'cursor-default text-gray-400'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRightIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
