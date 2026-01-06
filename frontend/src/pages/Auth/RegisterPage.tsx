import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { setCredentials } from '../../store/slices/authSlice';
import { useRegisterMutation } from '../../services/api';
import type { RootState } from '../../store';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import PublicLayout from '../../components/Layout/PublicLayout';
import axios from 'axios';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
    .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .matches(/[0-9]/, 'Password must contain at least one number')
    .required('Password is required'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords must match').required('Confirm password is required'),
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  phone: yup.string().min(10, 'Phone number must be at least 10 digits').required('Phone is required'),
  role: yup.string().oneOf(['individual', 'garage_user', 'garage_admin', 'insurer_user', 'insurer_admin']).required('Role is required'),
});

type FormData = yup.InferType<typeof schema>;

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerMutation, { isLoading }] = useRegisterMutation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  // Redirect if already authenticated (unless processing OAuth callback)
  useEffect(() => {
    const code = searchParams.get('code');
    if (isAuthenticated && !code) {
      navigate('/app/dashboard', { replace: true });
    }
  }, [isAuthenticated, user, navigate, searchParams]);

  // Handle OAuth callback for Google sign-up
  useEffect(() => {
    const handleGoogleCallback = async () => {
      const code = searchParams.get('code');
      if (!code) return;

      try {
        setIsGoogleLoading(true);

        // Exchange authorization code for tokens via backend
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:7337';
        const response = await axios.post(`${apiUrl}/api/v1/auth/google/callback`, {
          code,
          redirectUri: `${window.location.origin}/register`,
        });

        // Set credentials in Redux store
        dispatch(setCredentials({
          user: response.data.data.user,
          token: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        }));

        // Redirect to dashboard
        navigate('/app/dashboard', { replace: true });
      } catch (error: any) {
        console.error('Google sign up failed:', error);
        setIsGoogleLoading(false);
        // Remove code from URL
        navigate('/register', { replace: true });
      }
    };

    handleGoogleCallback();
  }, [searchParams, dispatch, navigate]);

  const handleGoogleSignUp = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/register`;
    const scope = 'openid email profile';

    // Redirect to Google OAuth
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${clientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=code&` +
      `scope=${encodeURIComponent(scope)}&` +
      `access_type=offline&` +
      `prompt=select_account`;

    window.location.href = googleAuthUrl;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      // Restructure data to match backend API expectations
      const registrationData = {
        email: data.email,
        password: data.password,
        profile: {
          name: data.name,
          phone: data.phone,
        },
        role: data.role,
      };
      const result = await registerMutation(registrationData).unwrap();
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
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        {isLoading && <LoadingSpinner />}

        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
              <p className="text-gray-400">Join Errorlytic and start diagnosing smarter</p>
            </div>

            {!showEmailForm ? (
              <div className="space-y-6">
                {/* Google Sign Up Button */}
                <button
                  onClick={handleGoogleSignUp}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-800 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                        <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                        <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                        <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                      </svg>
                      <span>Continue with Google</span>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-700"></div>
                  <span className="px-4 text-sm text-gray-500">or</span>
                  <div className="flex-1 border-t border-gray-700"></div>
                </div>

                {/* Email Option */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full px-6 py-3.5 bg-transparent border border-gray-700 hover:border-gray-600 text-white rounded-full font-medium transition-all duration-300 hover:bg-gray-800/50"
                >
                  Continue with Email
                </button>
              </div>
            ) : (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* Name Field */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  autoComplete="email"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Field */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  type="tel"
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>

              {/* Role Selection */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">
                  Account Type
                </label>
                <select
                  {...register('role')}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                >
                  <option value="" className="bg-gray-900">Select your role</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value} className="bg-gray-900">
                      {role.label}
                    </option>
                  ))}
                </select>
                {errors.role && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.role.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 pr-12 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-500 hover:text-gray-300 transition-colors" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1.5 text-sm text-red-400">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 mt-0.5 bg-gray-800 border-gray-700 rounded text-[#EA6A47] focus:ring-[#EA6A47] focus:ring-offset-gray-900"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-[#EA6A47] hover:text-[#d85a37] transition-colors">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-[#EA6A47] hover:text-[#d85a37] transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
                className="w-full bg-[#EA6A47] hover:bg-[#d85a37] text-white py-3.5 px-6 rounded-full font-medium text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                className="w-full text-sm text-gray-400 hover:text-white transition-colors"
              >
                Back to other options
              </button>
            </form>
            )}

            {/* Sign In Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Already have an account?{' '}
                <Link to="/login" className="text-[#EA6A47] hover:text-[#d85a37] font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default RegisterPage;
