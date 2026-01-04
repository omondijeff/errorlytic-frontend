import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation, Link, useSearchParams } from 'react-router-dom';
import { setCredentials } from '../../store/slices/authSlice';
import { useLoginMutation } from '../../services/api';
import type { RootState } from '../../store';
import axios from 'axios';

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50 transition-all duration-300">
        <div className="w-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-2xl font-bold text-[#EA6A47] hover:text-[#d85a37] transition-all duration-300 transform hover:scale-105">
              Errorlytic
            </Link>
            <span className="text-sm text-gray-600">Sign in</span>
          </div>
          <Link to="/" className="text-sm text-black underline hover:text-gray-700 transition-all duration-200 hover:scale-105">
            view the VCDS reports site
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 pt-24 pb-20">
        <div className="w-full max-w-md text-center space-y-6">
          {/* Welcome Heading */}
          <h1 className="text-5xl font-bold text-black mb-2 animate-fade-in-up">WELCOME!</h1>
          <p className="text-gray-700 text-sm mb-8 animate-fade-in-up animation-delay-100">
            Create an account or login to upload reports
          </p>

          {!showEmailForm ? (
            <>
              {/* Google Sign In Button - Redirect based flow (no popup) */}
              <button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                className="w-full max-w-sm mx-auto flex items-center justify-center space-x-3 px-6 py-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 hover:border-gray-400 hover:shadow-md transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGoogleLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-gray-700 font-medium">Signing in...</span>
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9.003 18z" fill="#34A853"/>
                      <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
                    </svg>
                    <span className="text-gray-700 font-medium">Sign in with google</span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center justify-center space-x-2 my-6">
                <span className="text-gray-600 text-sm">or continue with</span>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="text-[#EA6A47] text-sm font-semibold hover:underline transition-all duration-200 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-[#EA6A47] hover:after:w-full after:transition-all after:duration-300"
                >
                  Email
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4 max-w-sm mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-[1.01] bg-white"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EA6A47] focus:border-transparent transition-all duration-300 hover:border-gray-400 focus:scale-[1.01] bg-white"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-3 bg-[#EA6A47] text-white rounded-full font-medium hover:bg-[#d85a37] hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
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
                    'Sign in'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmailForm(false)}
                  className="text-sm text-gray-600 hover:text-gray-900 hover:underline transition-all duration-200 hover:scale-105"
                >
                  Back to other options
                </button>
              </form>
            </>
          )}

          {/* Terms & Privacy */}
          <p className="text-xs text-gray-600 mt-6 max-w-sm mx-auto">
            By continuing you agree with Errorlytic{' '}
            <Link to="/conditions" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
              conditions of use
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
              privacy terms
            </Link>
          </p>

          {/* Stay Signed In */}
          <div className="flex items-center justify-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="stay-signed-in"
              checked={staySignedIn}
              onChange={(e) => setStaySignedIn(e.target.checked)}
              className="h-4 w-4 text-[#EA6A47] focus:ring-[#EA6A47] focus:ring-offset-2 border-gray-300 rounded transition-all duration-200 cursor-pointer hover:border-[#EA6A47]"
            />
            <label htmlFor="stay-signed-in" className="text-sm text-gray-700 cursor-pointer hover:text-gray-900 transition-colors duration-200">
              Stay signed in
            </label>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 transition-all duration-300">
        <div className="w-full px-8 flex items-center justify-between">
          <span className="text-sm text-black font-medium">Errorlytic @2026</span>
          <div className="flex items-center space-x-6">
            <Link to="/conditions" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 hover:scale-105">
              Conditions of use
            </Link>
            <Link to="/privacy" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 hover:scale-105">
              Privacy terms
            </Link>
            <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 hover:scale-105">
              Cookies
            </Link>
            <Link to="/user-agreements" className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-all duration-200 hover:scale-105">
              User agreements
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LoginPage;