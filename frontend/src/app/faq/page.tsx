'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is House of Young?",
    answer: "House of Young (HOY) is a dynamic platform dedicated to connecting young people with exciting events, fostering creativity, and building a vibrant community. We curate and host various events ranging from music concerts to art exhibitions and cultural gatherings."
  },
  {
    question: "How do I purchase tickets for events?",
    answer: "You can purchase tickets directly through our platform. Simply navigate to the event you're interested in, click on 'Get Tickets,' and follow the secure checkout process. We accept various payment methods including credit cards and digital payments."
  },
  {
    question: "Can I get a refund for my tickets?",
    answer: "Our refund policy varies depending on the event. Generally, tickets can be refunded up to 48 hours before the event starts. Please check the specific event's terms and conditions for detailed refund policies."
  },
  {
    question: "How do I create an account?",
    answer: "Creating an account is easy! Click on the 'Sign Up' button in the top right corner, fill in your details, and verify your email address. Once verified, you can start exploring and participating in events."
  },
  {
    question: "Are there age restrictions for events?",
    answer: "Age restrictions vary by event. Each event listing includes specific age requirements in the event details section. Please check these requirements before purchasing tickets."
  },
  {
    question: "How can I contact support?",
    answer: "You can reach our support team through multiple channels: email us at support@hoy.com, use the contact form on our website, or visit our Help Center for immediate assistance with common issues."
  },
  {
    question: "Can I sell my tickets if I can't attend an event?",
    answer: "Yes, you can resell your tickets through our official resale platform. This ensures a secure transaction and maintains ticket validity. Third-party resales are not recommended as they may not be honored."
  },
  {
    question: "How do I stay updated about new events?",
    answer: "There are several ways to stay updated: subscribe to our newsletter, follow us on social media, or enable notifications in your account settings. You can also save events to your watchlist for updates about specific events."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Frequently Asked Questions
          </h1>
          <p className="text-lg">
            Find answers to common questions about House of Young events and services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={false}
              className="border border-dark-gray rounded-lg overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-coffee-bean/50 transition-colors duration-200"
              >
                <span className="text-left font-medium">{faq.question}</span>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiChevronDown className="h-5 w-5 text-gold" />
                </motion.div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-dark-gray"
                  >
                    <div className="px-6 py-4 text-white-plum/80">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-white-plum/80">
            Still have questions?{" "}
            <a href="/contact" className="text-gold hover:underline">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
