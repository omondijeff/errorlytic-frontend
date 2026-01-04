import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HomeIcon, ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* 404 Animation */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="h-32 w-32 bg-gradient-to-br from-tajilabs-primary to-tajilabs-secondary rounded-3xl flex items-center justify-center mx-auto shadow-tajilabs-lg">
              <ExclamationTriangleIcon className="h-16 w-16 text-white" />
            </div>
            
            {/* Floating elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 h-8 w-8 bg-tajilabs-secondary rounded-full opacity-60"
            />
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-4 -left-4 h-6 w-6 bg-tajilabs-primary rounded-full opacity-60"
            />
          </motion.div>

          {/* Error Message */}
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-6xl font-bold text-gray-900 font-sf-pro"
            >
              404
            </motion.h1>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-3xl font-bold text-gray-800 font-sf-pro"
            >
              Page Not Found
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="text-lg text-gray-600 font-sf-pro-text max-w-md mx-auto"
            >
              Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or doesn't exist.
            </motion.p>
          </div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-tajilabs-primary to-tajilabs-secondary text-white px-8 py-4 rounded-xl font-semibold shadow-tajilabs hover:shadow-tajilabs-lg transition-all duration-200 font-sf-pro-text"
              >
                <HomeIcon className="h-5 w-5" />
                <span>Go Home</span>
              </Link>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <button
                onClick={() => window.history.back()}
                className="inline-flex items-center space-x-2 bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200 font-sf-pro-text"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Go Back</span>
              </button>
            </motion.div>
          </motion.div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-tajilabs border border-gray-200/50 p-6 mt-12"
          >
            <h3 className="text-lg font-semibold text-gray-900 font-sf-pro mb-4">Need Help?</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 font-sf-pro-text">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Check the URL</h4>
                <p>Make sure the web address is spelled correctly</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Go to Dashboard</h4>
                <p>Return to your main dashboard to continue</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Contact Support</h4>
                <p>If the problem persists, contact our support team</p>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500 font-sf-pro-text">
              © 2024 Tajilabs. All rights reserved.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;