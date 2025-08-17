import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Car } from 'lucide-react';
import { Link } from 'react-router-dom';

const CreateQuotation: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Plus className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Create Quotation</h1>
          <p className="text-xl text-dark-300 mb-8">
            Build a new car repair quotation for VAG vehicles
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Car className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon!</h2>
            <p className="text-dark-300 mb-6">
              The quotation creation system is being developed. You'll be able to create detailed repair estimates with VCDS report analysis and AI-powered error explanations.
            </p>
            
            <Link to="/dashboard" className="glass-button-secondary">
              Back to Dashboard
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateQuotation;
