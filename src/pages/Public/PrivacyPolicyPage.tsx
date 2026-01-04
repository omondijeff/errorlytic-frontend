import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const PrivacyPolicyPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Privacy Policy - Errorlytic"
        description="Learn how Errorlytic collects, uses, and protects your personal information. Our commitment to your privacy and data security."
        keywords="privacy policy, data protection, personal information, GDPR, data security"
        canonicalUrl="https://errorlytic.com/privacy-policy"
      />
      <PublicLayout>
        <section className="relative min-h-screen bg-black overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-32">
            <div className="max-w-4xl mx-auto">
              {/* Header */}
              <motion.div
                className="mb-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[#EA6A47] text-sm font-semibold uppercase tracking-wider mb-4 block">
                  Legal
                </span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white">
                  Privacy Policy
                </h1>
                <p className="text-gray-400 text-lg">
                  Last updated: January 2025
                </p>
              </motion.div>

              {/* Content */}
              <motion.div
                className="prose prose-invert prose-lg max-w-none"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="space-y-12">
                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">1. Introduction</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Errorlytic, a product of Tajilabs Kenya ("we," "our," or "us"), is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered automotive diagnostic platform.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Information We Collect</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                        <p className="text-gray-400 leading-relaxed">
                          When you register for an account, we collect:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                          <li>Name and email address</li>
                          <li>Phone number (optional, for M-Pesa payments)</li>
                          <li>Organization/business name (for business accounts)</li>
                          <li>Billing and payment information</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Diagnostic Data</h3>
                        <p className="text-gray-400 leading-relaxed">
                          When you use our service, we process:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                          <li>VCDS diagnostic report files you upload</li>
                          <li>Vehicle identification information (VIN, make, model, year)</li>
                          <li>Diagnostic trouble codes and analysis results</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Usage Information</h3>
                        <p className="text-gray-400 leading-relaxed">
                          We automatically collect:
                        </p>
                        <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                          <li>IP address and device information</li>
                          <li>Browser type and operating system</li>
                          <li>Pages visited and features used</li>
                          <li>Date and time of access</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. How We Use Your Information</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      We use the collected information to:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      <li>Provide and maintain our diagnostic analysis services</li>
                      <li>Process your payments and manage your account</li>
                      <li>Generate AI-powered diagnostic reports and recommendations</li>
                      <li>Improve our algorithms and service quality</li>
                      <li>Send service-related communications</li>
                      <li>Respond to your inquiries and support requests</li>
                      <li>Comply with legal obligations</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing and Disclosure</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      We do not sell your personal information. We may share your data with:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      <li><strong className="text-white">Service Providers:</strong> Payment processors (M-Pesa, Paystack) and cloud infrastructure providers</li>
                      <li><strong className="text-white">AI Processing:</strong> OpenAI for diagnostic analysis (diagnostic data only, not personal information)</li>
                      <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                      <li><strong className="text-white">Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We implement industry-standard security measures including:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                      <li>Encryption of data in transit and at rest</li>
                      <li>Secure authentication mechanisms</li>
                      <li>Regular security audits and monitoring</li>
                      <li>Access controls and employee training</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Data Retention</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We retain your personal information for as long as your account is active or as needed to provide services. Diagnostic reports are retained for 12 months unless you request earlier deletion. You may request deletion of your data at any time.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Your Rights</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      You have the right to:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      <li>Access and receive a copy of your personal data</li>
                      <li>Correct inaccurate or incomplete data</li>
                      <li>Request deletion of your data</li>
                      <li>Object to or restrict processing of your data</li>
                      <li>Withdraw consent at any time</li>
                      <li>Data portability</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Cookies and Tracking</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We use essential cookies to maintain your session and preferences. We do not use third-party tracking cookies for advertising purposes. You can manage cookie preferences through your browser settings.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">9. Children's Privacy</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last updated" date.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">11. Contact Us</h2>
                    <p className="text-gray-400 leading-relaxed">
                      If you have questions about this Privacy Policy or our data practices, please contact us:
                    </p>
                    <div className="mt-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                      <p className="text-white font-semibold">Tajilabs Kenya</p>
                      <p className="text-gray-400">Email: privacy@errorlytic.com</p>
                      <p className="text-gray-400">Website: <a href="https://tajilabs.co.ke" target="_blank" rel="noopener noreferrer" className="text-[#EA6A47] hover:underline">tajilabs.co.ke</a></p>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </motion.div>
  );
};

export default PrivacyPolicyPage;
