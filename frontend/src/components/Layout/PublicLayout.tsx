import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo-web-landscape.png';

interface PublicLayoutProps {
  children: React.ReactNode;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/how-it-works', label: 'How it works' },
    { to: '/who-is-it-for', label: 'Who is it for' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button + Logo */}
            <div className="flex items-center gap-4">
              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>

              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img src={logo} alt="Errorlytic Logo" className="h-8 w-auto object-contain" />
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`transition-colors border-b-2 pb-1 ${location.pathname === link.to
                    ? 'text-white border-[#EA6A47]'
                    : 'text-gray-300 border-transparent hover:text-white hover:border-[#EA6A47]'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Sign In Button */}
            <button
              onClick={() => navigate('/login')}
              className="bg-[#EA6A47] hover:bg-[#d85a37] text-white px-6 sm:px-8 py-2.5 rounded-full font-medium transition-colors text-sm sm:text-base"
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${location.pathname === link.to
                    ? 'bg-[#EA6A47]/10 text-[#EA6A47]'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 border-t border-gray-800">
                <button
                  onClick={() => {
                    navigate('/register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                >
                  Create Account
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-gray-800/50">
        <div className="w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Top Section */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              {/* Brand */}
              <div className="md:col-span-2">
                <Link to="/" className="mb-4 block">
                  <img src={logo} alt="Errorlytic Logo" className="h-8 w-auto object-contain" />
                </Link>
                <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-4">
                  AI-powered automotive diagnostic platform that transforms VCDS reports into actionable insights for mechanics and automotive professionals.
                </p>
                <p className="text-gray-500 text-sm">
                  A product of{' '}
                  <a
                    href="https://tajilabs.co.ke"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#EA6A47] hover:text-[#d85a37] transition-colors"
                  >
                    Tajilabs Kenya
                  </a>
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-white font-semibold mb-4">Quick Links</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">
                      How it Works
                    </Link>
                  </li>
                  <li>
                    <Link to="/who-is-it-for" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Who is it for
                    </Link>
                  </li>
                  <li>
                    <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="text-white font-semibold mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors text-sm">
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-8 border-t border-gray-800/50 flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-500 text-sm">
                © {new Date().getFullYear()} Errorlytic. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <a
                  href="https://tajilabs.co.ke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-400 transition-colors text-sm"
                >
                  tajilabs.co.ke
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
