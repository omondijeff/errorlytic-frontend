import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Search, Database, BookOpen, Zap } from 'lucide-react';

const ErrorCodes: React.FC = () => {
  const stats = [
    { label: 'Error Codes', value: '1000+', icon: Database, color: 'from-red-500 to-red-700' },
    { label: 'VAG Brands', value: '6', icon: BookOpen, color: 'from-blue-500 to-blue-700' },
    { label: 'AI Explanations', value: 'AI', icon: Zap, color: 'from-green-500 to-green-700' }
  ];

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
          <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>VAG Culture Error Database</h1>
          <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
            Exclusive access to our comprehensive Volkswagen Group error code database with AI-powered explanations and community repair guidance.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <Search className="w-10 h-10 absolute left-4 top-1/2 transform -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }} />
              <input
                type="text"
                placeholder="Search error codes, symptoms, or vehicle models..."
                className="input-field w-full pl-14 pr-4 text-lg"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="glass-card p-6 text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <div className="glass-card p-12 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Coming Soon!</h2>
            <p style={{ color: 'var(--text-secondary)' }} className="mb-6">
              The comprehensive VAG error code database is currently under development. 
              You'll soon have access to thousands of error codes with AI-powered explanations, 
              repair procedures, and cost estimates.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Volkswagen
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Audi
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Porsche
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Skoda
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Seat
              </span>
              <span className="px-3 py-1 rounded-full text-sm" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                color: 'var(--accent-primary)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}>
                Fiat
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ErrorCodes;
