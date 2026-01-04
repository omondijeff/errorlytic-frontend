import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { XMarkIcon } from '@heroicons/react/24/outline';
import CustomSelect from '../UI/CustomSelect';
import apiClient from '../../services/apiClient';
import type { RootState } from '../../store';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { token, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    registrationNumber: '',
    carMake: 'Volkswagen (VW)',
    carModel: 'Golf',
    year: '2019',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [filePreview, setFilePreview] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);

  const carMakes = [
    // VAG (Volkswagen Auto Group) Brands
    'Volkswagen (VW)',
    'Audi',
    'Skoda',
    'Seat',
    'Porsche',
    'Bentley',
    'Lamborghini',
    'Bugatti',
    // Other Brands
    'BMW',
    'Mercedes-Benz',
    'Toyota',
    'Honda',
    'Ford',
    'Nissan',
    'Mazda',
    'Subaru',
  ];

  // Map makes to their respective models
  const makeToModels: Record<string, string[]> = {
    // VAG Brands - Complete lineup
    'Volkswagen (VW)': [
      'Golf', 'Golf GTI', 'Golf R', 'Polo', 'Passat', 'Jetta', 'Arteon',
      'Tiguan', 'T-Roc', 'T-Cross', 'Touareg', 'Atlas', 'Taos',
      'ID.3', 'ID.4', 'ID.5', 'ID.7', 'ID.Buzz',
      'Touran', 'Sharan', 'Caddy', 'Transporter', 'Crafter',
      'Beetle', 'Scirocco', 'Eos', 'CC', 'Phaeton', 'Up!'
    ],
    'Audi': [
      'A1', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8',
      'S3', 'S4', 'S5', 'S6', 'S7', 'S8',
      'RS3', 'RS4', 'RS5', 'RS6', 'RS7',
      'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q7', 'Q8',
      'SQ5', 'SQ7', 'SQ8', 'RSQ3', 'RSQ8',
      'TT', 'TTS', 'TT RS', 'R8',
      'e-tron', 'e-tron GT', 'A6 e-tron'
    ],
    'Skoda': [
      'Fabia', 'Scala', 'Octavia', 'Superb', 'Rapid',
      'Kamiq', 'Karoq', 'Kodiaq',
      'Enyaq iV', 'Enyaq Coupe iV',
      'Citigo', 'Yeti', 'Roomster'
    ],
    'Seat': [
      'Ibiza', 'Leon', 'Toledo', 'Exeo',
      'Arona', 'Ateca', 'Tarraco',
      'Mii', 'Alhambra',
      'Cupra Formentor', 'Cupra Leon', 'Cupra Ateca', 'Cupra Born'
    ],
    'Porsche': [
      '911', '911 Carrera', '911 Turbo', '911 GT3', '911 GT2',
      'Boxster', 'Cayman', '718',
      'Cayenne', 'Cayenne S', 'Cayenne Turbo',
      'Macan', 'Macan S', 'Macan GTS',
      'Panamera', 'Panamera 4S', 'Panamera Turbo',
      'Taycan', 'Taycan Turbo', 'Taycan Cross Turismo'
    ],
    'Bentley': [
      'Continental GT', 'Continental GTC', 'Continental Flying Spur',
      'Bentayga', 'Bentayga Hybrid', 'Bentayga S',
      'Flying Spur', 'Flying Spur Hybrid',
      'Mulsanne', 'Arnage', 'Azure'
    ],
    'Lamborghini': [
      'Huracan', 'Huracan EVO', 'Huracan STO', 'Huracan Performante',
      'Aventador', 'Aventador S', 'Aventador SVJ',
      'Urus', 'Urus S', 'Urus Performante',
      'Revuelto', 'Gallardo', 'Murcielago'
    ],
    'Bugatti': [
      'Chiron', 'Chiron Sport', 'Chiron Super Sport', 'Chiron Pur Sport',
      'Veyron', 'Veyron Grand Sport', 'Veyron Super Sport',
      'Divo', 'Centodieci', 'La Voiture Noire', 'Bolide', 'Mistral'
    ],
    // Other Brands
    'BMW': ['1 Series', '2 Series', '3 Series', '4 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'X7', 'iX', 'i4'],
    'Mercedes-Benz': ['A-Class', 'C-Class', 'E-Class', 'S-Class', 'GLA', 'GLC', 'GLE', 'GLS', 'EQC', 'EQE'],
    'Toyota': ['Corolla', 'Camry', 'RAV4', 'Highlander', 'Prius', 'Land Cruiser', 'Tacoma', 'Tundra', '4Runner'],
    'Honda': ['Civic', 'Accord', 'CR-V', 'Pilot', 'HR-V', 'Odyssey', 'Ridgeline', 'Passport'],
    'Ford': ['Fiesta', 'Focus', 'Mustang', 'Explorer', 'Escape', 'F-150', 'Bronco', 'Edge', 'Ranger'],
    'Nissan': ['Altima', 'Sentra', 'Maxima', 'Rogue', 'Pathfinder', 'Murano', 'Frontier', 'Titan', 'Leaf'],
    'Mazda': ['Mazda3', 'Mazda6', 'CX-3', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-30', 'CX-50'],
    'Subaru': ['Impreza', 'Legacy', 'Outback', 'Forester', 'Crosstrek', 'Ascent', 'WRX', 'BRZ'],
  };

  // Get models for the selected make
  const carModels = makeToModels[formData.carMake] || [];

  const years = Array.from({ length: 25 }, (_, i) => (2024 - i).toString());

  const handleInputChange = (field: string, value: string) => {
    if (field === 'carMake') {
      // When make changes, set the first model of that make
      const firstModel = makeToModels[value]?.[0] || '';
      setFormData({ ...formData, [field]: value, carModel: firstModel });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleFileSelect = (file: File) => {
    const validExtensions = ['.csv', '.vcds', '.txt', '.pdf'];
    const isValid = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));

    if (isValid) {
      setIsUploading(true);
      setUploadUrl(''); // Clear URL if file is selected

      // Read file preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        // Get first 500 characters as preview
        setFilePreview(text.substring(0, 500));
      };
      reader.readAsText(file);

      // Simulate upload process
      setTimeout(() => {
        setSelectedFile(file);
        setIsUploading(false);
      }, 2000); // Simulated 2 second upload
    } else {
      alert('Please select a valid file (VCDS, CSV, TXT, or PDF)');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUrlUpload = () => {
    if (uploadUrl.trim()) {
      setIsUploading(true);
      setSelectedFile(null); // Clear file if URL is used

      // Simulate URL upload process
      setTimeout(() => {
        // Create a mock file object for URL uploads
        const urlFileName = uploadUrl.split('/').pop() || 'report.txt';
        const mockFile = new File([''], urlFileName, { type: 'text/plain' });
        setSelectedFile(mockFile);
        setIsUploading(false);
        console.log('Uploaded from URL:', uploadUrl);
      }, 2000);
    } else {
      alert('Please enter a valid URL');
    }
  };

  const handleStartAnalyzing = async () => {
    if (!selectedFile) {
      alert('No file selected');
      return;
    }

    // Check authentication
    if (!isAuthenticated || !token) {
      alert('You are not authenticated. Please log in again.');
      navigate('/login');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisProgress(0);

    try {
      // Create FormData for file upload
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      uploadFormData.append('firstName', formData.firstName);
      uploadFormData.append('lastName', formData.lastName);
      uploadFormData.append('registrationNumber', formData.registrationNumber);
      uploadFormData.append('carMake', formData.carMake);
      uploadFormData.append('carModel', formData.carModel);
      uploadFormData.append('year', formData.year);

      // Simulate progress while uploading
      const progressInterval = setInterval(() => {
        setAnalysisProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 200);

      // Upload file to backend using apiClient
      const response = await apiClient.post('/reports/upload', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);

      // Complete progress
      setAnalysisProgress(100);

      // Wait a moment to show 100% completion
      setTimeout(() => {
        console.log('Analysis complete:', response.data);
        setAnalysisResult(response.data.data);
        setShowResults(true);
        setIsAnalyzing(false);
        setAnalysisProgress(0);
      }, 1000);

    } catch (error: any) {
      console.error('Upload error:', error);

      // Clear interval if it's still running
      setAnalysisProgress(0);

      // Better error handling
      let errorMessage = 'Failed to upload file. Please try again.';

      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          errorMessage = 'Authentication expired. Please log in again.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 413) {
          errorMessage = 'File is too large. Maximum size is 10MB.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        } else {
          errorMessage = `Upload failed: ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'No response from server. Please check your connection.';
      }

      alert(errorMessage);
      setIsAnalyzing(false);
    }
  };

  const handleCancelAnalysis = () => {
    setIsAnalyzing(false);
    setAnalysisProgress(0);
  };

  const handleSaveAndContinue = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle final submission
      console.log('Form submitted:', formData);
      console.log('Selected file:', selectedFile);
      console.log('Upload URL:', uploadUrl);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Upload Document</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-6 w-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-8 py-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Step 1 - Personal Info */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 1
                    ? 'bg-[#EA6A47] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= 1 ? 'text-[#EA6A47]' : 'text-gray-400'
                }`}
              >
                Personal Info
              </span>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-[-20px]"></div>

            {/* Step 2 - Upload */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 2
                    ? 'bg-[#EA6A47] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= 2 ? 'text-[#EA6A47]' : 'text-gray-400'
                }`}
              >
                Upload
              </span>
            </div>

            {/* Connector Line */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-4 mt-[-20px]"></div>

            {/* Step 3 - Analyze */}
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep >= 3
                    ? 'bg-[#EA6A47] text-white'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {currentStep > 3 ? '✓' : '3'}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${
                  currentStep >= 3 ? 'text-[#EA6A47]' : 'text-gray-400'
                }`}
              >
                Analyze
              </span>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="px-8 pb-8 overflow-y-auto max-h-[calc(90vh-300px)]">
          {currentStep === 1 && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* First Row - Name Fields */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Client's First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="John"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Client's Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Second Row - Registration and Make */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Current Car Registration Number
                  </label>
                  <input
                    type="text"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                    placeholder="KTY485959"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Make of the Car
                  </label>
                  <CustomSelect
                    value={formData.carMake}
                    onChange={(value) => handleInputChange('carMake', value)}
                    options={carMakes}
                  />
                </div>
              </div>

              {/* Third Row - Model and Year */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Car model
                  </label>
                  <CustomSelect
                    value={formData.carModel}
                    onChange={(value) => handleInputChange('carModel', value)}
                    options={carModels}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Year (Optional)
                  </label>
                  <CustomSelect
                    value={formData.year}
                    onChange={(value) => handleInputChange('year', value)}
                    options={years}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="flex gap-8 max-w-7xl mx-auto">
              {/* Left Side - Summary from Step 1 */}
              <div className="w-1/3 flex-shrink-0">
                <div className="bg-white rounded-2xl border border-gray-200 p-6 sticky top-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>
                  <div className="space-y-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">First Name</p>
                      <p className="font-medium text-gray-900">{formData.firstName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Last Name</p>
                      <p className="font-medium text-gray-900">{formData.lastName || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Registration Number</p>
                      <p className="font-medium text-gray-900">{formData.registrationNumber || 'Not provided'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Car Make</p>
                      <p className="font-medium text-gray-900">{formData.carMake}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Car Model</p>
                      <p className="font-medium text-gray-900">{formData.carModel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Year</p>
                      <p className="font-medium text-gray-900">{formData.year}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Upload Section */}
              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl p-8">
                  <h2 className="text-4xl font-bold text-black mb-8">Upload VCDS Report</h2>

                  {/* Drag and Drop Area */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-2xl p-16 transition-all ${
                      isUploading
                        ? 'border-[#EA6A47] bg-gray-50'
                        : isDragging
                        ? 'border-[#d85a37] bg-[#EA6A47]/5 cursor-pointer'
                        : 'border-[#EA6A47] bg-white hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {isUploading ? (
                      // Uploading State
                      <div className="flex flex-col items-center justify-center space-y-4">
                        {/* Loading Spinner */}
                        <div className="relative w-20 h-20">
                          <svg
                            className="animate-spin w-20 h-20 text-[#EA6A47]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                        </div>

                        {/* Uploading Text */}
                        <div className="text-center">
                          <p className="text-2xl font-semibold text-[#EA6A47] mb-2">
                            Uploading Report....
                          </p>
                          <p className="text-gray-500">Or drag and drop it here</p>
                        </div>
                      </div>
                    ) : (
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          {/* Document Icon */}
                          <svg
                            className="w-20 h-20 text-[#EA6A47]"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                            <path d="M14 2v6h6" />
                            <path d="M12 18v-6" />
                            <path d="M9 15l3 3 3-3" />
                          </svg>

                          {/* Upload Text */}
                          <div className="text-center">
                            {selectedFile ? (
                              <>
                                <p className="text-2xl font-semibold text-green-600 mb-2">
                                  {selectedFile.name}
                                </p>
                                <p className="text-gray-500">
                                  {(selectedFile.size / 1024).toFixed(2)} KB
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    setSelectedFile(null);
                                  }}
                                  className="mt-2 text-sm text-[#EA6A47] hover:underline"
                                >
                                  Remove file
                                </button>
                              </>
                            ) : (
                              <>
                                <p className="text-2xl font-semibold text-[#EA6A47] mb-2">
                                  Select file to upload
                                </p>
                                <p className="text-gray-500">Or drag and drop it here</p>
                                <p className="text-sm text-gray-400 mt-2">Supported formats: VCDS, CSV, TXT, PDF</p>
                              </>
                            )}
                          </div>
                        </div>
                        <input
                          id="file-upload"
                          type="file"
                          accept=".csv,.vcds,.txt,.pdf"
                          className="hidden"
                          onChange={handleFileInputChange}
                          disabled={isUploading}
                        />
                      </label>
                    )}
                  </div>

                  {/* URL Upload Section */}
                  <div className="mt-8">
                    <h3 className="text-2xl font-semibold text-[#EA6A47] mb-4">
                      Or upload from url
                    </h3>
                    <div className="flex items-center space-x-4">
                      <input
                        type="text"
                        value={uploadUrl}
                        onChange={(e) => setUploadUrl(e.target.value)}
                        placeholder="Add url"
                        disabled={isUploading}
                        className="flex-1 px-6 py-4 border border-gray-300 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                      <button
                        type="button"
                        onClick={handleUrlUpload}
                        disabled={isUploading}
                        className="px-12 py-4 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium text-base disabled:bg-gray-300 disabled:cursor-not-allowed"
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-12 min-h-[600px]">
                {showResults && analysisResult ? (
                  // Results View - Show analysis results
                  <div className="space-y-8">
                    {/* Success Message */}
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                        <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Analysis Complete!</h3>
                      <p className="text-gray-600">Your VCDS report has been successfully analyzed</p>
                    </div>

                    {/* Vehicle Info Card */}
                    {analysisResult.vehicle && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Registration</p>
                            <p className="font-semibold text-gray-900">{analysisResult.vehicle.plate}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Make & Model</p>
                            <p className="font-semibold text-gray-900">{analysisResult.vehicle.make} {analysisResult.vehicle.model}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Year</p>
                            <p className="font-semibold text-gray-900">{analysisResult.vehicle.year}</p>
                          </div>
                          {analysisResult.vehicle.ownerInfo && (
                            <div>
                              <p className="text-sm text-gray-500">Owner</p>
                              <p className="font-semibold text-gray-900">
                                {analysisResult.vehicle.ownerInfo.firstName} {analysisResult.vehicle.ownerInfo.lastName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Analysis Summary */}
                    {analysisResult.summary && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">Analysis Summary</h4>
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-3xl font-bold text-[#EA6A47]">{analysisResult.summary.totalErrors || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Total Errors</p>
                          </div>
                          <div className="text-center p-4 bg-red-50 rounded-lg">
                            <p className="text-3xl font-bold text-red-600">{analysisResult.summary.criticalErrors || 0}</p>
                            <p className="text-sm text-gray-600 mt-1">Critical Errors</p>
                          </div>
                          <div className="text-center p-4 bg-blue-50 rounded-lg">
                            <p className="text-3xl font-bold text-blue-600">
                              {analysisResult.summary.estimatedCost
                                ? `$${analysisResult.summary.estimatedCost.toLocaleString()}`
                                : 'N/A'}
                            </p>
                            <p className="text-sm text-gray-600 mt-1">Est. Cost</p>
                          </div>
                        </div>
                        {analysisResult.summary.overview && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                            <p className="text-gray-700">{analysisResult.summary.overview}</p>
                          </div>
                        )}
                        {analysisResult.summary.severity && (
                          <div className="mt-4">
                            <span className={`inline-block px-4 py-2 rounded-full text-sm font-medium ${
                              analysisResult.summary.severity === 'critical' ? 'bg-red-100 text-red-700' :
                              analysisResult.summary.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                              analysisResult.summary.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              Priority: {analysisResult.summary.severity.toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* AI-Enhanced Insights */}
                    {analysisResult.aiInsights && analysisResult.aiInsights.assessment && (
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                        <div className="flex items-center space-x-2 mb-4">
                          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          <h4 className="text-lg font-semibold text-purple-900">AI-Powered Analysis</h4>
                          <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                            {analysisResult.aiInsights.model}
                          </span>
                        </div>
                        <div className="prose prose-sm max-w-none">
                          <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed bg-white/50 p-4 rounded-lg font-sans">
                            {analysisResult.aiInsights.assessment}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* DTCs List */}
                    {analysisResult.dtcs && analysisResult.dtcs.length > 0 && (
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <h4 className="text-lg font-semibold text-gray-900 mb-4">
                          Diagnostic Trouble Codes ({analysisResult.dtcs.length})
                        </h4>
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {analysisResult.dtcs.slice(0, 10).map((dtc: any, index: number) => (
                            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                              <div>
                                <p className="font-mono font-semibold text-gray-900">{dtc.code || dtc}</p>
                                {dtc.description && <p className="text-sm text-gray-600">{dtc.description}</p>}
                              </div>
                              {dtc.severity && (
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  dtc.severity === 'critical' ? 'bg-red-100 text-red-700' :
                                  dtc.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {dtc.severity}
                                </span>
                              )}
                            </div>
                          ))}
                          {analysisResult.dtcs.length > 10 && (
                            <p className="text-sm text-gray-500 text-center pt-2">
                              And {analysisResult.dtcs.length - 10} more codes...
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex justify-center space-x-4 pt-6">
                      <button
                        onClick={() => {
                          // Navigate to analysis page with the analysisId
                          window.location.href = `/app/analysis/${analysisResult.analysisId}`;
                        }}
                        className="px-8 py-3 bg-[#EA6A47] text-white font-medium rounded-full hover:bg-[#d85a37] transition-colors"
                      >
                        View Full Report
                      </button>
                      <button
                        onClick={() => {
                          // Reset and upload another
                          setShowResults(false);
                          setAnalysisResult(null);
                          setCurrentStep(1);
                          setSelectedFile(null);
                          setFormData({
                            firstName: '',
                            lastName: '',
                            registrationNumber: '',
                            carMake: 'Volkswagen (VW)',
                            carModel: 'Golf',
                            year: '2019',
                          });
                        }}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Upload Another
                      </button>
                      <button
                        onClick={onClose}
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-medium rounded-full hover:bg-gray-100 transition-colors"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* File Display - Always visible */}
                    <div className="mb-8 flex items-center space-x-4">
                      <svg
                        className="w-8 h-8 text-gray-700"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                        <path d="M14 2v6h6" />
                      </svg>
                      <span className="text-lg font-medium text-gray-900">
                        {selectedFile?.name || 'No file selected'}
                      </span>
                    </div>

                    {isAnalyzing ? (
                      // Analysis State - Show file preview and progress
                      <div className="space-y-6">
                        {/* File Preview */}
                        <div className="border-2 border-gray-300 rounded-xl p-6 bg-white h-80 overflow-y-auto">
                          <pre className="text-xs text-gray-600 font-mono whitespace-pre-wrap">
                            {filePreview || 'Loading preview...'}
                          </pre>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center space-x-4">
                          <span className="text-3xl font-bold text-[#EA6A47] min-w-[80px]">
                            {analysisProgress}%
                          </span>
                          <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-[#EA6A47] h-full transition-all duration-300"
                              style={{ width: `${analysisProgress}%` }}
                            ></div>
                          </div>
                          <button
                            type="button"
                            onClick={handleCancelAnalysis}
                            className="px-8 py-2 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Initial State - Show blue border and Start Analyzing button
                      <div className="border-4 border-[#3B82F6] rounded-2xl p-12 bg-white min-h-[450px] flex flex-col items-center justify-center">
                        {/* Replace Button */}
                        <div className="w-full flex justify-end mb-6">
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null);
                              setCurrentStep(2);
                            }}
                            className="flex items-center space-x-2 text-[#EA6A47] hover:text-[#d85a37] font-medium"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                              />
                            </svg>
                            <span>Replace</span>
                          </button>
                        </div>

                        {/* Start Analyzing Button */}
                        <button
                          type="button"
                          onClick={handleStartAnalyzing}
                          className="px-24 py-4 bg-[#EA6A47] text-white text-lg font-medium rounded-full hover:bg-[#d85a37] transition-colors"
                        >
                          Start Analyzing
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer with Navigation Buttons - Hide on Step 3 */}
        {currentStep !== 3 && (
          <div className="px-8 py-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              {/* Back Button - Only show if not on first step */}
              {currentStep > 1 ? (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-full hover:bg-gray-50 transition-colors font-medium text-base"
                >
                  Previous
                </button>
              ) : (
                <div></div>
              )}

              {/* Save and Continue Button */}
              <button
                onClick={handleSaveAndContinue}
                className="px-12 py-3 bg-[#EA6A47] text-white rounded-full hover:bg-[#d85a37] transition-colors font-medium text-base"
              >
                Save and continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadModal;
