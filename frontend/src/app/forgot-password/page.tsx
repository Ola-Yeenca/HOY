'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaEnvelope } from 'react-icons/fa';
import { authApi } from '@/services/api';
import { useToast } from '@chakra-ui/react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authApi.sendPasswordResetEmail(email);
      setSuccess(true);
      toast({
        title: 'Success',
        description: 'Password reset instructions have been sent to your email.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Failed to send reset email',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full space-y-8 bg-jet-black/50 p-8 rounded-lg backdrop-blur-sm"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gold mb-4">Check Your Email</h2>
            <p className="text-chalk mb-8">
              We've sent password reset instructions to your email address.
            </p>
            <Link
              href="/login"
              className="text-gold hover:text-gold/80 transition-colors"
            >
              Return to login
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-jet-black/50 p-8 rounded-lg backdrop-blur-sm"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gold">
            Reset Your Password
          </h2>
          <p className="mt-2 text-center text-sm text-chalk">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm">
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <FaEnvelope className="absolute top-3 left-3 text-gold" />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full pl-10 pr-3 py-2 border border-gold/30 bg-jet-black/50 text-chalk placeholder-chalk/50 focus:outline-none focus:ring-2 focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? 'Sending...' : 'Send Reset Instructions'}
            </button>
          </div>

          <div className="text-center">
            <Link
              href="/login"
              className="text-gold hover:text-gold/80 transition-colors text-sm"
            >
              Back to login
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
