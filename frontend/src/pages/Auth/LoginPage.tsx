import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { setCredentials } from '../../store/slices/authSlice';
import { useLoginMutation } from '../../services/api';
import type { RootState } from '../../store';
import axios from 'axios';
import PublicLayout from '../../components/Layout/PublicLayout';

const LoginPage: React.FC = () => {
  const [staySignedIn, setStaySignedIn] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);

  const from = location.state?.from?.pathname || '/app/dashboard';

  // Redirect if already authenticated (unless processing OAuth callback)
  useEffect(() => {
    const code = searchParams.get('code');
    // Only redirect if authenticated and not processing OAuth callback
    if (isAuthenticated && !code) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, from, searchParams]);

  // Handle OAuth callback
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
          redirectUri: `${window.location.origin}/login`,
        });

        // Set credentials in Redux store
        dispatch(setCredentials({
          user: response.data.data.user,
          token: response.data.data.accessToken,
          refreshToken: response.data.data.refreshToken,
        }));

        // Redirect to dashboard (unified for all roles)
        navigate(from, { replace: true });
      } catch (error: any) {
        console.error('Google sign in failed:', error);
        setIsGoogleLoading(false);
        // Remove code from URL
        navigate('/login', { replace: true });
      }
    };

    handleGoogleCallback();
  }, [searchParams, dispatch, navigate, from]);

  const handleGoogleSignIn = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri = `${window.location.origin}/login`;
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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      dispatch(setCredentials({
        user: result.data.user,
        token: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      }));
      // Redirect to dashboard (unified for all roles)
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);
    }
  };

  return (
    <PublicLayout>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-800 p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
              <p className="text-gray-400">Sign in to access your dashboard</p>
            </div>

            {!showEmailForm ? (
              <div className="space-y-6">
                {/* Google Sign In Button */}
                <button
                  onClick={handleGoogleSignIn}
                  disabled={isGoogleLoading}
                  className="w-full flex items-center justify-center space-x-3 px-6 py-3.5 bg-white hover:bg-gray-100 text-gray-800 rounded-full font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isGoogleLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
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
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all"
                  />
                </div>

                {/* Stay Signed In */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="stay-signed-in"
                      checked={staySignedIn}
                      onChange={(e) => setStaySignedIn(e.target.checked)}
                      className="h-4 w-4 bg-gray-800 border-gray-700 rounded text-[#EA6A47] focus:ring-[#EA6A47] focus:ring-offset-gray-900"
                    />
                    <label htmlFor="stay-signed-in" className="ml-2 text-sm text-gray-400">
                      Stay signed in
                    </label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-[#EA6A47] hover:text-[#d85a37] transition-colors">
                    Forgot password?
                  </Link>
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isLoading}
                  className="w-full bg-[#EA6A47] hover:bg-[#d85a37] text-white py-3.5 px-6 rounded-full font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center space-x-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Signing in...</span>
                    </span>
                  ) : (
                    'Sign In'
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

            {/* Terms */}
            <p className="text-xs text-gray-500 text-center mt-6">
              By continuing, you agree to our{' '}
              <Link to="/terms-of-service" className="text-[#EA6A47] hover:text-[#d85a37]">
                Terms
              </Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="text-[#EA6A47] hover:text-[#d85a37]">
                Privacy Policy
              </Link>
            </p>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#EA6A47] hover:text-[#d85a37] font-medium transition-colors">
                  Create one
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
