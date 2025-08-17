import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  FileText, 
  AlertTriangle, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  Plus,
  BarChart3,
  Users
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/community', label: 'Community', icon: Users, protected: true },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3, protected: true },
    { path: '/quotations', label: 'Quotations', icon: FileText, protected: true },
    { path: '/quotations/create', label: 'New Quote', icon: Plus, protected: true },
    { path: '/error-codes', label: 'Error Codes', icon: AlertTriangle, protected: true },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ 
      background: 'var(--bg-secondary)', 
      borderBottom: '1px solid var(--border-primary)',
      backdropFilter: 'blur(20px)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center"
            >
              <img 
                src={theme === 'dark' ? "/logos/logo_light.png" : "/logos/logo_dark.png"} 
                alt="DeQuote Logo" 
                className="h-10 w-auto"
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">VAG Culture Hub</h1>
              <div className="flex items-center space-x-2">
                <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>Exclusive VAG Diagnostics</p>
                <span className="px-2 py-1 text-xs font-medium rounded-full" style={{ 
                  background: 'rgba(220, 38, 38, 0.1)',
                  color: 'var(--accent-primary)',
                  border: '1px solid rgba(220, 38, 38, 0.3)'
                }}>
                  Members Only
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              if (item.protected && !user) return null;
              
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-2 ${
                    isActive(item.path) ? 'text-primary-400' : ''
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <ThemeToggle />
            
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span style={{ color: 'var(--text-secondary)' }}>{user.firstName}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="glass-button-secondary flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="glass-button-secondary">
                  Login
                </Link>
                <Link to="/register" className="glass-button">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ 
                color: 'var(--text-tertiary)',
                background: 'transparent'
              }}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="md:hidden overflow-hidden"
        style={{ 
          background: 'var(--bg-tertiary)',
          borderTop: '1px solid var(--border-primary)'
        }}
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item) => {
            if (item.protected && !user) return null;
            
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'border border-primary-500/30'
                    : ''
                }`}
                style={{
                  background: isActive(item.path) ? 'rgba(220, 38, 38, 0.1)' : 'transparent',
                  color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-tertiary)'
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </motion.div>
    </nav>
  );
};

export default Navbar;
