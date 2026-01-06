import { useState } from 'react';
import { motion } from 'framer-motion';
import PublicLayout from '../../components/Layout/PublicLayout';
import SEO from '../../components/SEO/SEO';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setSubmitted(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Contact Us - Errorlytic"
        description="Get in touch with the Errorlytic team. We're here to help with questions about our AI-powered automotive diagnostic platform."
        keywords="contact, support, help, customer service, automotive diagnostics"
        canonicalUrl="https://errorlytic.com/contact"
      />
      <PublicLayout>
        <section className="relative min-h-screen bg-black overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 -left-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 -right-40 w-80 h-80 bg-[#EA6A47] opacity-[0.02] rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full px-4 sm:px-8 lg:px-16 xl:px-24 py-32">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <motion.div
                className="mb-16 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[#EA6A47] text-sm font-semibold uppercase tracking-wider mb-4 block">
                  Get in Touch
                </span>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6 text-white">
                  Contact Us
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                  Have questions about Errorlytic? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  {submitted ? (
                    <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8 text-center">
                      <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-400 mb-6">
                        Thank you for reaching out. We'll get back to you within 24-48 hours.
                      </p>
                      <button
                        onClick={() => setSubmitted(false)}
                        className="text-[#EA6A47] hover:text-[#d85a37] font-medium transition-colors"
                      >
                        Send another message
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EA6A47] transition-colors"
                          placeholder="John Doe"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EA6A47] transition-colors"
                          placeholder="john@example.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                          Subject
                        </label>
                        <select
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#EA6A47] transition-colors"
                        >
                          <option value="" className="bg-gray-900">Select a subject</option>
                          <option value="general" className="bg-gray-900">General Inquiry</option>
                          <option value="support" className="bg-gray-900">Technical Support</option>
                          <option value="billing" className="bg-gray-900">Billing Question</option>
                          <option value="partnership" className="bg-gray-900">Partnership Opportunity</option>
                          <option value="feedback" className="bg-gray-900">Feedback</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                          Message
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          rows={6}
                          className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#EA6A47] transition-colors resize-none"
                          placeholder="How can we help you?"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#EA6A47] hover:bg-[#d85a37] disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          'Send Message'
                        )}
                      </button>
                    </form>
                  )}
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="space-y-8"
                >
                  {/* Company Info */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-6">Tajilabs Kenya</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#EA6A47]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#EA6A47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Email</p>
                          <a href="mailto:hello@errorlytic.com" className="text-white hover:text-[#EA6A47] transition-colors">
                            hello@errorlytic.com
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#EA6A47]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#EA6A47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Website</p>
                          <a href="https://tajilabs.co.ke" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#EA6A47] transition-colors">
                            tajilabs.co.ke
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#EA6A47]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <svg className="w-5 h-5 text-[#EA6A47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Location</p>
                          <p className="text-white">Nairobi, Kenya</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Support Hours */}
                  <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Support Hours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monday - Friday</span>
                        <span className="text-white">9:00 AM - 6:00 PM EAT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Saturday</span>
                        <span className="text-white">10:00 AM - 2:00 PM EAT</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Sunday</span>
                        <span className="text-gray-500">Closed</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Response time: Within 24-48 hours
                    </p>
                  </div>

                  {/* FAQ Callout */}
                  <div className="bg-gradient-to-br from-[#EA6A47]/10 to-transparent rounded-2xl border border-[#EA6A47]/20 p-8">
                    <h3 className="text-xl font-bold text-white mb-2">Need Quick Answers?</h3>
                    <p className="text-gray-400 mb-4">
                      Check out our How It Works page for common questions about using Errorlytic.
                    </p>
                    <a
                      href="/how-it-works"
                      className="inline-flex items-center gap-2 text-[#EA6A47] hover:text-[#d85a37] font-medium transition-colors"
                    >
                      Learn How It Works
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </PublicLayout>
    </motion.div>
  );
};

export default ContactPage;
