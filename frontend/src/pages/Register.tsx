import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Eye, EyeOff, ArrowLeft, CheckCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    company: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { register, error } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.firstName) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.company) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (err) {
      // Error is handled by the auth context
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 py-8" style={{ 
      background: 'linear-gradient(135deg, var(--bg-primary), var(--bg-secondary))'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-4" style={{ 
            color: 'var(--text-tertiary)'
          }}>
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          
          <div className="w-20 h-20 mx-auto mb-6" style={{ 
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img 
              src={theme === 'dark' ? "/logos/logo_light.png" : "/logos/logo_dark.png"} 
              alt="VAGnosis Logo" 
              className="w-16 h-16 object-contain"
            />
          </div>
          
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Join VAG Culture Hub</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Become part of Kenya's exclusive VAG car community</p>
        </div>

        {/* Registration Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="glass-card p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={`input-field w-full ${errors.firstName ? 'border-red-500' : ''}`}
                  placeholder="Enter first name"
                  required
                />
                {errors.firstName && (
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={`input-field w-full ${errors.lastName ? 'border-red-500' : ''}`}
                  placeholder="Enter last name"
                  required
                />
                {errors.lastName && (
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
                placeholder="Enter your email"
                required
              />
              {errors.email && (
                <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.email}</p>
              )}
            </div>

            {/* Company Field */}
            <div>
              <label htmlFor="company" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Company Name *
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className={`input-field w-full ${errors.company ? 'border-red-500' : ''}`}
                placeholder="Enter company name"
                required
              />
              {errors.company && (
                <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.company}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                Phone Number *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`input-field w-full ${errors.phone ? 'border-red-500' : ''}`}
                placeholder="Enter phone number"
                required
              />
              {errors.phone && (
                <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.phone}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`input-field w-full pr-12 ${errors.password ? 'border-red-500' : ''}`}
                    placeholder="Enter password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`input-field w-full pr-12 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm mt-1" style={{ color: 'var(--accent-primary)' }}>{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 rounded-lg" style={{ 
                background: 'rgba(220, 38, 38, 0.1)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                color: 'var(--accent-primary)'
              }}>
                {error}
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              className="glass-button w-full"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </motion.button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--border-primary)' }} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4" style={{ color: 'var(--text-tertiary)' }}>or</span>
              </div>
            </div>

            {/* Links */}
            <div className="text-center space-y-2">
              <p style={{ color: 'var(--text-secondary)' }}>
                Already have an account?{' '}
                <Link to="/login" className="font-medium" style={{ color: 'var(--accent-primary)' }}>
                  Sign in here
                </Link>
              </p>
              <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
