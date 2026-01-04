import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const TermsOfServicePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Terms of Service - Errorlytic"
        description="Read the terms and conditions governing your use of Errorlytic's AI-powered automotive diagnostic platform."
        keywords="terms of service, terms and conditions, user agreement, service terms"
        canonicalUrl="https://errorlytic.com/terms-of-service"
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
                  Terms of Service
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
                    <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-400 leading-relaxed">
                      By accessing or using Errorlytic ("the Service"), a product of Tajilabs Kenya, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
                    <p className="text-gray-400 leading-relaxed">
                      Errorlytic is an AI-powered automotive diagnostic platform that analyzes VCDS (VAG-COM Diagnostic System) reports and provides human-readable interpretations, diagnostic insights, and recommendations. The Service includes:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                      <li>VCDS report upload and parsing</li>
                      <li>AI-powered diagnostic code analysis</li>
                      <li>Report generation and recommendations</li>
                      <li>Credit-based billing for individual users</li>
                      <li>Subscription plans for organizations</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">3. User Accounts</h2>
                    <div className="space-y-4">
                      <p className="text-gray-400 leading-relaxed">
                        To use certain features of the Service, you must create an account. You agree to:
                      </p>
                      <ul className="list-disc list-inside text-gray-400 space-y-1">
                        <li>Provide accurate and complete registration information</li>
                        <li>Maintain the security of your account credentials</li>
                        <li>Promptly update your information if it changes</li>
                        <li>Accept responsibility for all activities under your account</li>
                        <li>Notify us immediately of any unauthorized access</li>
                      </ul>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">4. Payment Terms</h2>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Credit Packs (Individual Users)</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          <li>Credits are purchased in advance and deducted per analysis</li>
                          <li>Unused credits do not expire unless the account is terminated</li>
                          <li>Credits are non-refundable once purchased</li>
                          <li>Payments accepted via M-Pesa and card (Paystack)</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-2">Subscriptions (Organizations)</h3>
                        <ul className="list-disc list-inside text-gray-400 space-y-1">
                          <li>Subscriptions are billed monthly or annually in advance</li>
                          <li>Included analyses reset at the beginning of each billing period</li>
                          <li>Overage charges apply when exceeding included analyses</li>
                          <li>Cancellation takes effect at the end of the current billing period</li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">5. Acceptable Use</h2>
                    <p className="text-gray-400 leading-relaxed mb-4">
                      You agree not to:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      <li>Use the Service for any unlawful purpose</li>
                      <li>Upload malicious files or content</li>
                      <li>Attempt to reverse engineer or hack the Service</li>
                      <li>Share your account credentials with unauthorized parties</li>
                      <li>Resell or redistribute analysis results without authorization</li>
                      <li>Overload or disrupt the Service infrastructure</li>
                      <li>Impersonate another person or entity</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">6. Intellectual Property</h2>
                    <div className="space-y-4">
                      <p className="text-gray-400 leading-relaxed">
                        <strong className="text-white">Our Content:</strong> The Service, including its software, algorithms, design, and documentation, is owned by Tajilabs Kenya and protected by intellectual property laws.
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        <strong className="text-white">Your Content:</strong> You retain ownership of diagnostic files you upload. By uploading content, you grant us a license to process and analyze it to provide the Service.
                      </p>
                      <p className="text-gray-400 leading-relaxed">
                        <strong className="text-white">Analysis Results:</strong> Reports and analysis generated by our Service are provided for your use. You may share results with your customers but may not resell the Service itself.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimer of Warranties</h2>
                    <div className="p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                      <p className="text-gray-400 leading-relaxed">
                        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. WE DO NOT WARRANT THAT:
                      </p>
                      <ul className="list-disc list-inside text-gray-400 mt-4 space-y-1">
                        <li>The Service will be uninterrupted or error-free</li>
                        <li>Analysis results will be 100% accurate in all cases</li>
                        <li>The Service will meet all your specific requirements</li>
                      </ul>
                      <p className="text-gray-400 leading-relaxed mt-4">
                        Diagnostic analysis is provided as a tool to assist professionals. Final diagnostic decisions and repairs should be verified by qualified mechanics.
                      </p>
                    </div>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">8. Limitation of Liability</h2>
                    <p className="text-gray-400 leading-relaxed">
                      To the maximum extent permitted by law, Tajilabs Kenya shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or business opportunities, arising from your use of the Service.
                    </p>
                    <p className="text-gray-400 leading-relaxed mt-4">
                      Our total liability for any claims arising from the Service shall not exceed the amount you paid us in the twelve (12) months preceding the claim.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">9. Indemnification</h2>
                    <p className="text-gray-400 leading-relaxed">
                      You agree to indemnify and hold harmless Tajilabs Kenya, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">10. Service Modifications</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We reserve the right to modify, suspend, or discontinue any part of the Service at any time. We will provide reasonable notice for material changes that affect your use of the Service.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">11. Termination</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We may terminate or suspend your account immediately for violations of these Terms or for any other reason at our discretion. Upon termination:
                    </p>
                    <ul className="list-disc list-inside text-gray-400 mt-2 space-y-1">
                      <li>Your right to use the Service will cease immediately</li>
                      <li>Unused credits are forfeited (no refunds)</li>
                      <li>You may request export of your data within 30 days</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">12. Governing Law</h2>
                    <p className="text-gray-400 leading-relaxed">
                      These Terms shall be governed by and construed in accordance with the laws of Kenya. Any disputes arising from these Terms or the Service shall be subject to the exclusive jurisdiction of the courts in Nairobi, Kenya.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">13. Changes to Terms</h2>
                    <p className="text-gray-400 leading-relaxed">
                      We may update these Terms from time to time. We will notify you of material changes by email or through the Service. Your continued use of the Service after changes take effect constitutes acceptance of the revised Terms.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-bold text-white mb-4">14. Contact Information</h2>
                    <p className="text-gray-400 leading-relaxed">
                      For questions about these Terms of Service, please contact us:
                    </p>
                    <div className="mt-4 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                      <p className="text-white font-semibold">Tajilabs Kenya</p>
                      <p className="text-gray-400">Email: legal@errorlytic.com</p>
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

export default TermsOfServicePage;
