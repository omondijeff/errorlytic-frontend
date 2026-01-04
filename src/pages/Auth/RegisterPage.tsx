import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, StarIcon, ShieldCheckIcon, UserIcon } from '@heroicons/react/24/outline';
import { setCredentials } from '../../store/slices/authSlice';
import { useRegisterMutation } from '../../services/api';
import type { RootState } from '../../store';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  phone: yup.string().min(10, 'Phone number must be at least 10 digits').required('Phone is required'),
  role: yup.string().oneOf(['individual', 'garage_user', 'garage_admin', 'insurer_user', 'insurer_admin']).required('Role is required'),
});

type FormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await registerMutation(data).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }));
      navigate('/app/dashboard', { replace: true });
    } catch (error: any) {
      console.error('Registration failed:', error);
    }
  };

  const roles = [
    { value: 'individual', label: 'Individual User', description: 'Personal vehicle diagnostics' },
    { value: 'garage_user', label: 'Garage User', description: 'Works at a repair garage' },
    { value: 'garage_admin', label: 'Garage Admin', description: 'Manages a repair garage' },
    { value: 'insurer_user', label: 'Insurer User', description: 'Works at an insurance company' },
    { value: 'insurer_admin', label: 'Insurer Admin', description: 'Manages insurance operations' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      {isLoading && <LoadingSpinner />}
      
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding & Features */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:block space-y-8"
        >
          {/* Logo & Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-2xl flex items-center justify-center shadow-tajilabs-lg">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 font-sf-pro">Errorlytic</h1>
                <p className="text-lg text-gray-600 font-sf-pro-text">by Tajilabs</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 font-sf-pro-text leading-relaxed">
              Join thousands of automotive professionals using AI-powered diagnostics
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center">
                <StarIcon className="h-6 w-6 text-tajilabs-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">AI-Powered Analysis</h3>
                <p className="text-gray-600 font-sf-pro-text">Get instant, accurate error code interpretations</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center">
                <UserIcon className="h-6 w-6 text-tajilabs-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">Multi-Role Support</h3>
                <p className="text-gray-600 font-sf-pro-text">Perfect for individuals, garages, and insurers</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-tajilabs-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">Enterprise Security</h3>
                <p className="text-gray-600 font-sf-pro-text">Bank-level security for your diagnostic data</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="bg-gradient-to-r from-tajilabs-primary/5 to-tajilabs-secondary/5 rounded-2xl p-6 border border-tajilabs-primary/10">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-sf-pro">Why Choose Errorlytic?</h3>
            <ul className="space-y-2 text-gray-700 font-sf-pro-text">
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-tajilabs-primary rounded-full"></div>
                <span>Free trial with no credit card required</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-tajilabs-primary rounded-full"></div>
                <span>24/7 customer support</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-tajilabs-primary rounded-full"></div>
                <span>Multi-currency billing support</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Right Side - Registration Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-tajilabs-lg border border-gray-200/50 p-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center space-x-3">
                <div className="h-12 w-12 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-xl flex items-center justify-center shadow-tajilabs">
                  <span className="text-white font-bold text-xl">E</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 font-sf-pro">Errorlytic</h1>
                  <p className="text-sm text-gray-600 font-sf-pro-text">by Tajilabs</p>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 font-sf-pro mb-2">Create Account</h2>
              <p className="text-gray-600 font-sf-pro-text">Join Errorlytic and start diagnosing smarter</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 placeholder-gray-500 font-sf-pro-text"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 placeholder-gray-500 font-sf-pro-text"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 placeholder-gray-500 font-sf-pro-text"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.phone.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Account Type
                </label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-4 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 font-sf-pro-text"
                >
                  <option value="">Select your role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.role.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 placeholder-gray-500 font-sf-pro-text"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 font-sf-pro-text">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-tajilabs-primary focus:border-tajilabs-primary transition-all duration-200 text-gray-900 placeholder-gray-500 font-sf-pro-text"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600 font-sf-pro-text">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-tajilabs-primary focus:ring-tajilabs-primary border-gray-300 rounded mt-1"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-700 font-sf-pro-text">
                  I agree to the{' '}
                  <a href="#" className="font-semibold text-tajilabs-primary hover:text-tajilabs-secondary transition-colors">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#" className="font-semibold text-tajilabs-primary hover:text-tajilabs-secondary transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-sf-pro-text"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </motion.button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 font-sf-pro-text">
                Already have an account?{' '}
                <a href="/login" className="font-semibold text-tajilabs-primary hover:text-tajilabs-secondary transition-colors">
                  Sign in here
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-xs text-gray-500 font-sf-pro-text">
              © 2024 Tajilabs. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;