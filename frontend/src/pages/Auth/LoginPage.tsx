import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon, StarIcon, ShieldCheckIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';
import { setCredentials } from '../../store/slices/authSlice';
import { useLoginMutation } from '../../services/api';
import AnimatedBackground from '../../components/UI/AnimatedBackground';
import ModernInput from '../../components/UI/ModernInput';
import ModernButton from '../../components/UI/ModernButton';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

type FormData = yup.InferType<typeof schema>;

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();

  const from = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }));
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <AnimatedBackground variant="mesh" intensity="subtle" />
      
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
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
              <div className="h-16 w-16 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-2xl flex items-center justify-center shadow-tajilabs-lg animate-engine-start">
                <span className="text-white font-bold text-2xl">E</span>
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 font-sf-pro">Errorlytic</h1>
                <p className="text-lg text-gray-600 font-sf-pro-text">by Tajilabs</p>
              </div>
            </div>
            <p className="text-xl text-gray-700 font-sf-pro-text leading-relaxed">
              Advanced automotive diagnostic platform with AI-powered error code analysis
            </p>
          </div>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center animate-diagnostic-scan">
                <StarIcon className="h-6 w-6 text-tajilabs-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">AI-Powered Analysis</h3>
                <p className="text-gray-600 font-sf-pro-text">Intelligent error code interpretation using advanced machine learning</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 bg-tajilabs-primary/10 rounded-xl flex items-center justify-center animate-success-check">
                <ShieldCheckIcon className="h-6 w-6 text-tajilabs-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 font-sf-pro">Enterprise Security</h3>
                <p className="text-gray-600 font-sf-pro-text">Multi-tenant architecture with role-based access control</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-tajilabs-primary font-sf-pro">10K+</div>
              <div className="text-sm text-gray-600 font-sf-pro-text">Analyses</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tajilabs-primary font-sf-pro">500+</div>
              <div className="text-sm text-gray-600 font-sf-pro-text">Garages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-tajilabs-primary font-sf-pro">99.9%</div>
              <div className="text-sm text-gray-600 font-sf-pro-text">Uptime</div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
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
              <h2 className="text-3xl font-bold text-gray-900 font-sf-pro mb-2">Welcome Back</h2>
              <p className="text-gray-600 font-sf-pro-text">Sign in to your account to continue</p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <ModernInput
                {...register('email')}
                type="email"
                label="Email Address"
                icon={<EnvelopeIcon className="h-5 w-5" />}
                variant="floating"
                error={errors.email?.message}
                placeholder="Enter your email"
              />

              {/* Password Field */}
              <ModernInput
                {...register('password')}
                type="password"
                label="Password"
                icon={<LockClosedIcon className="h-5 w-5" />}
                variant="floating"
                showPasswordToggle
                error={errors.password?.message}
                placeholder="Enter your password"
              />

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-tajilabs-primary focus:ring-tajilabs-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 font-sf-pro-text">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="#" className="font-semibold text-tajilabs-primary hover:text-tajilabs-secondary transition-colors font-sf-pro-text">
                    Forgot password?
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <ModernButton
                type="submit"
                variant="gradient"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mt-6"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </ModernButton>
            </form>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 font-sf-pro-text">
                Don't have an account?{' '}
                <a href="/register" className="font-semibold text-tajilabs-primary hover:text-tajilabs-secondary transition-colors">
                  Sign up here
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

export default LoginPage;