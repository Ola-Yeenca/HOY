'use client';

import { motion } from 'framer-motion';

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing and using the House of Young (HOY) platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`
  },
  {
    title: "2. User Accounts",
    content: `You must be at least 18 years old to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. We reserve the right to suspend or terminate accounts that violate our terms.`
  },
  {
    title: "3. Event Tickets",
    content: `Tickets purchased through our platform are subject to the specific event's terms and conditions. Resale of tickets is only permitted through our official resale platform. We are not responsible for tickets purchased through unauthorized channels.`
  },
  {
    title: "4. User Conduct",
    content: `Users must not: (a) violate any applicable laws or regulations, (b) impersonate others, (c) distribute harmful content, (d) attempt to gain unauthorized access to our systems, or (e) interfere with the platform's functionality.`
  },
  {
    title: "5. Content",
    content: `By posting content on our platform, you grant us a non-exclusive, worldwide license to use, modify, and distribute that content. You retain ownership of your content but are responsible for ensuring it doesn't violate any third-party rights.`
  },
  {
    title: "6. Payments",
    content: `All payments are processed securely through our authorized payment providers. Prices are inclusive of applicable taxes unless stated otherwise. Refunds are subject to the specific event's refund policy.`
  },
  {
    title: "7. Intellectual Property",
    content: `All platform content, including but not limited to logos, designs, and software, is protected by intellectual property rights. Users may not copy, modify, or distribute this content without explicit permission.`
  },
  {
    title: "8. Privacy",
    content: `Your use of our platform is also governed by our Privacy Policy. By using our services, you consent to our collection and use of your data as described in the Privacy Policy.`
  },
  {
    title: "9. Limitation of Liability",
    content: `We strive to provide reliable services but cannot guarantee uninterrupted access. We are not liable for any indirect, incidental, or consequential damages arising from your use of our platform.`
  },
  {
    title: "10. Modifications",
    content: `We reserve the right to modify these terms at any time. Continued use of our platform after changes constitutes acceptance of the modified terms. Users will be notified of significant changes.`
  }
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Terms of Service
          </h1>
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
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
              <p className="text-white-plum/80 leading-relaxed">
                {section.content}
              </p>
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
            For any questions about these terms, please{" "}
            <a href="/contact" className="text-gold hover:underline">
              contact us
            </a>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
}
