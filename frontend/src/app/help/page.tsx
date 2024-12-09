'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';

const categories = [
  {
    title: "Getting Started",
    topics: [
      "Creating an account",
      "Profile setup",
      "Account verification",
      "Basic navigation",
    ],
  },
  {
    title: "Events & Tickets",
    topics: [
      "Finding events",
      "Purchasing tickets",
      "Ticket transfers",
      "Refund policies",
    ],
  },
  {
    title: "Account Management",
    topics: [
      "Password reset",
      "Email preferences",
      "Privacy settings",
      "Notification settings",
    ],
  },
  {
    title: "Payments & Billing",
    topics: [
      "Payment methods",
      "Billing issues",
      "Invoice requests",
      "Currency options",
    ],
  },
];

const contactMethods = [
  {
    icon: FiPhone,
    title: "Phone Support",
    description: "Call us at +1 (555) 123-4567",
    availability: "Mon-Fri, 9AM-6PM EST",
  },
  {
    icon: FiMail,
    title: "Email Support",
    description: "support@hoy.com",
    availability: "24/7 response within 24 hours",
  },
  {
    icon: FiMessageSquare,
    title: "Live Chat",
    description: "Chat with our support team",
    availability: "Available 24/7",
  },
];

export default function HelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            How can we help you?
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            Search our help center or browse categories below to find the answers you need.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for help..."
                className="w-full px-6 py-4 pl-12 rounded-lg bg-coffee-bean/50 border border-dark-gray focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold text-white-plum placeholder-white-plum/50"
              />
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white-plum/50 h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-lg border border-dark-gray hover:border-gold transition-colors duration-200"
            >
              <h3 className="text-xl font-semibold text-gold mb-4">{category.title}</h3>
              <ul className="space-y-2">
                {category.topics.map((topic, topicIndex) => (
                  <li key={topicIndex}>
                    <a
                      href="#"
                      className="text-white-plum/80 hover:text-gold transition-colors duration-200"
                    >
                      {topic}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Methods */}
        <div className="border-t border-dark-gray pt-16">
          <h2 className="text-3xl font-bold text-gold text-center mb-12">
            Need More Help?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-lg border border-dark-gray hover:border-gold transition-colors duration-200"
              >
                <method.icon className="h-8 w-8 text-gold mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">{method.title}</h3>
                <p className="text-white-plum/80 mb-2">{method.description}</p>
                <p className="text-sm text-white-plum/60">{method.availability}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
