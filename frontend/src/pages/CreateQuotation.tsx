import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Car, FileText, Calculator, User } from 'lucide-react';

const CreateQuotation: React.FC = () => {
  return (
    <div className="min-h-screen pt-16" style={{ 
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>Create VAG Culture Quotation</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Generate professional repair estimates for VAG vehicles with AI-powered diagnostics and community insights.
          </p>
          
          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <button className="glass-button">
              <Car className="w-5 h-5" />
              Upload VCDS Report
            </button>
            <button className="glass-button-secondary">
              <Calculator className="w-5 h-5" />
              Manual Entry
            </button>
          </div>
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <div className="glass-card p-12 max-w-2xl mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Coming Soon!</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              The quotation creation system is currently under development. 
              You'll soon be able to create detailed repair estimates by uploading VCDS reports 
              or manually entering vehicle information and error codes.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <FileText className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>VCDS Reports</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <Calculator className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Cost Estimates</div>
              </div>
              <div className="text-center p-4 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                <User className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--accent-primary)' }} />
                <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Client Management</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuotation;
