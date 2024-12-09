'use client';

import { motion } from 'framer-motion';

const sections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, including:
    • Personal information (name, email, phone number)
    • Profile information and preferences
    • Payment information (processed securely through our payment providers)
    • Event attendance history
    • Communications with us
    We also automatically collect certain information about your device and how you interact with our platform.`
  },
  {
    title: "How We Use Your Information",
    content: `We use your information to:
    • Provide and improve our services
    • Process your transactions
    • Send you updates about events and services
    • Personalize your experience
    • Ensure platform security
    • Comply with legal obligations
    We never sell your personal information to third parties.`
  },
  {
    title: "Information Sharing",
    content: `We may share your information with:
    • Event organizers (for event attendance)
    • Service providers (payment processing, analytics)
    • Legal authorities (when required by law)
    • Business partners (with your consent)
    All sharing is conducted under strict data protection agreements.`
  },
  {
    title: "Your Rights",
    content: `You have the right to:
    • Access your personal information
    • Correct inaccurate information
    • Request deletion of your information
    • Opt-out of marketing communications
    • Export your data
    Contact us to exercise these rights.`
  },
  {
    title: "Data Security",
    content: `We implement industry-standard security measures to protect your information, including:
    • Encryption of sensitive data
    • Regular security audits
    • Access controls
    • Secure data storage
    However, no system is completely secure, and we cannot guarantee absolute security.`
  },
  {
    title: "Cookies and Tracking",
    content: `We use cookies and similar technologies to:
    • Remember your preferences
    • Analyze platform usage
    • Personalize content
    • Improve our services
    You can control cookie settings through your browser preferences.`
  },
  {
    title: "Children's Privacy",
    content: `Our services are not intended for children under 13. We do not knowingly collect information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.`
  },
  {
    title: "International Data Transfers",
    content: `We may transfer your information to servers located outside your country. We ensure appropriate safeguards are in place for international transfers in compliance with applicable data protection laws.`
  },
  {
    title: "Changes to Privacy Policy",
    content: `We may update this privacy policy periodically. We will notify you of significant changes through the platform or via email. Continued use of our services after changes constitutes acceptance of the updated policy.`
  },
  {
    title: "Contact Us",
    content: `For questions about this privacy policy or our data practices, contact us at:
    • Email: privacy@hoy.com
    • Address: [Company Address]
    • Phone: [Phone Number]
    We aim to respond to all inquiries within 48 hours.`
  }
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Privacy Policy
          </h1>
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-4 text-white-plum/80">
            Your privacy is important to us. This policy explains how we collect, use,
            and protect your personal information.
          </p>
        </motion.div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-dark-gray rounded-lg p-6 hover:border-gold transition-colors duration-200"
            >
              <h2 className="text-xl font-semibold text-gold mb-4">
                {section.title}
              </h2>
              <div className="text-white-plum/80 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-white-plum/60"
        >
          <p>
            For any privacy-related concerns, please{" "}
            <a href="/contact" className="text-gold hover:underline">
              contact our privacy team
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
