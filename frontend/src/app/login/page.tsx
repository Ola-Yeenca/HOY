'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from 'react-icons/fa';

export default function LoginPage() {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login form submitted');
    console.log('Current pathname:', window.location.pathname);

    setError(null);
    setIsLoading(true);
    console.log('Attempting login with email:', formData.email);
    
    try {
      const response = await login(formData.email, formData.password);
      console.log('Login successful');
      // Force redirect to dashboard
      window.location.replace('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error?.response?.data?.message || 
        error?.response?.data?.detail || 
        error?.response?.data?.non_field_errors?.[0] ||
        'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-jet-black/50 p-8 rounded-lg backdrop-blur-sm"
      >
        <div>
          <h2 className="text-center text-3xl font-extrabold text-gold">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-chalk">
            Don't have an account?{' '}
            <Link
              href="/register"
              className="font-medium text-gold hover:text-gold/80 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
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
                value={formData.email}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent rounded-t-md focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Email address"
                disabled={isLoading}
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <FaLock className="absolute top-3 left-3 text-gold" />
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent rounded-b-md focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Password"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link
                href="/forgot-password"
                className="font-medium text-gold hover:text-gold/80 transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
