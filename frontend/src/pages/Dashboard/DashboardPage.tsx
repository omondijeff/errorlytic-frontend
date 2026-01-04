import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  ChartBarIcon,
  HeartIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ShieldCheckIcon,
  WrenchScrewdriverIcon,
  DocumentTextIcon,
  TruckIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';
import type { RootState } from '../../store';

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
    {/* Decorative elements */}
    <div className="absolute top-0 right-0 opacity-10">
      {isPositive ? (
        <ArrowTrendingUpIcon className="h-32 w-32 text-white" />
      ) : (
        <ArrowTrendingDownIcon className="h-32 w-32 text-white" />
      )}
    </div>
  </div>
);

interface ReportRow {
  id: string;
  uploadId: string;
  regNo: string;
  faultCount: number;
  dateUploaded: string;
  healthScore: number;
}

interface DashboardMetrics {
  totalReports: number;
  avgHealthScore: number;
  totalUsers: number;
  totalCost: number;
  changePercentage: number;
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  const [dashboardMetrics, setDashboardMetrics] = useState<DashboardMetrics>({
    totalReports: 0,
    avgHealthScore: 0,
    totalUsers: 0,
    totalCost: 0,
    changePercentage: 4.6,
  });
  const [recentReports, setRecentReports] = useState<ReportRow[]>([]);

  // Helper to check if user is in a specific role category
  const isIndividual = user?.role === 'individual';
  const isGarage = user?.role === 'garage_user' || user?.role === 'garage_admin';
  const isInsurance = user?.role === 'insurer_user' || user?.role === 'insurer_admin';
  const isSuperAdmin = user?.role === 'superadmin';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch analyses and vehicle metrics in parallel
      const [analysisResponse, vehicleMetricsResponse] = await Promise.all([
        api.get('/analysis', { params: { limit: 5 } }),
        api.get('/vehicles/metrics'),
      ]);

      // Process analysis data for reports
      if (analysisResponse.data && analysisResponse.data.data) {
        const analyses = analysisResponse.data.data;

        const transformedReports = analyses.slice(0, 5).map((analysis: any) => {
          const totalErrors = analysis.summary?.totalErrors || analysis.dtcs?.length || 0;
          const criticalErrors = analysis.summary?.criticalErrors || 0;
          const healthScore = calculateHealthScore(totalErrors, criticalErrors);

          return {
            id: analysis._id || analysis.id,
            uploadId: analysis.uploadId?._id || analysis.uploadId,
            regNo: analysis.vehicleId?.plate ||
                   analysis.vehicleId?.registrationNumber ||
                   analysis.vehicleId?.licensePlate ||
                   `${analysis.vehicleId?.make || ''} ${analysis.vehicleId?.model || ''}`.trim() ||
                   'N/A',
            faultCount: totalErrors,
            dateUploaded: analysis.createdAt,
            healthScore,
          };
        });

        setRecentReports(transformedReports);

        // Calculate average health score
        const avgScore = transformedReports.length > 0
          ? transformedReports.reduce((sum, r) => sum + r.healthScore, 0) / transformedReports.length
          : 0;

        // Calculate total estimated cost
        const totalCost = analyses.reduce((sum: number, a: any) => {
          return sum + (a.summary?.estimatedCost || 0);
        }, 0);

        setDashboardMetrics({
          totalReports: analyses.length,
          avgHealthScore: Math.round(avgScore),
          totalUsers: vehicleMetricsResponse.data?.data?.totalUsers || 0,
          totalCost,
          changePercentage: 4.6,
        });
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthScore = (totalErrors: number, criticalErrors: number): number => {
    if (totalErrors === 0) return 100;
    const baseScore = 100;
    const errorPenalty = Math.min(totalErrors * 2, 50);
    const criticalPenalty = Math.min(criticalErrors * 10, 30);
    return Math.max(0, baseScore - errorPenalty - criticalPenalty);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleViewVCDSReport = (uploadId: string) => {
    navigate(`/app/reports/${uploadId}`);
  };

  const handleViewErrolyticReport = (reportId: string) => {
    navigate(`/app/analysis/${reportId}`);
  };

  // Define role-specific metrics
  const getMetrics = () => {
    if (isSuperAdmin) {
      // Super Admin: Platform-wide metrics
      return [
        {
          title: 'Total Users',
          value: loading ? '...' : dashboardMetrics.totalUsers.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
          icon: <UsersIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Total Analyses',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
          icon: <DocumentTextIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Platform Health',
          value: loading ? '...' : `${dashboardMetrics.avgHealthScore}%`,
          change: dashboardMetrics.avgHealthScore >= 70 ? '+5.9%' : '-5.9%',
          isPositive: dashboardMetrics.avgHealthScore >= 70,
          bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
          icon: <ShieldCheckIcon className="h-6 w-6 text-orange-700" />,
        },
        {
          title: 'Total Platform Revenue',
          value: loading ? '...' : `KES ${dashboardMetrics.totalCost.toLocaleString()}`,
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
          icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-700" />,
        },
      ];
    } else if (isIndividual) {
      // Individual: Focus on personal vehicles and diagnostics
      return [
        {
          title: 'My Vehicles',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
          icon: <TruckIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Average Health Score',
          value: loading ? '...' : `${dashboardMetrics.avgHealthScore}%`,
          change: dashboardMetrics.avgHealthScore >= 70 ? '+5.9%' : '-5.9%',
          isPositive: dashboardMetrics.avgHealthScore >= 70,
          bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
          icon: <HeartIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Total Diagnostics',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
          icon: <DocumentTextIcon className="h-6 w-6 text-orange-700" />,
        },
        {
          title: 'Estimated Repair Costs',
          value: loading ? '...' : `KES ${dashboardMetrics.totalCost.toLocaleString()}`,
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
          icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-700" />,
        },
      ];
    } else if (isGarage) {
      // Garage: Focus on clients served and garage performance
      return [
        {
          title: 'Total Client Reports',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
          icon: <ChartBarIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Average Fleet Health',
          value: loading ? '...' : `${dashboardMetrics.avgHealthScore}%`,
          change: dashboardMetrics.avgHealthScore >= 70 ? '+5.9%' : '-5.9%',
          isPositive: dashboardMetrics.avgHealthScore >= 70,
          bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
          icon: <HeartIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Clients Served',
          value: loading ? '...' : dashboardMetrics.totalUsers.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
          icon: <UsersIcon className="h-6 w-6 text-orange-700" />,
        },
        {
          title: 'Total Repair Value',
          value: loading ? '...' : `KES ${dashboardMetrics.totalCost.toLocaleString()}`,
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
          icon: <WrenchScrewdriverIcon className="h-6 w-6 text-blue-700" />,
        },
      ];
    } else if (isInsurance) {
      // Insurance: Focus on claims, assessments, inspections
      return [
        {
          title: 'Total Claims/Assessments',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
          icon: <ShieldCheckIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Average Vehicle Condition',
          value: loading ? '...' : `${dashboardMetrics.avgHealthScore}%`,
          change: dashboardMetrics.avgHealthScore >= 70 ? '+5.9%' : '-5.9%',
          isPositive: dashboardMetrics.avgHealthScore >= 70,
          bgColor: 'bg-gradient-to-br from-gray-400 to-gray-500',
          icon: <HeartIcon className="h-6 w-6 text-white" />,
        },
        {
          title: 'Inspections Completed',
          value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-orange-200 to-orange-300',
          icon: <DocumentTextIcon className="h-6 w-6 text-orange-700" />,
        },
        {
          title: 'Total Claims Value',
          value: loading ? '...' : `KES ${dashboardMetrics.totalCost.toLocaleString()}`,
          change: `+${dashboardMetrics.changePercentage}%`,
          isPositive: true,
          bgColor: 'bg-gradient-to-br from-blue-200 to-blue-300',
          icon: <CurrencyDollarIcon className="h-6 w-6 text-blue-700" />,
        },
      ];
    }

    // Default fallback
    return [
      {
        title: 'Total Reports',
        value: loading ? '...' : dashboardMetrics.totalReports.toLocaleString(),
        change: `+${dashboardMetrics.changePercentage}%`,
        isPositive: true,
        bgColor: 'bg-gradient-to-br from-[#EA6A47] to-[#d85a37]',
        icon: <ChartBarIcon className="h-6 w-6 text-white" />,
      },
    ];
  };

  const metrics = getMetrics();

  // Get role-specific titles
  const getDashboardTitle = () => {
    if (isSuperAdmin) return 'Platform Overview';
    if (isIndividual) return 'My Dashboard';
    if (isGarage) return 'Garage Dashboard';
    if (isInsurance) return 'Claims & Assessments Dashboard';
    return 'Dashboard';
  };

  const getReportsTitle = () => {
    if (isSuperAdmin) return 'All Platform Activity';
    if (isIndividual) return 'My Recent Diagnostics';
    if (isGarage) return 'Recent Client Reports';
    if (isInsurance) return 'Recent Claims & Inspections';
    return 'Reports Summary';
  };

  return (
    <div className="p-8 bg-gray-50">
      {/* Overview Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-6">{getDashboardTitle()}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <MetricCard key={index} {...metric} />
          ))}
        </div>
      </div>

      {/* Reports Summary Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-black mb-6">{getReportsTitle()}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Reg No</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Fault Count</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Date uploaded</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Health score</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">VCDS Report</th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#EA6A47]">Errolytic REPORT</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
                      </div>
                    </td>
                  </tr>
                ) : recentReports.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-500">
                      No reports found. Upload a VCDS report to get started.
                    </td>
                  </tr>
                ) : (
                  recentReports.map((report, index) => (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full border-2 border-[#EA6A47] flex items-center justify-center">
                            <span className="text-[#EA6A47] text-sm font-medium">→</span>
                          </div>
                          <span className="font-medium text-gray-900">{report.regNo}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-900">{report.faultCount}</td>
                      <td className="py-4 px-4 text-gray-600">{formatDate(report.dateUploaded)}</td>
                      <td className="py-4 px-4">
                        <span className="font-medium text-gray-900">{report.healthScore}%</span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewVCDSReport(report.uploadId)}
                          className="px-6 py-2 border-2 border-green-500 text-green-600 rounded-full hover:bg-green-50 transition-colors font-medium text-sm"
                        >
                          View VCDS REPORT
                        </button>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleViewErrolyticReport(report.id)}
                          className="px-6 py-2 border-2 border-[#EA6A47] text-[#EA6A47] rounded-full hover:bg-red-50 transition-colors font-medium text-sm"
                        >
                          View Errolytic REPORT
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;