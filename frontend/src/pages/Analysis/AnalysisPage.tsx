import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion } from 'framer-motion';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  StarIcon,
  CpuChipIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';

interface AnalysisItem {
  id: string;
  fileName: string;
  vehicleInfo: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  uploadedAt: string;
  progress?: number;
  errorCodes?: string[];
  aiSummary?: string;
}

const AnalysisPage: React.FC = () => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analyses, setAnalyses] = useState<AnalysisItem[]>([
    {
      id: '1',
      fileName: 'VW_Golf_2018_DTC_Report.pdf',
      vehicleInfo: '2018 Volkswagen Golf 2.0L TDI',
      status: 'completed',
      uploadedAt: '2024-01-15T10:30:00Z',
      errorCodes: ['P0300', 'P0301', 'P0302'],
      aiSummary: 'Multiple cylinder misfires detected. Likely causes include faulty spark plugs, ignition coils, or fuel injectors.',
    },
    {
      id: '2',
      fileName: 'BMW_X3_2020_Scan.pdf',
      vehicleInfo: '2020 BMW X3 xDrive30i',
      status: 'processing',
      uploadedAt: '2024-01-15T11:15:00Z',
      progress: 65,
    },
    {
      id: '3',
      fileName: 'Toyota_Camry_2019_DTC.pdf',
      vehicleInfo: '2019 Toyota Camry LE',
      status: 'pending',
      uploadedAt: '2024-01-15T12:00:00Z',
    },
  ]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5" />;
      case 'pending':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'failed':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
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
              <h1 className="text-4xl font-bold mb-2 font-sf-pro">AI-Powered Analysis</h1>
              <p className="text-xl text-white/90 font-sf-pro-text mb-4">
                Upload diagnostic files and get instant, intelligent error code analysis
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <StarIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Powered by OpenAI GPT-4</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CpuChipIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Advanced ML algorithms</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ChartBarIcon className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-sf-pro">Upload Diagnostic File</h2>
        
        <div
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
            dragActive
              ? 'border-tajilabs-primary bg-tajilabs-primary/5'
              : 'border-gray-300 hover:border-tajilabs-primary hover:bg-gray-50/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            accept=".pdf,.txt,.csv,.xlsx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          
          <div className="space-y-4">
            <div className="h-16 w-16 bg-gradient-to-br from-tajilabs-primary/10 to-tajilabs-secondary/10 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-engine-start">
              <DocumentArrowUpIcon className="h-8 w-8 text-tajilabs-primary" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 font-sf-pro mb-2">
                {dragActive ? 'Drop your file here' : 'Drag & drop your file here'}
              </h3>
              <p className="text-gray-600 font-sf-pro-text mb-4">
                or click to browse files
              </p>
              <p className="text-sm text-gray-500 font-sf-pro-text">
                Supports PDF, TXT, CSV, XLSX files up to 10MB
              </p>
            </div>
          </div>
        </div>

        {selectedFile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl"
          >
            <div className="flex items-center space-x-3">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
              <div className="flex-1">
                <p className="font-medium text-green-900 font-sf-pro-text">{selectedFile.name}</p>
                <p className="text-sm text-green-700 font-sf-pro-text">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors font-sf-pro-text">
                Process Now
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Analysis History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 font-sf-pro">Analysis History</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Completed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Pending</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-tajilabs transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                    <DocumentTextIcon className="h-6 w-6 text-tajilabs-primary" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 font-sf-pro truncate">
                        {analysis.fileName}
                      </h3>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full border font-sf-pro-text ${getStatusColor(analysis.status)}`}>
                        <span className="flex items-center space-x-1">
                          {getStatusIcon(analysis.status)}
                          <span className="capitalize">{analysis.status}</span>
                        </span>
                      </span>
                    </div>
                    
                    <p className="text-gray-600 font-sf-pro-text mb-2">{analysis.vehicleInfo}</p>
                    <p className="text-sm text-gray-500 font-sf-pro-text mb-3">
                      Uploaded {new Date(analysis.uploadedAt).toLocaleDateString()}
                    </p>

                    {analysis.progress && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700 font-sf-pro-text">Processing</span>
                          <span className="text-sm font-medium text-gray-700 font-sf-pro-text">{analysis.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${analysis.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {analysis.errorCodes && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 font-sf-pro-text mb-2">Error Codes:</p>
                        <div className="flex flex-wrap gap-2">
                          {analysis.errorCodes.map((code) => (
                            <span
                              key={code}
                              className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-lg font-sf-pro-text"
                            >
                              {code}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {analysis.aiSummary && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 font-sf-pro-text mb-2">AI Analysis:</p>
                        <p className="text-sm text-gray-600 font-sf-pro-text bg-gray-50 p-3 rounded-lg">
                          {analysis.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <EyeIcon className="h-5 w-5" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowDownTrayIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AnalysisPage;