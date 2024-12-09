'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/services/api';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');
  const { checkAuth } = useAuth();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      const uid = searchParams.get('uid');

      if (!token || !uid) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await api.post('/auth/verify/email/', { token, uid });
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully');
        // Refresh auth state to update email verification status
        await checkAuth();
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.response?.data?.detail || 'Failed to verify email');
      }
    };

    verifyEmail();
  }, [searchParams, router, checkAuth]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-jet-black/50 p-8 rounded-lg backdrop-blur-sm"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gold mb-4">Email Verification</h2>
          {status === 'verifying' && (
            <div className="text-chalk">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
              <p>Verifying your email address...</p>
            </div>
          )}
          {status === 'success' && (
            <div className="text-green-500">
              <svg
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <p>{message}</p>
              <p className="text-chalk mt-4">Redirecting you to the home page...</p>
            </div>
          )}
          {status === 'error' && (
            <div className="text-red-500">
              <svg
                className="h-12 w-12 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              <p>{message}</p>
              <button
                onClick={() => router.push('/')}
                className="mt-4 text-gold hover:text-gold/80 transition-colors"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
