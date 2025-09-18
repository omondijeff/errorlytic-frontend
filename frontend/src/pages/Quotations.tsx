import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Search, Filter, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Quotations: React.FC = () => {
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
          <div className="w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6" style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
          }}>
            <FileText className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>VAG Culture Quotations</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Manage and track all your VAG car repair quotations with community insights and AI-powered estimates.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/quotations/create" className="glass-button">
              <Plus className="w-5 h-5" />
              Create New Quote
            </Link>
            <button className="glass-button-secondary">
              <Search className="w-5 h-5" />
              Search Quotes
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
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Coming Soon!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>
              The quotations management system is currently under development. 
              You'll soon be able to create, track, and manage all your VAG car repair quotes here.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Quotations;
