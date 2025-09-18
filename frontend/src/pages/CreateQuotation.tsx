import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  AlertTriangle, 
  Calculator, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft,
  User,
  Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VCDSError {
  code: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  estimatedCost: number;
  category: string;
}

interface QuotationData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vcdsReport: File | null;
  extractedErrors: VCDSError[];
  partsCost: number;
  laborCost: number;
  notes: string;
}

const CreateQuotation: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [quotationData, setQuotationData] = useState<QuotationData>({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    vcdsReport: null,
    extractedErrors: [],
    partsCost: 0,
    laborCost: 0,
    notes: "",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'VCDS Report', icon: FileText },
    { id: 3, title: 'Error Analysis', icon: AlertTriangle },
    { id: 4, title: 'Quotation', icon: Calculator }
  ];

  const handleInputChange = (field: keyof QuotationData, value: any) => {
    setQuotationData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      console.log('Starting VCDS file upload:', file.name, file.size);
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('vcdsReport', file);

      // Get auth token
      const token = localStorage.getItem('token');
      console.log('Auth token available:', !!token);

      // Call the VCDS parsing API
      const response = await fetch('/api/upload/parse-vcds', {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}` // Add auth token back
        }
      });

      console.log('API Response status:', response.status);
      console.log('API Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error response:', errorText);
        throw new Error(`Failed to parse VCDS report: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('API Response data:', result);
      
      if (result.success) {
        // Update quotation data with parsed results
        setQuotationData(prev => ({
          ...prev,
          vcdsReport: file,
          extractedErrors: result.data.errorCodes,
          partsCost: result.data.totalEstimatedCost
        }));

        console.log('VCDS report parsed successfully:', result.data);
        console.log('Updated quotation data:', {
          vcdsReport: file,
          extractedErrors: result.data.errorCodes,
          partsCost: result.data.totalEstimatedCost
        });

        // Get AI analysis for the extracted errors
        await getAIAnalysis(result.data.errorCodes);
      } else {
        throw new Error(result.error || 'Failed to parse VCDS report');
      }
    } catch (error) {
      console.error('Error processing VCDS report:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert('Error processing VCDS report: ' + errorMessage);
    } finally {
      setIsUploading(false);
    }
  };

  const getAIAnalysis = async (errorCodes: VCDSError[]) => {
    if (errorCodes.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/error-codes/ai-estimate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          errorCodes: errorCodes.map(ec => ({
            code: ec.code,
            description: ec.description,
            severity: ec.severity,
            category: ec.category,
            estimatedCost: ec.estimatedCost
          })),
          vehicleInfo: {
            make: quotationData.vehicleMake || 'VAG',
            model: quotationData.vehicleModel || 'Vehicle',
            year: quotationData.vehicleYear || 'Unknown'
          }
        })
      });

      if (response.ok) {
        const result = await response.json();
        setAiAnalysis(result.data.aiAssessment);
      } else {
        console.error('Failed to get AI analysis');
      }
    } catch (error) {
      console.error('Error getting AI analysis:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const nextStep = () => currentStep < steps.length && setCurrentStep(currentStep + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep(currentStep - 1);

  const renderStep1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Customer Name *
          </label>
          <input
            type="text"
            value={quotationData.customerName}
            onChange={(e) => handleInputChange('customerName', e.target.value)}
            className="input-field"
            placeholder="Enter customer name"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Phone Number *
          </label>
          <input
            type="tel"
            value={quotationData.customerPhone}
            onChange={(e) => handleInputChange('customerPhone', e.target.value)}
            className="input-field"
            placeholder="+254 700 000 000"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Vehicle Make *
          </label>
          <select
            value={quotationData.vehicleMake}
            onChange={(e) => handleInputChange('vehicleMake', e.target.value)}
            className="input-field"
            required
          >
            <option value="">Select Make</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Audi">Audi</option>
            <option value="Porsche">Porsche</option>
            <option value="Skoda">Skoda</option>
            <option value="Seat">Seat</option>
            <option value="Fiat">Fiat</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Vehicle Model *
          </label>
          <input
            type="text"
            value={quotationData.vehicleModel}
            onChange={(e) => handleInputChange('vehicleModel', e.target.value)}
            className="input-field"
            placeholder="e.g., Golf, A4, 911"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
            Year *
          </label>
          <input
            type="number"
            value={quotationData.vehicleYear}
            onChange={(e) => handleInputChange('vehicleYear', e.target.value)}
            className="input-field"
            placeholder="2020"
            min="1990"
            max="2025"
            required
          />
        </div>
      </div>
    </motion.div>
  );

  const renderStep2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
        }}>
          <Upload className="w-12 h-12 text-white" />
        </div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Upload VCDS Report
        </h3>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          Upload your VCDS diagnostic report to automatically extract error codes
        </p>
      </div>

      <div className="border-2 border-dashed rounded-lg p-8 text-center" style={{
        borderColor: 'var(--border-primary)',
        background: 'var(--bg-secondary)'
      }}>
        {quotationData.vcdsReport ? (
          <div className="space-y-4">
            <FileText className="w-16 h-16 mx-auto" style={{ color: 'var(--accent-primary)' }} />
            <div>
              <p className="font-medium" style={{ color: 'var(--text-primary)' }}>
                {quotationData.vcdsReport.name}
              </p>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {(quotationData.vcdsReport.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={() => handleInputChange('vcdsReport', null)}
              className="text-sm px-4 py-2 rounded-lg transition-colors hover:bg-red-500/10 hover:text-red-400"
              style={{ color: 'var(--text-secondary)' }}
            >
              Remove File
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload className="w-16 h-16 mx-auto" style={{ color: 'var(--text-tertiary)' }} />
            <div>
              <p className="font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Drop your VCDS report here
              </p>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                or click to browse files
              </p>
            </div>
            <input
              type="file"
              accept=".txt,.log,.csv"
              onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
              className="hidden"
              id="vcds-upload"
            />
            <label
              htmlFor="vcds-upload"
              className="glass-button cursor-pointer"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {isUploading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto mb-2" style={{ borderColor: 'var(--accent-primary)' }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Processing VCDS report...</p>
        </div>
      )}
    </motion.div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Error Code Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Review the extracted error codes and estimated repair costs
        </p>
      </div>

      {quotationData.extractedErrors.length > 0 ? (
        <div className="space-y-4">
          {/* Error Codes Display */}
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Extracted Error Codes ({quotationData.extractedErrors.length})
            </h4>
            <div className="space-y-3">
              {quotationData.extractedErrors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg" 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-tertiary)'
                  }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        error.severity === 'high' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        error.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {error.severity.toUpperCase()}
                      </span>
                      <span className="px-3 py-1 text-xs font-medium rounded-full" style={{
                        background: 'rgba(255, 0, 0, 0.1)',
                        color: 'var(--accent-primary)',
                        border: '1px solid var(--border-primary)'
                      }}>
                        {error.category}
                      </span>
                    </div>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {error.description}
                    </p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-lg font-bold" style={{ color: 'var(--accent-primary)' }}>
                      KES {error.estimatedCost.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Analysis Section */}
          {isAnalyzing && (
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                <h4 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                  AI Analysis in Progress...
                </h4>
              </div>
              <p style={{ color: 'var(--text-secondary)' }}>
                Analyzing your VCDS report with AI to provide professional insights and recommendations.
              </p>
            </div>
          )}

          {aiAnalysis && (
            <div className="glass-card p-6" style={{
              background: 'var(--glass-bg)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--shadow-primary)'
            }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                    AI-Powered Analysis
                  </h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    Professional diagnostic insights powered by GPT-4o Mini
                  </p>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none" style={{ color: 'var(--text-primary)' }}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {aiAnalysis}
                </div>
              </div>
            </div>
          )}

          {/* Total Cost Summary */}
          <div className="glass-card p-6">
            <h4 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Cost Summary
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-tertiary)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Parts Cost:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  KES {quotationData.partsCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-tertiary)'
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Labor Cost:</span>
                <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                  KES {quotationData.laborCost.toLocaleString()}
                </span>
              </div>
              <hr style={{ borderColor: 'var(--border-secondary)' }} />
              <div className="flex justify-between items-center p-4 rounded-lg" style={{
                background: 'linear-gradient(135deg, rgba(255, 0, 0, 0.1), rgba(255, 0, 0, 0.05))',
                border: '1px solid var(--border-primary)'
              }}>
                <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                  Total Estimated Cost:
                </span>
                <span className="text-xl font-bold" style={{ color: 'var(--accent-primary)' }}>
                  KES {(quotationData.partsCost + quotationData.laborCost).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Error Codes Found
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Upload a VCDS report to see error code analysis and AI-powered insights.
          </p>
        </div>
      )}
    </div>
  );

  const renderStep4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          Quotation Summary
        </h3>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Review all details before generating the final quotation
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Customer & Vehicle Details
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Name:</span>
              <span style={{ color: 'var(--text-primary)' }}>{quotationData.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Phone:</span>
              <span style={{ color: 'var(--text-primary)' }}>{quotationData.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Vehicle:</span>
              <span style={{ color: 'var(--text-primary)' }}>{quotationData.vehicleYear} {quotationData.vehicleMake} {quotationData.vehicleModel}</span>
            </div>
          </div>
        </div>

        <div className="glass-card p-6">
          <h4 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Cost Breakdown
          </h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Parts Cost:</span>
              <span style={{ color: 'var(--text-primary)' }}>KES {quotationData.partsCost.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Labor Cost:</span>
              <span style={{ color: 'var(--text-primary)' }}>KES {quotationData.laborCost.toLocaleString()}</span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between text-lg font-bold">
                <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                <span style={{ color: 'var(--accent-primary)' }}>KES {(quotationData.partsCost + quotationData.laborCost).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => navigate('/quotations')}
          className="glass-button px-8 py-3 text-lg"
        >
          <CheckCircle className="w-5 h-5 mr-2" />
          Generate Quotation
        </button>
      </div>
    </motion.div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return renderStep1();
    }
  };

  return (
    <div className="min-h-screen pt-16" style={{
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
    }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
          }}>
            <Plus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Create VAG Culture Quotation
          </h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Generate professional repair quotations with VCDS error analysis
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'border-red-500 bg-red-500 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {currentStep > step.id ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-red-500' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-4">
            {steps.map((step) => (
              <div key={step.id} className="text-center flex-1">
                <div className={`text-sm font-medium ${
                  currentStep >= step.id ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {renderCurrentStep()}
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="glass-button-secondary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </button>
          
          {currentStep < steps.length && (
            <button
              onClick={nextStep}
              disabled={
                (currentStep === 1 && (!quotationData.customerName || !quotationData.customerPhone || !quotationData.vehicleMake || !quotationData.vehicleModel || !quotationData.vehicleYear)) ||
                (currentStep === 2 && !quotationData.vcdsReport) ||
                (currentStep === 3 && quotationData.extractedErrors.length === 0)
              }
              className="glass-button px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-5 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuotation;
