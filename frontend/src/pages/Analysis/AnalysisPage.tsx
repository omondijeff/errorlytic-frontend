import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/apiClient';
import {
  ChartBarIcon,
  DocumentTextIcon,
  TruckIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';

interface MetricsData {
  totalReportsAnalyzed: number;
  totalReportsUploaded: number;
  totalCars: number;
  changePercentage: number;
}

interface ReportItem {
  id: string;
  uploadId: string;
  regNo: string;
  faultCount: number;
  dateUploaded: string;
  healthScore: number;
  vehicleId?: string;
}

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [metrics, setMetrics] = useState<MetricsData>({
    totalReportsAnalyzed: 0,
    totalReportsUploaded: 0,
    totalCars: 0,
    changePercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const reportsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch analyses
      const analysisResponse = await api.get('/analysis');
      console.log('Analysis Response:', analysisResponse.data);

      if (analysisResponse.data && analysisResponse.data.data) {
        const analyses = analysisResponse.data.data;

        // Transform to report items
        const transformedReports = analyses.map((analysis: any) => ({
          id: analysis._id || analysis.id,
          uploadId: analysis.uploadId?._id || analysis.uploadId,
          regNo: analysis.vehicleId?.plate ||
                 analysis.vehicleId?.registrationNumber ||
                 analysis.vehicleId?.licensePlate ||
                 `${analysis.vehicleId?.make || ''} ${analysis.vehicleId?.model || ''}`.trim() ||
                 'N/A',
          faultCount: analysis.summary?.totalErrors || analysis.dtcs?.length || 0,
          dateUploaded: analysis.createdAt,
          healthScore: calculateHealthScore(analysis),
          vehicleId: analysis.vehicleId?._id || analysis.vehicleId,
        }));

        setReports(transformedReports);
        setTotalPages(Math.ceil(transformedReports.length / reportsPerPage));

        // Calculate metrics
        setMetrics({
          totalReportsAnalyzed: analyses.length,
          totalReportsUploaded: analyses.length,
          totalCars: new Set(analyses.map((a: any) => a.vehicleId?._id).filter(Boolean)).size,
          changePercentage: 4.6,
        });
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthScore = (analysis: any): number => {
    const totalErrors = analysis.summary?.totalErrors || analysis.dtcs?.length || 0;
    const criticalErrors = analysis.summary?.criticalErrors || 0;

    if (totalErrors === 0) return 100;

    // Calculate score based on error severity
    const baseScore = 100;
    const errorPenalty = Math.min(totalErrors * 2, 50);
    const criticalPenalty = Math.min(criticalErrors * 10, 30);

    return Math.max(0, baseScore - errorPenalty - criticalPenalty);
  };

  const handleViewVCDSReport = (uploadId: string) => {
    // Navigate to VCDS report viewer
    navigate(`/app/reports/${uploadId}`);
  };

  const handleViewErrolyticReport = (reportId: string) => {
    navigate(`/app/analysis/${reportId}`);
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

  const getPaginatedReports = () => {
    const startIndex = (currentPage - 1) * reportsPerPage;
    const endIndex = startIndex + reportsPerPage;
    return reports.slice(startIndex, endIndex);
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
    <div className="p-8 bg-gray-50">
      {/* Overview Metrics */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-black mb-6">Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Reports Analyzed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Total reports Analyzed</span>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : metrics.totalReportsAnalyzed.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">+{metrics.changePercentage}%</span>{' '}
              <span className="text-gray-500">Compared to Last Maintance</span>
            </div>
          </motion.div>

          {/* Total Reports Uploaded */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Total reports uploaded</span>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <DocumentTextIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : metrics.totalReportsUploaded.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">+{metrics.changePercentage}%</span>{' '}
              <span className="text-gray-500">Compared to Last Maintance</span>
            </div>
          </motion.div>

          {/* Total Cars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Total Cars</span>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <TruckIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {loading ? '...' : metrics.totalCars.toLocaleString()}
            </div>
            <div className="text-sm">
              <span className="text-green-600 font-medium">+{metrics.changePercentage}%</span>{' '}
              <span className="text-gray-500">Compared to Last Maintance</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* All Reports Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-black mb-6">All Reports</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <DocumentTextIcon className="h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">No reports found</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div className="bg-[#FEF3E2] border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4">
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">Reg No</div>
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">Fault Count</div>
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">Date uploaded</div>
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">Health score</div>
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">VCDS Report</div>
                  <div className="col-span-2 text-sm font-semibold text-[#EA6A47]">Errolytic VCN</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200">
                {getPaginatedReports().map((report, index) => (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-gray-50 transition-colors"
                  >
                    {/* Reg No */}
                    <div className="col-span-2 flex items-center space-x-3">
                      <div className="h-9 w-9 bg-[#EA6A47] bg-opacity-10 border-2 border-[#EA6A47] rounded-full flex items-center justify-center">
                        <svg className="h-4 w-4 text-[#EA6A47]" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium text-gray-900">{report.regNo}</span>
                    </div>

                    {/* Fault Count */}
                    <div className="col-span-2">
                      <span className="text-gray-900 font-medium">{report.faultCount}</span>
                    </div>

                    {/* Date Uploaded */}
                    <div className="col-span-2">
                      <span className="text-gray-900">{formatDate(report.dateUploaded)}</span>
                    </div>

                    {/* Health Score */}
                    <div className="col-span-2">
                      <span className="text-gray-900 font-medium">{report.healthScore}%</span>
                    </div>

                    {/* VCDS Report Button */}
                    <div className="col-span-2">
                      <button
                        onClick={() => handleViewVCDSReport(report.uploadId)}
                        className="px-4 py-2 border-2 border-green-500 text-green-600 rounded-full text-sm font-medium hover:bg-green-50 transition-colors whitespace-nowrap"
                      >
                        View VCDS REPORT
                      </button>
                    </div>

                    {/* Errolytic Report Button */}
                    <div className="col-span-2">
                      <button
                        onClick={() => handleViewErrolyticReport(report.id)}
                        className="px-4 py-2 border-2 border-[#EA6A47] text-[#EA6A47] rounded-full text-sm font-medium hover:bg-red-50 transition-colors whitespace-nowrap"
                      >
                        View Errolytic REPORT
                      </button>
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

export default AnalysisPage;
