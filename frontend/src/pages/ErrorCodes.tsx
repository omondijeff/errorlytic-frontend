import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search } from 'lucide-react';

const ErrorCodes: React.FC = () => {
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">VAG Error Codes</h1>
          <p className="text-xl text-dark-300 mb-8">
            Comprehensive database of Volkswagen Group error codes with AI explanations
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-12">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon!</h2>
            <p className="text-dark-300 mb-6">
              The error code database is being developed. You'll be able to search, browse, and get AI-powered explanations for all VAG vehicle error codes.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-white mb-2">1000+</div>
                <div className="text-dark-400">Error Codes</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-white mb-2">6</div>
                <div className="text-dark-400">VAG Brands</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-white/5">
                <div className="text-2xl font-bold text-white mb-2">AI</div>
                <div className="text-dark-400">Explanations</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorCodes;
