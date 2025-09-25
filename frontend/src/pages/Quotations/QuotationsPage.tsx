import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import { motion } from 'framer-motion';
import {
  ClipboardDocumentListIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  ArrowDownTrayIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';

interface QuotationItem {
  id: string;
  name: string;
  unitPrice: number;
  qty: number;
  total: number;
}

interface Quotation {
  id: string;
  analysisId: string;
  customerName: string;
  vehicleInfo: string;
  items: QuotationItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  validUntil: string;
}

const QuotationsPage: React.FC = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: 'QT-001',
      analysisId: 'AN-001',
      customerName: 'John Smith',
      vehicleInfo: '2018 Volkswagen Golf 2.0L TDI',
      items: [
        { id: '1', name: 'Spark Plugs (Set of 4)', unitPrice: 45.00, qty: 1, total: 45.00 },
        { id: '2', name: 'Ignition Coil', unitPrice: 120.00, qty: 1, total: 120.00 },
        { id: '3', name: 'Labor - Engine Diagnostics', unitPrice: 80.00, qty: 2, total: 160.00 },
      ],
      subtotal: 325.00,
      taxRate: 16,
      taxAmount: 52.00,
      totalAmount: 377.00,
      currency: 'USD',
      status: 'accepted',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:20:00Z',
      validUntil: '2024-01-22T10:30:00Z',
    },
    {
      id: 'QT-002',
      analysisId: 'AN-002',
      customerName: 'Sarah Johnson',
      vehicleInfo: '2020 BMW X3 xDrive30i',
      items: [
        { id: '1', name: 'Oxygen Sensor', unitPrice: 180.00, qty: 1, total: 180.00 },
        { id: '2', name: 'Catalytic Converter', unitPrice: 450.00, qty: 1, total: 450.00 },
        { id: '3', name: 'Labor - Exhaust System', unitPrice: 120.00, qty: 3, total: 360.00 },
      ],
      subtotal: 990.00,
      taxRate: 16,
      taxAmount: 158.40,
      totalAmount: 1148.40,
      currency: 'USD',
      status: 'sent',
      createdAt: '2024-01-15T11:15:00Z',
      updatedAt: '2024-01-15T11:15:00Z',
      validUntil: '2024-01-22T11:15:00Z',
    },
    {
      id: 'QT-003',
      analysisId: 'AN-003',
      customerName: 'Mike Wilson',
      vehicleInfo: '2019 Toyota Camry LE',
      items: [
        { id: '1', name: 'Brake Pads (Front)', unitPrice: 65.00, qty: 1, total: 65.00 },
        { id: '2', name: 'Brake Rotors (Front)', unitPrice: 85.00, qty: 2, total: 170.00 },
        { id: '3', name: 'Labor - Brake Service', unitPrice: 90.00, qty: 2, total: 180.00 },
      ],
      subtotal: 415.00,
      taxRate: 16,
      taxAmount: 66.40,
      totalAmount: 481.40,
      currency: 'USD',
      status: 'draft',
      createdAt: '2024-01-15T12:00:00Z',
      updatedAt: '2024-01-15T12:00:00Z',
      validUntil: '2024-01-22T12:00:00Z',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'sent':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircleIcon className="h-4 w-4" />;
      case 'sent':
        return <ClockIcon className="h-4 w-4" />;
      case 'draft':
        return <PencilIcon className="h-4 w-4" />;
      case 'rejected':
        return <XCircleIcon className="h-4 w-4" />;
      default:
        return <ClipboardDocumentListIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
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
              <h1 className="text-4xl font-bold mb-2 font-sf-pro">Quotation Management</h1>
              <p className="text-xl text-white/90 font-sf-pro-text mb-4">
                Create, manage, and track professional quotations for your clients
              </p>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Multi-currency support</span>
                </div>
                <div className="flex items-center space-x-2">
                  <DocumentDuplicateIcon className="h-5 w-5 text-white/80" />
                  <span className="text-sm font-medium font-sf-pro-text">Professional templates</span>
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="h-24 w-24 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <ClipboardDocumentListIcon className="h-12 w-12 text-white/80" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Quotations', value: quotations.length.toString(), color: 'from-blue-500 to-blue-600' },
          { label: 'Accepted', value: quotations.filter(q => q.status === 'accepted').length.toString(), color: 'from-green-500 to-green-600' },
          { label: 'Pending', value: quotations.filter(q => q.status === 'sent').length.toString(), color: 'from-yellow-500 to-yellow-600' },
          { label: 'Draft', value: quotations.filter(q => q.status === 'draft').length.toString(), color: 'from-purple-500 to-purple-600' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 font-sf-pro-text">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 font-sf-pro">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-sm`}>
                <ClipboardDocumentListIcon className="h-6 w-6 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900 font-sf-pro">All Quotations</h2>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Accepted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Sent</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-gray-600 font-sf-pro-text">Draft</span>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-6 py-3 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 flex items-center space-x-2 font-sf-pro-text"
          >
            <PlusIcon className="h-5 w-5" />
            <span>New Quotation</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Quotations List */}
      <div className="space-y-6">
        {quotations.map((quotation, index) => (
          <motion.div
            key={quotation.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6 hover:shadow-tajilabs-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4">
                <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center shadow-sm">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-tajilabs-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900 font-sf-pro">{quotation.id}</h3>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border font-sf-pro-text ${getStatusColor(quotation.status)}`}>
                      <span className="flex items-center space-x-1">
                        {getStatusIcon(quotation.status)}
                        <span className="capitalize">{quotation.status}</span>
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 font-sf-pro-text">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4" />
                      <span>{quotation.customerName}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>Created {formatDate(quotation.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <EyeIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                  <ArrowDownTrayIcon className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Vehicle Info */}
              <div className="lg:col-span-2">
                <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-3">Vehicle Information</h4>
                <p className="text-gray-700 font-sf-pro-text mb-4">{quotation.vehicleInfo}</p>
                
                <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-3">Items & Services</h4>
                <div className="space-y-3">
                  {quotation.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 font-sf-pro-text">{item.name}</p>
                        <p className="text-sm text-gray-600 font-sf-pro-text">
                          {formatCurrency(item.unitPrice, quotation.currency)} × {item.qty}
                        </p>
                      </div>
                      <p className="font-semibold text-gray-900 font-sf-pro-text">
                        {formatCurrency(item.total, quotation.currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 font-sf-pro mb-4">Pricing Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-sf-pro-text">Subtotal:</span>
                    <span className="font-medium text-gray-900 font-sf-pro-text">
                      {formatCurrency(quotation.subtotal, quotation.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 font-sf-pro-text">Tax ({quotation.taxRate}%):</span>
                    <span className="font-medium text-gray-900 font-sf-pro-text">
                      {formatCurrency(quotation.taxAmount, quotation.currency)}
                    </span>
                  </div>
                  <div className="border-t border-gray-300 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-gray-900 font-sf-pro">Total:</span>
                      <span className="text-lg font-bold text-tajilabs-primary font-sf-pro">
                        {formatCurrency(quotation.totalAmount, quotation.currency)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-4 border-t border-gray-300">
                  <p className="text-sm text-gray-600 font-sf-pro-text">
                    Valid until: {formatDate(quotation.validUntil)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default QuotationsPage;