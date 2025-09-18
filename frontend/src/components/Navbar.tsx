import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, Home, Car, Users, FileText, AlertTriangle, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Dashboard', path: '/dashboard', icon: User, requiresAuth: true },
    { name: 'Quotations', path: '/quotations', icon: FileText, requiresAuth: true },
    { name: 'Error Codes', path: '/error-codes', icon: AlertTriangle, requiresAuth: true },
    { name: 'Create Quote', path: '/quotations/create', icon: Plus, requiresAuth: true },
    { name: 'Community', path: '/community', icon: Users },
  ];

  const filteredNavItems = navItems.filter(item => !item.requiresAuth || user);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full" style={{
      background: theme === 'dark' ? 'rgba(15, 15, 15, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(20px)',
      borderBottom: theme === 'dark' ? '1px solid rgba(255, 0, 0, 0.1)' : '1px solid rgba(255, 0, 0, 0.05)'
    }}>
      <div className="w-full px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center group">
              <div className="w-24 h-24 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110">
                <img
                  src={theme === 'dark' ? '/logos/logo_light.png' : '/logos/logo_dark.png'}
                  alt="VAG Culture Hub"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2 flex-1 justify-center">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 px-5 py-2 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <Icon className="w-4 h-4 transition-colors duration-200 group-hover:text-red-400" />
                  <span className="font-medium group-hover:text-white transition-colors duration-200">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {/* User Menu or Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Avatar */}
                <div className="hidden sm:flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-white/5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                  }}>
                    {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden md:block">
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      {user.firstName || 'User'}
                    </div>
                    <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {user.company || 'VAG Member'}
                    </div>
                  </div>
                </div>
                
                {/* User Actions */}
                <div className="hidden sm:flex items-center space-x-2">
                  <button className="p-2 rounded-lg transition-all duration-200 hover:bg-white/5" style={{ color: 'var(--text-secondary)' }}>
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden md:block text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg transition-all duration-200 hover:bg-white/5"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    color: 'white'
                  }}
                >
                  Join VAG Culture
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg transition-all duration-200 hover:bg-white/5"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="lg:hidden overflow-hidden"
            style={{ background: 'var(--bg-secondary)' }}
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Items */}
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5 group"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <Icon className="w-5 h-5 transition-colors duration-200 group-hover:text-red-400" />
                    <span className="font-medium group-hover:text-white transition-colors duration-200">
                      {item.name}
                    </span>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              {!user ? (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-white/5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200"
                    style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                      color: 'white'
                    }}
                  >
                    Join VAG Culture
                  </Link>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="flex items-center space-x-3 px-4 py-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white" style={{
                      background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
                    }}>
                      {user.firstName?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                        {user.firstName || 'User'}
                      </div>
                      <div className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                        {user.company || 'VAG Member'}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-lg transition-all duration-200 hover:bg-red-500/10 hover:text-red-400"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
