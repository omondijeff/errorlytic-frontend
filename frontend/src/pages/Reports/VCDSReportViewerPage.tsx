import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeftIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';

interface ReportData {
  uploadId: string;
  filename: string;
  content: string;
  uploadedAt: string;
  fileType: string;
  size: number;
  vehicleInfo?: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
}

const VCDSReportViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchReportContent();
    }
  }, [id]);

  const fetchReportContent = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/reports/${id}/content`);
      setReportData(response.data.data);
    } catch (error: any) {
      console.error('Failed to fetch report content:', error);
      setError(error.response?.data?.detail || 'Failed to load report content');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!reportData) return;

    try {
      const response = await api.get(`/reports/${id}/download`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', reportData.filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Failed to download report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center">
          <DocumentTextIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The report you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate('/app/analysis')}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] transition-colors"
          >
            Back to Reports
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">VCDS Report Viewer</h1>
            <p className="text-sm text-gray-600 mt-1">
              {reportData.filename} • {new Date(reportData.uploadedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <button
          onClick={handleDownload}
          className="flex items-center space-x-2 px-4 py-2 border-2 border-[#EA6A47] text-[#EA6A47] rounded-lg hover:bg-red-50 transition-colors"
        >
          <span className="font-medium">Download</span>
          <ArrowDownTrayIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Vehicle Info Card */}
      {reportData.vehicleInfo && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-gray-200 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-500">Make</p>
              <p className="font-medium text-gray-900">{reportData.vehicleInfo.make}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Model</p>
              <p className="font-medium text-gray-900">{reportData.vehicleInfo.model}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Year</p>
              <p className="font-medium text-gray-900">{reportData.vehicleInfo.year}</p>
            </div>
            {reportData.vehicleInfo.vin && (
              <div>
                <p className="text-sm text-gray-500">VIN</p>
                <p className="font-medium text-gray-900">{reportData.vehicleInfo.vin}</p>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Report Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl border border-gray-200 overflow-hidden"
      >
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Report Content</h2>
          <p className="text-sm text-gray-600 mt-1">
            File type: {reportData.fileType.toUpperCase()} • Size: {(reportData.size / 1024).toFixed(2)} KB
          </p>
        </div>
        <div className="p-6">
          <pre className="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto font-mono text-sm whitespace-pre-wrap">
            {reportData.content}
          </pre>
        </div>
      </motion.div>
    </div>
  );
};

export default VCDSReportViewerPage;
