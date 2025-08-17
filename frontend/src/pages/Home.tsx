import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  Car, 
  FileText, 
  AlertTriangle, 
  Zap, 
  Shield, 
  Users, 
  TrendingUp,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const { theme } = useTheme();

  const features = [
    {
      icon: Car,
      title: 'VAG Culture Diagnostics',
      description: 'Exclusive diagnostic tools for Volkswagen, Audi, Porsche, Skoda, Seat, and Fiat vehicles',
      color: 'from-primary-500 to-primary-700'
    },
    {
      icon: FileText,
      title: 'Community Quotations',
      description: 'AI-powered repair estimates in Kenya Shillings with community-verified accuracy',
      color: 'from-red-500 to-red-700'
    },
    {
      icon: AlertTriangle,
      title: 'VAG Culture Error Database',
      description: 'Exclusive access to our comprehensive VAG error code library with AI explanations',
      color: 'from-orange-500 to-orange-700'
    },
    {
      icon: Zap,
      title: 'VCDS Report Processing',
      description: 'Upload and analyze VCDS diagnostic reports with community insights',
      color: 'from-yellow-500 to-yellow-700'
    },
    {
      icon: Shield,
      title: 'Members-Only Security',
      description: 'Exclusive access with enterprise-grade security for VAG Culture members',
      color: 'from-green-500 to-green-700'
    },
    {
      icon: Users,
      title: 'VAG Culture Community',
      description: 'Connect with fellow VAG enthusiasts, mechanics, and garage owners',
      color: 'from-blue-500 to-blue-700'
    }
  ];

  const stats = [
    { label: 'VAG Models', value: '6+', icon: Car, color: 'from-blue-500 to-blue-700' },
    { label: 'Error Codes', value: '1000+', icon: AlertTriangle, color: 'from-orange-500 to-orange-700' },
    { label: 'Users', value: '50+', icon: Users, color: 'from-green-500 to-green-700' },
    { label: 'Quotations', value: '100+', icon: FileText, color: 'from-purple-500 to-purple-700' }
  ];

  return (
    <div className="pt-16 min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0" style={{ 
          background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
        }}>
          <div className="absolute inset-0" style={{ 
            background: 'radial-gradient(circle at 50% 50%, rgba(220,38,38,0.1), transparent 50%)' 
          }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-8 flex justify-center"
            >
              <img 
                src={theme === 'dark' ? "/logos/logo_light.png" : "/logos/logo_dark.png"} 
                alt="DeQuote Logo" 
                className="h-24 w-auto drop-shadow-2xl"
              />
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">VAG Culture Hub</span>
              <br />
              <span style={{ color: 'var(--text-primary)' }}>Exclusive VAG Diagnostics</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ color: 'var(--text-secondary)' }}
            >
              Welcome to the exclusive VAG Culture community platform. 
              Get AI-powered repair estimates, access our comprehensive error code database, 
              and connect with fellow VAG enthusiasts in Kenya.
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {user ? (
                <Link to="/dashboard" className="glass-button text-lg px-8 py-4">
                  Go to Dashboard
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="glass-button text-lg px-8 py-4">
                    Join VAG Culture Hub
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                  <Link to="/login" className="glass-button-secondary text-lg px-8 py-4">
                    Member Sign In
                  </Link>
                </>
              )}
            </motion.div>

            {/* Community Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full"
              style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)'
              }}
            >
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-primary)' }}></span>
              <span className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                Exclusive to VAG Culture Members
              </span>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-primary-500/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-tr from-red-500/20 to-transparent rounded-full blur-3xl"
        />
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                  className="glass-card p-8 text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Powerful Features for VAG Professionals
            </h2>
            <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Everything you need to manage car quotations, diagnose issues, and provide professional estimates.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-8 card-hover"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-secondary)' }} className="leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Ready to Join the VAG Culture Community?
            </h2>
            <p className="text-xl mb-8" style={{ color: 'var(--text-secondary)' }}>
              Become part of Kenya's premier VAG car community. Access exclusive tools, 
              connect with fellow enthusiasts, and elevate your VAG diagnostics game.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link to="/quotations/create" className="glass-button text-lg px-8 py-4">
                  Create New Quotation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              ) : (
                <Link to="/register" className="glass-button text-lg px-8 py-4">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
