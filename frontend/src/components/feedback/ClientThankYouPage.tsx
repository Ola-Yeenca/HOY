'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

export function ClientThankYouPage() {
  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-24">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <FaCheckCircle className="w-20 h-20 mx-auto text-gold" />
          </motion.div>

          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-gold">Thank You!</h1>
            <p className="text-xl text-white-plum/80 max-w-2xl mx-auto">
              Your feedback is invaluable in helping us create better experiences for everyone.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link
              href="/events"
              className="inline-flex items-center justify-center px-6 py-3 bg-gold text-coffee-bean font-semibold rounded-lg hover:bg-gold/90 transition-colors"
            >
              Explore Events
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-gold text-gold rounded-lg hover:bg-gold/10 transition-colors"
            >
              Return Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
