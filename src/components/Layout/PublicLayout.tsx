import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="w-full px-8 lg:px-16 xl:px-24 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold text-white">
              Errorlytic
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                to="/"
                className={`transition-colors border-b-2 pb-1 ${
                  location.pathname === '/'
                    ? 'text-white border-[#EA6A47]'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-[#EA6A47]'
                }`}
              >
                Home
              </Link>
              <Link
                to="/how-it-works"
                className={`transition-colors border-b-2 pb-1 ${
                  location.pathname === '/how-it-works'
                    ? 'text-white border-[#EA6A47]'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-[#EA6A47]'
                }`}
              >
                How it works
              </Link>
              <Link
                to="/who-is-it-for"
                className={`transition-colors border-b-2 pb-1 ${
                  location.pathname === '/who-is-it-for'
                    ? 'text-white border-[#EA6A47]'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-[#EA6A47]'
                }`}
              >
                Who is it for
              </Link>
            </div>

            {/* Sign In Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-[#EA6A47] hover:bg-[#d85a37] text-white px-8 py-2.5 rounded-full font-medium transition-colors"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black py-8 mt-20">
        <div className="w-full px-8 lg:px-16 xl:px-24">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2026 Errorlytic. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
