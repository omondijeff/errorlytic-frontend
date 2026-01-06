import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const HowItWorksPage: React.FC = () => {
  const navigate = useNavigate();

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Use Errorlytic for Automotive Diagnostics',
    description: 'Learn how to transform VCDS diagnostic reports into actionable insights using Errorlytic AI-powered platform in three simple steps.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Upload Your VCDS Report',
        text: 'Simply upload your VAG-COM diagnostic report file. We support CSV, TXT, and PDF formats.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'AI Analysis',
        text: 'Our advanced AI engine processes the diagnostic codes and interprets them into clear, human-readable language.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Get Detailed Report',
        text: 'Receive a comprehensive report explaining the issues, severity levels, and recommended repairs.',
      },
    ],
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.6, ease: "easeOut" }
  };

  const staggerContainer = {
    initial: {},
    whileInView: { transition: { staggerChildren: 0.2 } },
    viewport: { once: true, margin: "-100px" }
  };

  const steps = [
    {
      number: '01',
      title: 'Upload Your VCDS Report',
      description: 'Simply upload your VAG-COM diagnostic report file. We support CSV, TXT, and PDF formats.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      ),
    },
    {
      number: '02',
      title: 'AI Analysis',
      description: 'Our advanced AI engine processes the diagnostic codes and interprets them into clear, human-readable language.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
    },
    {
      number: '03',
      title: 'Get Detailed Report',
      description: 'Receive a comprehensive report explaining the issues, severity levels, and recommended repairs.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      number: '04',
      title: 'Generate Quotations',
      description: 'Automatically generate accurate repair quotations with parts and labor costs in your local currency.',
      icon: (
        <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        title="How It Works - Errorlytic"
        description="Learn how to transform VCDS diagnostic reports into actionable insights in 3 simple steps: Upload your report, get AI analysis, and receive detailed diagnostic recommendations."
        keywords="how to use VCDS, automotive diagnostics tutorial, VCDS report analysis, vehicle diagnostic process, AI diagnostics workflow"
        canonicalUrl="https://errorlytic.com/how-it-works"
        structuredData={structuredData}
      />
      <PublicLayout>
        <section className="relative min-h-screen bg-black overflow-hidden">
        {/* Subtle background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
        </div>

        <div className="relative w-full px-8 lg:px-16 xl:px-24 py-32">
          <div className="max-w-7xl mx-auto">
            {/* Hero Section */}
            <motion.div
              className="mb-32 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                className="inline-flex items-center gap-2 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="w-8 h-px bg-gradient-to-r from-transparent to-[#EA6A47]"></div>
                <span className="text-[#EA6A47] text-sm font-semibold uppercase tracking-wider">
                  Simple Process
                </span>
                <div className="w-8 h-px bg-gradient-to-l from-transparent to-[#EA6A47]"></div>
              </motion.div>
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] text-white">
                How It Works
              </h1>
              <p className="text-gray-400 text-lg lg:text-xl leading-relaxed max-w-3xl mx-auto">
                Get professional diagnostic analysis in four simple steps
              </p>
            </motion.div>

            {/* Steps */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-24 mb-40"
              variants={staggerContainer}
              initial="initial"
              whileInView="whileInView"
              viewport={{ once: true, margin: "-100px" }}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  variants={fadeInUp}
                >
                  {/* Hover accent line */}
                  <div className="absolute -left-8 top-0 w-0.5 h-full bg-gradient-to-b from-[#EA6A47] via-[#EA6A47]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  <div className="relative">
                    <div className="flex items-start gap-8 mb-8">
                      {/* Large outlined number */}
                      <div className="text-8xl lg:text-9xl font-bold text-transparent leading-none select-none" style={{
                        WebkitTextStroke: '2px rgba(234, 106, 71, 0.15)',
                        textStroke: '2px rgba(234, 106, 71, 0.15)'
                      }}>
                        {step.number}
                      </div>
                      {/* Icon */}
                      <div className="text-[#EA6A47] opacity-20 group-hover:opacity-70 transition-all duration-500 mt-4">
                        {step.icon}
                      </div>
                    </div>

                    <h3 className="text-3xl lg:text-4xl font-bold mb-5 text-white leading-tight group-hover:text-gray-100 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-gray-400 text-base lg:text-lg leading-relaxed group-hover:text-gray-300 transition-colors">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
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
                  Ready to Get Started?
                </h2>
                <p className="text-gray-400 text-lg lg:text-xl leading-relaxed mb-12 max-w-3xl mx-auto">
                  Join hundreds of garages and insurance companies using Errorlytic to streamline their diagnostic process
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigate('/register')}
                    className="bg-[#EA6A47] hover:bg-[#d85a37] text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300 hover:scale-105"
                  >
                    Start Free Trial
                  </button>
                  <button
                    onClick={() => navigate('/who-is-it-for')}
                    className="border-2 border-gray-800 hover:border-[#EA6A47]/50 text-white px-10 py-4 rounded-full font-medium text-lg transition-all duration-300"
                  >
                    Learn More
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

export default HowItWorksPage;
