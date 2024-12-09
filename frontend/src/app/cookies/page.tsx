'use client';

import { motion } from 'framer-motion';

const sections = [
  {
    title: "What Are Cookies?",
    content: `Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our platform, and enabling certain features.`
  },
  {
    title: "Types of Cookies We Use",
    subsections: [
      {
        subtitle: "Essential Cookies",
        content: "Required for basic platform functionality. These cannot be disabled as they are necessary for the website to work properly.",
        examples: [
          "Session management",
          "Authentication",
          "Security features",
          "Load balancing"
        ]
      },
      {
        subtitle: "Functional Cookies",
        content: "Help us remember your preferences and personalize your experience.",
        examples: [
          "Language preferences",
          "Theme settings",
          "Location preferences",
          "Recently viewed events"
        ]
      },
      {
        subtitle: "Analytics Cookies",
        content: "Help us understand how visitors interact with our platform.",
        examples: [
          "Pages visited",
          "Time spent on site",
          "Navigation patterns",
          "Error encounters"
        ]
      },
      {
        subtitle: "Marketing Cookies",
        content: "Used to deliver relevant advertisements and track campaign performance.",
        examples: [
          "Ad preferences",
          "Click tracking",
          "Campaign attribution",
          "Conversion tracking"
        ]
      }
    ]
  },
  {
    title: "Cookie Duration",
    content: `We use both session cookies (deleted when you close your browser) and persistent cookies (remain on your device for a set period). Persistent cookies help us remember your preferences and provide a more personalized experience on return visits.`
  },
  {
    title: "Third-Party Cookies",
    content: `Some cookies are placed by third-party services that appear on our pages. These might include:
    • Analytics providers (e.g., Google Analytics)
    • Social media platforms
    • Payment processors
    • Advertising partners
    We regularly review our third-party partners to ensure they meet our privacy standards.`
  },
  {
    title: "Managing Cookies",
    content: `You can control cookies through your browser settings. Options typically include:
    • Accepting all cookies
    • Notifying you when cookies are set
    • Rejecting all cookies
    • Deleting existing cookies
    Note that blocking some types of cookies may impact your experience on our platform.`
  },
  {
    title: "Your Choices",
    content: `You have the right to:
    • Accept or decline non-essential cookies
    • Change your cookie preferences at any time
    • Delete cookies from your device
    • Use our platform with limited cookie functionality
    We respect your choices and will honor your cookie preferences.`
  }
];

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gold mb-6">
            Cookie Policy
          </h1>
          <p className="text-lg">
            Last updated: {new Date().toLocaleDateString()}
          </p>
          <p className="mt-4 text-white-plum/80">
            This policy explains how we use cookies and similar technologies to provide,
            protect, and improve our platform.
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
              {section.subsections ? (
                <div className="space-y-6">
                  {section.subsections.map((subsection, subIndex) => (
                    <div key={subIndex} className="ml-4">
                      <h3 className="text-lg font-medium text-gold/80 mb-2">
                        {subsection.subtitle}
                      </h3>
                      <p className="text-white-plum/80 mb-2">{subsection.content}</p>
                      <ul className="list-disc list-inside text-white-plum/70 space-y-1">
                        {subsection.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex}>{example}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-white-plum/80 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center border-t border-dark-gray pt-8"
        >
          <button
            className="px-6 py-3 bg-gold text-coffee-bean rounded-lg font-semibold hover:bg-gold/90 transition-colors duration-200"
          >
            Update Cookie Preferences
          </button>
          <p className="mt-4 text-white-plum/60">
            For questions about our cookie policy, please{" "}
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
