import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const WhoIsItForPage: React.FC = () => {
  const navigate = useNavigate();

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" as any }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.15 } },
    viewport: { once: true, margin: "-100px" }
  };

  const audiences = [
    {
      title: 'Auto Repair Garages',
      description: 'Streamline your diagnostic workflow and provide customers with professional, detailed reports instantly.',
      benefits: [
        'Faster diagnostic interpretation',
        'Professional quotation generation',
        'Multi-currency support',
        'Client management tools',
        'Detailed repair walkthroughs',
      ],
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Insurance Companies',
      description: 'Accurately assess vehicle damage and generate fair claims estimates with AI-powered analysis.',
      benefits: [
        'Accurate claim assessments',
        'Fraud detection capabilities',
        'Automated report generation',
        'Claims dashboard',
        'Multi-branch support',
      ],
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'Individual Car Owners',
      description: 'Understand what\'s wrong with your vehicle and get fair repair estimates before visiting a garage.',
      benefits: [
        'Understand diagnostic codes',
        'Know repair costs upfront',
        'Avoid overcharging',
        'Make informed decisions',
        'Save time and money',
      ],
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Who Is It For - Errorlytic"
        description="Errorlytic serves auto repair garages, insurance companies, and independent mechanics. Streamline diagnostics, generate professional reports, and improve workflow efficiency with AI-powered automotive analysis."
        keywords="automotive diagnostic software for garages, mechanic diagnostic tools, insurance vehicle assessment, auto workshop software, VCDS for professionals"
        canonicalUrl="https://errorlytic.com/who-is-it-for"
      />
      <PublicLayout>
        <section className="relative min-h-screen bg-black overflow-hidden">
          {/* Subtle background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/3 -right-40 w-96 h-96 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 -left-40 w-96 h-96 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full px-8 lg:px-16 xl:px-24 py-32">
            <div className="max-w-7xl mx-auto">
              {/* Hero Section */}
              <motion.div
                className="mb-32 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" as any }}
              >
                <motion.div
                  className="inline-flex items-center gap-2 mb-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#EA6A47]"></div>
                  <span className="text-[#EA6A47] text-sm font-semibold uppercase tracking-wider">
                    Built For Everyone
                  </span>
                  <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#EA6A47]"></div>
                </motion.div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] text-white">
                  Who Is It For?
                </h1>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
                  Errorlytic serves professionals and individuals across the automotive industry
                </p>
              </motion.div>

              {/* Audiences */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 mb-40"
                variants={staggerContainer}
                initial="initial"
                whileInView="whileInView"
                viewport={{ once: true, margin: "-100px" }}
              >
                {audiences.map((audience, index) => (
                  <motion.div
                    key={index}
                    className="group relative"
                    variants={fadeInUp}
                  >
                    {/* Left border accent */}
                    <div className="absolute left-0 top-0 w-0.5 h-0 bg-gradient-to-b from-[#EA6A47] to-transparent group-hover:h-full transition-all duration-500"></div>

                    <div className="pl-8">
                      <div className="mb-8 text-[#EA6A47] opacity-20 group-hover:opacity-70 transition-all duration-500">
                        {audience.icon}
                      </div>

                      <h3 className="text-2xl lg:text-3xl font-bold mb-4 text-white leading-tight group-hover:text-gray-100 transition-colors">
                        {audience.title}
                      </h3>

                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed mb-8 group-hover:text-gray-300 transition-colors">
                        {audience.description}
                      </p>

                      <div className="space-y-3">
                        {audience.benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start text-gray-300 text-sm lg:text-base">
                            <div className="w-1.5 h-1.5 bg-[#EA6A47] rounded-full mr-3 mt-2 flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Features Section */}
              <motion.div
                className="relative mb-40"
                {...fadeInUp}
              >
                {/* Decorative accent line */}
                <div className="flex items-center gap-3 mb-16">
                  <div className="w-16 h-px bg-gradient-to-r from-[#EA6A47] to-transparent"></div>
                  <div className="w-1.5 h-1.5 bg-[#EA6A47] rounded-full"></div>
                </div>

                <div>
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-8 text-white leading-tight">
                    Perfect for East African Market
                  </h2>
                  <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-20 max-w-3xl">
                    Built specifically for the unique needs of East African automotive businesses
                  </p>

                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-16"
                    variants={staggerContainer}
                    initial="initial"
                    whileInView="whileInView"
                    viewport={{ once: true, margin: "-100px" }}
                  >
                    <motion.div className="group" variants={fadeInUp}>
                      <div className="flex items-start gap-5 mb-5">
                        <div className="relative mt-3">
                          <div className="w-2 h-2 bg-[#EA6A47] rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-[#EA6A47] rounded-full animate-ping opacity-75 group-hover:opacity-0"></div>
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
                          Multi-Currency Support
                        </h4>
                      </div>
                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed pl-7 group-hover:text-gray-300 transition-colors">
                        Work seamlessly with KES, UGX, TZS, and USD. Our platform automatically formats prices according to local standards.
                      </p>
                    </motion.div>

                    <motion.div className="group" variants={fadeInUp}>
                      <div className="flex items-start gap-5 mb-5">
                        <div className="relative mt-3">
                          <div className="w-2 h-2 bg-[#EA6A47] rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-[#EA6A47] rounded-full animate-ping opacity-75 group-hover:opacity-0"></div>
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
                          Multi-Tenant Architecture
                        </h4>
                      </div>
                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed pl-7 group-hover:text-gray-300 transition-colors">
                        Perfect for organizations with multiple branches. Manage teams, track usage, and maintain separate accounts.
                      </p>
                    </motion.div>

                    <motion.div className="group" variants={fadeInUp}>
                      <div className="flex items-start gap-5 mb-5">
                        <div className="relative mt-3">
                          <div className="w-2 h-2 bg-[#EA6A47] rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-[#EA6A47] rounded-full animate-ping opacity-75 group-hover:opacity-0"></div>
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
                          Local Parts Database
                        </h4>
                      </div>
                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed pl-7 group-hover:text-gray-300 transition-colors">
                        Access pricing for parts available in East African markets, ensuring accurate and realistic quotations.
                      </p>
                    </motion.div>

                    <motion.div className="group" variants={fadeInUp}>
                      <div className="flex items-start gap-5 mb-5">
                        <div className="relative mt-3">
                          <div className="w-2 h-2 bg-[#EA6A47] rounded-full flex-shrink-0 group-hover:scale-150 transition-transform duration-300"></div>
                          <div className="absolute inset-0 w-2 h-2 bg-[#EA6A47] rounded-full animate-ping opacity-75 group-hover:opacity-0"></div>
                        </div>
                        <h4 className="text-2xl lg:text-3xl font-bold text-white group-hover:text-gray-100 transition-colors">
                          Flexible Billing
                        </h4>
                      </div>
                      <p className="text-gray-400 text-base lg:text-lg leading-relaxed pl-7 group-hover:text-gray-300 transition-colors">
                        Choose between subscription plans or pay-as-you-go. Perfect for businesses of all sizes.
                      </p>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.div>

              {/* CTA Section */}
              <motion.div
                className="relative border-t border-gray-800/50 pt-24"
                {...fadeInUp}
              >
                {/* Decorative accent */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent to-[#EA6A47]"></div>
                  <div className="w-2 h-2 bg-[#EA6A47] rounded-full"></div>
                  <div className="w-12 h-px bg-gradient-to-l from-transparent to-[#EA6A47]"></div>
                </div>

                <div className="text-center max-w-4xl mx-auto">
                  <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white leading-tight">
                    Get Started Today
                  </h2>
                  <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
                    Join hundreds of garages and insurance companies using Errorlytic
                  </p>
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-[#EA6A47] hover:bg-[#d85a37] text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105"
                    >
                      Start Free Trial
                    </button>
                    <button
                      onClick={() => navigate('/how-it-works')}
                      className="border-2 border-gray-800 hover:border-[#EA6A47]/50 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300"
                    >
                      See How It Works
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </motion.div>
  );
};

export default WhoIsItForPage;
