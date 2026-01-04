import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Errorlytic',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: 'AI-powered automotive diagnostic platform that transforms VCDS diagnostic files into actionable insights for mechanics and automotive professionals.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '127',
    },
  };

  // Animation variants for staggered hero content
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Errorlytic - AI-Powered Automotive Diagnostics Platform"
        description="Transform VCDS diagnostic files into actionable insights with AI. Errorlytic helps mechanics, workshops, and automotive professionals diagnose vehicle issues faster and more accurately."
        keywords="automotive diagnostics, VCDS analysis, vehicle diagnostics, AI diagnostics, car repair, automotive AI, diagnostic tool, vehicle analysis, mechanic software, auto workshop"
        canonicalUrl="https://errorlytic.com/"
        structuredData={structuredData}
      />
      <PublicLayout>
      {/* Hero Section - Matching Figma Design Exactly */}
      <section
        className="relative h-screen overflow-hidden bg-black bg-fixed bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/images/bg-vag.jpg')",
        }}
      >
        {/* Fallback gradient if image not loaded */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black -z-10"></div>

        {/* Spotlight effect from top - creates the studio lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-gradient-radial from-white/15 via-transparent to-transparent blur-3xl pointer-events-none"></div>

        {/* Ground shadow/reflection effect - darkens the bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"></div>

        {/* Left side dark gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent pointer-events-none"></div>

        {/* Content Overlay */}
        <div className="relative z-10 h-full flex items-center">
          <div className="w-full px-8 lg:px-16 xl:px-24">
            <motion.div
              className="max-w-2xl"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Badge */}
              <motion.div className="mb-6" variants={itemVariants}>
                <span className="text-[#EA6A47] text-sm font-semibold uppercase tracking-wide">
                  AI Driven Software
                </span>
              </motion.div>

              {/* Main Heading - Matching Figma exactly */}
              <motion.h1
                className="text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6"
                variants={itemVariants}
              >
                Translate VCDS Reports
                <br />
                into Human Language.
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 max-w-md"
                variants={itemVariants}
              >
                Our tool helps you interpret VAG-COM Diagnostic System reports to human understandable language, making your repair and quotations seamless
              </motion.p>

              {/* CTA Buttons */}
              <motion.div className="flex flex-wrap gap-4" variants={itemVariants}>
                <button
                  onClick={() => navigate('/register')}
                  className="bg-[#EA6A47] hover:bg-[#d85a37] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
                >
                  Get A Quote
                </button>
                <button
                  onClick={() => navigate('/how-it-works')}
                  className="bg-transparent hover:bg-white/10 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 border-2 border-gray-700 hover:border-gray-600 hover:scale-105"
                >
                  How It Works
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </PublicLayout>
    </motion.div>
  );
};

export default LandingPage;
