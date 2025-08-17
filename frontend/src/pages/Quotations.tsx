import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quotations: React.FC = () => {
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
            <FileText className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Quotations</h1>
          <p className="text-xl text-dark-300 mb-8">
            Manage your VAG car repair quotations and estimates
          </p>
          
          <Link to="/quotations/create" className="glass-button inline-flex items-center space-x-2">
            <Plus className="w-5 h-5" />
            <span>Create New Quotation</span>
          </Link>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="glass-card p-12">
            <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon!</h2>
            <p className="text-dark-300">
              The quotations management system is being developed. You'll be able to view, edit, and manage all your car repair quotations here.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotations;
