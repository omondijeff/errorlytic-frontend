import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/apiClient';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  ChartBarIcon,
  TruckIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
} from '@heroicons/react/24/outline';

interface OverallMetrics {
  totalVehicles: number;
  totalAnalyses: number;
  criticalIssues: number;
  averageHealthScore: number;
  vehiclesNeedingAttention: number;
  healthyVehicles: number;
}

interface RecentDiagnostic {
  id: string;
  vehiclePlate: string;
  vehicleMake: string;
  vehicleModel: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  issueCount: number;
  date: string;
  healthScore: number;
}

interface CommonIssue {
  code: string;
  description: string;
  occurrences: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
}

const DiagnosticSummaryOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<OverallMetrics>({
    totalVehicles: 0,
    totalAnalyses: 0,
    criticalIssues: 0,
    averageHealthScore: 0,
    vehiclesNeedingAttention: 0,
    healthyVehicles: 0,
  });
  const [recentDiagnostics, setRecentDiagnostics] = useState<RecentDiagnostic[]>([]);
  const [commonIssues, setCommonIssues] = useState<CommonIssue[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch all analyses
      const analysisResponse = await api.get('/analysis');

      if (analysisResponse.data && analysisResponse.data.data) {
        const analyses = analysisResponse.data.data;

        // Calculate overall metrics
        const uniqueVehicles = new Set(analyses.map((a: any) => a.vehicleId?._id).filter(Boolean));
        const criticalCount = analyses.filter((a: any) =>
          a.summary?.severity === 'critical' || a.summary?.criticalErrors > 0
        ).length;

        // Calculate health scores
        const healthScores = analyses.map((a: any) => calculateHealthScore(a));
        const avgHealth = healthScores.reduce((sum: number, score: number) => sum + score, 0) / healthScores.length || 0;
        const needsAttention = healthScores.filter((score: number) => score < 70).length;
        const healthy = healthScores.filter((score: number) => score >= 80).length;

        setMetrics({
          totalVehicles: uniqueVehicles.size,
          totalAnalyses: analyses.length,
          criticalIssues: criticalCount,
          averageHealthScore: Math.round(avgHealth),
          vehiclesNeedingAttention: needsAttention,
          healthyVehicles: healthy,
        });

        // Get recent diagnostics (last 5)
        const recent = analyses
          .slice(0, 5)
          .map((a: any) => ({
            id: a._id,
            vehiclePlate: a.vehicleId?.plate || 'N/A',
            vehicleMake: a.vehicleId?.make || 'Unknown',
            vehicleModel: a.vehicleId?.model || '',
            severity: a.summary?.severity || 'low',
            issueCount: a.summary?.totalErrors || a.dtcs?.length || 0,
            date: a.createdAt,
            healthScore: calculateHealthScore(a),
          }));
        setRecentDiagnostics(recent);

        // Calculate common issues
        const issueMap = new Map<string, { description: string; count: number; severity: string }>();
        analyses.forEach((a: any) => {
          if (a.dtcs && Array.isArray(a.dtcs)) {
            a.dtcs.forEach((dtc: any) => {
              const key = dtc.code;
              if (issueMap.has(key)) {
                const existing = issueMap.get(key)!;
                issueMap.set(key, { ...existing, count: existing.count + 1 });
              } else {
                issueMap.set(key, {
                  description: dtc.description || 'Unknown issue',
                  count: 1,
                  severity: determineSeverity(dtc),
                });
              }
            });
          }
        });

        // Convert to array and sort by occurrences
        const issuesArray = Array.from(issueMap.entries())
          .map(([code, data]) => ({
            code,
            description: data.description,
            occurrences: data.count,
            severity: data.severity as 'critical' | 'high' | 'medium' | 'low',
          }))
          .sort((a, b) => b.occurrences - a.occurrences)
          .slice(0, 5);

        setCommonIssues(issuesArray);
      }
    } catch (error) {
      console.error('Failed to fetch diagnostic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateHealthScore = (analysis: any): number => {
    const totalErrors = analysis.summary?.totalErrors || analysis.dtcs?.length || 0;
    const criticalErrors = analysis.summary?.criticalErrors || 0;

    if (totalErrors === 0) return 100;

    const baseScore = 100;
    const errorPenalty = Math.min(totalErrors * 2, 50);
    const criticalPenalty = Math.min(criticalErrors * 10, 30);

    return Math.max(0, baseScore - errorPenalty - criticalPenalty);
  };

  const determineSeverity = (dtc: any): string => {
    const code = dtc.code?.toLowerCase() || '';
    if (code.includes('critical') || dtc.status === 'confirmed') return 'critical';
    if (code.includes('high')) return 'high';
    if (code.includes('medium')) return 'medium';
    return 'low';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 space-y-6">
      {/* Overall Health Metrics */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fleet Health Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Average Health Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Average Health Score</span>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.averageHealthScore}%
            </div>
            <div className="flex items-center text-sm">
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 font-medium">Healthy Fleet</span>
            </div>
          </motion.div>

          {/* Total Vehicles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Total Vehicles Monitored</span>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <TruckIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.totalVehicles}
            </div>
            <div className="text-sm text-gray-500">
              {metrics.totalAnalyses} total analyses
            </div>
          </motion.div>

          {/* Critical Issues */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Critical Issues</span>
              <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="h-6 w-6 text-[#EA6A47]" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.criticalIssues}
            </div>
            <div className="text-sm text-gray-500">
              Requiring immediate attention
            </div>
          </motion.div>

          {/* Vehicles Needing Attention */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Needs Attention</span>
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShieldExclamationIcon className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.vehiclesNeedingAttention}
            </div>
            <div className="text-sm text-gray-500">
              Health score below 70%
            </div>
          </motion.div>

          {/* Healthy Vehicles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-600 text-sm">Healthy Vehicles</span>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {metrics.healthyVehicles}
            </div>
            <div className="text-sm text-gray-500">
              Health score above 80%
            </div>
          </motion.div>

          {/* Time Period */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-br from-[#EA6A47] to-[#d85a37] rounded-xl p-6 text-white"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-white text-sm opacity-90">Reporting Period</span>
              <div className="h-10 w-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                <ClockIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-2">
              Last 30 Days
            </div>
            <div className="text-sm opacity-90">
              All time statistics
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Critical Diagnostics */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Diagnostics</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {recentDiagnostics.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircleIcon className="h-16 w-16 text-gray-400 mb-4" />
                <p className="text-gray-600">No recent diagnostics</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recentDiagnostics.map((diagnostic, index) => (
                  <motion.div
                    key={diagnostic.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/app/analysis/${diagnostic.id}`)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-[#EA6A47] bg-opacity-10 border-2 border-[#EA6A47] rounded-full flex items-center justify-center">
                          <TruckIcon className="h-5 w-5 text-[#EA6A47]" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{diagnostic.vehiclePlate}</p>
                          <p className="text-sm text-gray-500">
                            {diagnostic.vehicleMake} {diagnostic.vehicleModel}
                          </p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSeverityColor(diagnostic.severity)}`}>
                        {diagnostic.severity.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm ml-13">
                      <span className="text-gray-600">{diagnostic.issueCount} issues found</span>
                      <span className="text-gray-500">{formatDate(diagnostic.date)}</span>
                    </div>
                    <div className="mt-2 ml-13">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${diagnostic.healthScore >= 80 ? 'bg-green-500' :
                              diagnostic.healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                            style={{ width: `${diagnostic.healthScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{diagnostic.healthScore}%</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Most Common Issues */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Most Common Issues</h2>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {commonIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <CheckCircleIcon className="h-16 w-16 text-green-400 mb-4" />
                <p className="text-gray-600">No common issues detected</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {commonIssues.map((issue, index) => (
                  <motion.div
                    key={issue.code}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-mono font-semibold text-gray-900">{issue.code}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                            {issue.severity}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{issue.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="text-2xl font-bold text-[#EA6A47]">{issue.occurrences}</div>
                        <div className="text-xs text-gray-500">occurrences</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSummaryOverviewPage;
