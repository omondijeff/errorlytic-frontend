import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ShieldExclamationIcon,
  ClipboardDocumentListIcon,
  DocumentTextIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import api from '../../services/apiClient';
import type { RootState } from '../../store';

interface DTC {
  code: string;
  description: string;
  status: string;
}

interface AnalysisSummary {
  overview: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  totalErrors: number;
  criticalErrors: number;
  estimatedCost: number;
}

interface VehicleDetails {
  _id?: string;
  id?: string;
  plate: string;
  make: string;
  model: string;
  year: number;
  ownerInfo?: {
    firstName?: string;
    lastName?: string;
    name?: string;
    phone?: string;
  };
}

interface AnalysisData {
  _id: string;
  dtcs: DTC[];
  summary: AnalysisSummary;
  causes: string[];
  recommendations: string[];
  aiInsights?: {
    assessment: string;
    model: string;
  };
  vehicleId: VehicleDetails;
  vehicleInfo?: {
    mileage?: number;
    mileageUnit?: string;
  };
}

const DiagnosticSummaryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [activeSection, setActiveSection] = useState<'dtcs' | 'ai' | 'recommendations' | 'garage-quotation'>('dtcs');
  const { user } = useSelector((state: RootState) => state.auth);
  const isGarageUser = user?.role === 'garage_user' || user?.role === 'garage_admin';
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [generatingImage, setGeneratingImage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAnalysisDetails();
    }
  }, [id]);

  const fetchAnalysisDetails = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/analysis/${id}`);
      const data = response.data.data;
      setAnalysisData(data);

      // Auto-generate vehicle image after loading analysis data
      if (data?.vehicleId) {
        generateVehicleImage(data.vehicleId);
      }
    } catch (error) {
      console.error('Failed to fetch analysis details:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateVehicleImage = async (vehicle: VehicleDetails) => {
    try {
      setGeneratingImage(true);
      const response = await api.post('/vehicles/generate-image', {
        vehicleId: vehicle._id || vehicle.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        color: 'silver', // Default color if not specified
      });

      if (response.data.success && response.data.data.imageUrl) {
        setVehicleImage(response.data.data.imageUrl);
      }
    } catch (error) {
      console.error('Failed to generate vehicle image:', error);
      // Silently fail - image generation is a nice-to-have feature
    } finally {
      setGeneratingImage(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
      case 'high':
        return <ShieldExclamationIcon className="h-5 w-5" />;
      case 'medium':
        return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'low':
        return <CheckCircleIcon className="h-5 w-5" />;
      default:
        return <ExclamationTriangleIcon className="h-5 w-5" />;
    }
  };

  const getOwnerName = (vehicle?: VehicleDetails) => {
    if (vehicle?.ownerInfo?.name) return vehicle.ownerInfo.name;
    if (vehicle?.ownerInfo?.firstName && vehicle?.ownerInfo?.lastName) {
      return `${vehicle.ownerInfo.firstName} ${vehicle.ownerInfo.lastName}`;
    }
    if (vehicle?.ownerInfo?.firstName) return vehicle.ownerInfo.firstName;
    if (vehicle?.ownerInfo?.lastName) return vehicle.ownerInfo.lastName;
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  if (!analysisData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Analysis not found</h2>
          <p className="text-gray-600 mb-4">The analysis you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/app/analysis')}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37]"
          >
            Back to Analysis
          </button>
        </div>
      </div>
    );
  }

  const { vehicleId, summary, dtcs, causes, recommendations, aiInsights, vehicleInfo } = analysisData;
  const vehicle = vehicleId;
  const ownerName = getOwnerName(vehicle);

  return (
    <div className="p-8 space-y-6 bg-gray-50 min-h-screen">
      {/* Header with Vehicle Image */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Vehicle Image Section */}
          <div className="flex-shrink-0">
            {generatingImage ? (
              <div className="w-64 h-48 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EA6A47] mb-2"></div>
                <p className="text-sm text-gray-600">Generating vehicle image...</p>
              </div>
            ) : vehicleImage ? (
              <img
                src={vehicleImage}
                alt={`${vehicle?.year} ${vehicle?.make} ${vehicle?.model}`}
                className="w-64 h-48 object-cover rounded-lg shadow-md"
              />
            ) : (
              <div className="w-64 h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400 text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Vehicle Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {vehicle?.year} {vehicle?.make} {vehicle?.model}
                </h1>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span className="font-medium">Reg No: {vehicle?.plate}</span>
                  {ownerName && <span>• Owner: {ownerName}</span>}
                  {vehicleInfo?.mileage && (
                    <span>• {vehicleInfo.mileage.toLocaleString()} {vehicleInfo.mileageUnit}</span>
                  )}
                </div>
              </div>
              <div className={`px-4 py-2 rounded-lg border ${getSeverityColor(summary.severity)} flex items-center space-x-2`}>
                {getSeverityIcon(summary.severity)}
                <span className="font-semibold text-sm uppercase">{summary.severity}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Total Error Codes</p>
          <p className="text-3xl font-bold text-gray-900">{summary.totalErrors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Critical Errors</p>
          <p className="text-3xl font-bold text-[#EA6A47]">{summary.criticalErrors}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Systems Affected</p>
          <p className="text-3xl font-bold text-gray-900">{causes.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow duration-200">
          <p className="text-sm text-gray-600 mb-2 font-medium">Estimated Cost</p>
          <p className="text-3xl font-bold text-gray-900">
            KES {summary.estimatedCost.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Affected Systems */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow duration-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Affected Systems</h3>
        <div className="flex flex-wrap gap-3">
          {causes.map((cause, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-red-50 text-red-700 text-sm font-medium rounded-lg border border-red-200 hover:bg-red-100 transition-colors duration-150"
            >
              {cause}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="border-b border-gray-200 px-6 bg-gray-50">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveSection('dtcs')}
              className={`py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeSection === 'dtcs'
                  ? 'border-[#EA6A47] text-[#EA6A47]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Error Codes ({dtcs.length})
            </button>
            <button
              onClick={() => setActiveSection('ai')}
              className={`py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeSection === 'ai'
                  ? 'border-[#EA6A47] text-[#EA6A47]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              AI Analysis
            </button>
            <button
              onClick={() => setActiveSection('recommendations')}
              className={`py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                activeSection === 'recommendations'
                  ? 'border-[#EA6A47] text-[#EA6A47]'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Recommendations ({recommendations.length})
            </button>
            {isGarageUser && (
              <button
                onClick={() => setActiveSection('garage-quotation')}
                className={`py-4 text-sm font-semibold border-b-2 transition-all duration-200 ${
                  activeSection === 'garage-quotation'
                    ? 'border-[#EA6A47] text-[#EA6A47]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4 inline-block mr-1" />
                Garage Quotation ({dtcs.length})
              </button>
            )}
          </div>
        </div>

        <div className="p-6">
          {/* Error Codes Section */}
          {activeSection === 'dtcs' && (
            <div className="space-y-4">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-16">#</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-32">Code</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Description</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700 w-28">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {dtcs.map((dtc, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 text-sm text-gray-600 font-medium">{index + 1}</td>
                        <td className="py-4 px-4">
                          <span className="font-mono text-sm font-bold text-[#EA6A47] bg-orange-50 px-2 py-1 rounded">{dtc.code}</span>
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-900">{dtc.description}</td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            dtc.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {dtc.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* AI Analysis Section */}
          {activeSection === 'ai' && aiInsights?.assessment && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-[#EA6A47]" />
                  <h3 className="text-lg font-bold text-gray-900">Complete Diagnostic Analysis</h3>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                  Powered by {aiInsights.model}
                </span>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-200 shadow-sm">
                <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">
                  {aiInsights.assessment}
                </pre>
              </div>
            </div>
          )}

          {/* Recommendations Section */}
          {activeSection === 'recommendations' && (
            <div className="space-y-4">
              {summary.severity === 'critical' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <ShieldExclamationIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-2">Critical Safety Warning</h4>
                      <ul className="space-y-1 text-sm text-red-800">
                        <li>• DO NOT DRIVE until critical systems are repaired</li>
                        <li>• Multiple safety-critical failures detected</li>
                        <li>• Professional assistance required immediately</li>
                        <li>• Vehicle may not respond properly in emergency situations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-[#EA6A47] hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-7 w-7 rounded-full bg-[#EA6A47] text-white flex items-center justify-center text-sm font-bold shadow-sm">
                        {index + 1}
                      </div>
                    </div>
                    <p className="text-sm text-gray-900 flex-1 leading-relaxed">{recommendation}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Next Steps</h4>
                <div className="space-y-2">
                  {[
                    'Get a professional diagnostic assessment',
                    'Prioritize critical errors first',
                    'Get quotes from certified mechanics',
                    'Schedule repairs based on priority'
                  ].map((step, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm text-gray-700">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Garage Quotation Section */}
          {activeSection === 'garage-quotation' && isGarageUser && (
            <GarageQuotationTab
              dtcs={dtcs}
              analysisId={id!}
              vehicle={vehicle}
            />
          )}
        </div>
      </div>
    </div>
  );
};

// Garage Quotation Tab Component
interface GarageQuotationTabProps {
  dtcs: DTC[];
  analysisId: string;
  vehicle: VehicleDetails;
}

interface QuotationLineItem {
  code: string;
  description: string;
  explanation: string;
  estimatedCost: number;
  customCost: number | null;
  loading: boolean;
}

const GarageQuotationTab: React.FC<GarageQuotationTabProps> = ({ dtcs, analysisId, vehicle }) => {
  const [lineItems, setLineItems] = useState<QuotationLineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [generatingQuotation, setGeneratingQuotation] = useState(false);
  const [currency, setCurrency] = useState<'KES' | 'USD'>('KES');

  useEffect(() => {
    loadLineItems();
  }, [dtcs]);

  const loadLineItems = async () => {
    setLoading(true);
    const items: QuotationLineItem[] = await Promise.all(
      dtcs.map(async (dtc) => {
        // Estimate cost based on severity (can be enhanced with AI later)
        const baseCost = dtc.status === 'active' ? 5000 : 3000;
        
        // Fetch AI explanation
        let explanation = '';
        try {
          const response = await api.post('/error-codes/ai-explanation', {
            errorCode: dtc.code,
            description: dtc.description,
            vehicleMake: vehicle.make,
            vehicleModel: vehicle.model,
          });
          explanation = response.data.data?.aiExplanation || `Error ${dtc.code}: ${dtc.description}`;
        } catch (error) {
          explanation = `Error ${dtc.code}: ${dtc.description}. Please consult a qualified technician for detailed explanation.`;
        }

        return {
          code: dtc.code,
          description: dtc.description,
          explanation,
          estimatedCost: baseCost,
          customCost: null,
          loading: false,
        };
      })
    );
    setLineItems(items);
    setLoading(false);
  };

  const updateLineItemCost = (index: number, cost: number) => {
    const updated = [...lineItems];
    updated[index].customCost = cost;
    setLineItems(updated);
  };

  const getLineItemCost = (item: QuotationLineItem) => {
    return item.customCost !== null ? item.customCost : item.estimatedCost;
  };

  const calculateTotal = () => {
    return lineItems.reduce((sum, item) => sum + getLineItemCost(item), 0);
  };

  const handleGenerateQuotation = async () => {
    setGeneratingQuotation(true);
    try {
      // Create quotation with line items
      const quotationData = {
        analysisId,
        currency,
        lineItems: lineItems.map((item) => ({
          code: item.code,
          description: item.description,
          explanation: item.explanation,
          cost: getLineItemCost(item),
        })),
        totals: {
          subtotal: calculateTotal(),
          tax: calculateTotal() * 0.16, // 16% VAT
          grand: calculateTotal() * 1.16,
        },
      };

      // For now, we'll use the existing quotation endpoint
      // This might need backend modification to accept line items directly
      const response = await api.post(`/quotations/generate/${analysisId}`, {
        currency,
        laborRate: 2500,
        markupPct: 15,
        taxPct: 16,
        notes: `Quotation generated from ${lineItems.length} error codes`,
      });

      if (response.data.success || response.data.type === 'quotation_generated') {
        alert('Quotation generated successfully!');
        // Optionally navigate to quotation page
      }
    } catch (error: any) {
      console.error('Failed to generate quotation:', error);
      alert(error.response?.data?.detail || 'Failed to generate quotation');
    } finally {
      setGeneratingQuotation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EA6A47]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Garage Quotation Builder</h3>
          <p className="text-sm text-gray-600 mt-1">
            Review AI explanations and customize costs for each error code
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'KES' | 'USD')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
          >
            <option value="KES">KES</option>
            <option value="USD">USD</option>
          </select>
          <button
            onClick={handleGenerateQuotation}
            disabled={generatingQuotation || lineItems.length === 0}
            className="px-6 py-2 bg-[#EA6A47] text-white rounded-lg hover:bg-[#d85a37] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <DocumentTextIcon className="h-5 w-5" />
            <span>{generatingQuotation ? 'Generating...' : 'Generate Quotation'}</span>
          </button>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-4">
        {lineItems.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-6">
              {/* Left: Error Code and Description */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <span className="font-mono text-lg font-bold text-[#EA6A47] bg-orange-50 px-3 py-1 rounded">
                    {item.code}
                  </span>
                  <span className="text-sm text-gray-500">Line Item #{index + 1}</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{item.description}</h4>
                
                {/* AI Explanation */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <div className="flex items-start space-x-2">
                    <ClipboardDocumentListIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-blue-900 mb-1">AI Explanation for Mechanic:</p>
                      <p className="text-sm text-blue-800 whitespace-pre-wrap">{item.explanation}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Cost Input */}
              <div className="flex-shrink-0 w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repair Cost ({currency})
                </label>
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">
                    AI Recommended: {currency} {item.estimatedCost.toLocaleString()}
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={item.customCost !== null ? item.customCost : item.estimatedCost}
                    onChange={(e) => updateLineItemCost(index, parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent text-lg font-semibold"
                    placeholder="Enter cost"
                  />
                  {item.customCost !== null && item.customCost !== item.estimatedCost && (
                    <button
                      onClick={() => updateLineItemCost(index, item.estimatedCost)}
                      className="text-xs text-[#EA6A47] hover:underline"
                    >
                      Reset to AI recommendation
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Line Items</p>
            <p className="text-2xl font-bold text-gray-900">{lineItems.length}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-2xl font-bold text-[#EA6A47]">
              {currency} {calculateTotal().toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Tax (16%)</p>
            <p className="text-2xl font-bold text-gray-900">
              {currency} {(calculateTotal() * 0.16).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Grand Total</p>
            <p className="text-3xl font-bold text-[#EA6A47]">
              {currency} {(calculateTotal() * 1.16).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSummaryPage;
