'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import useAuth from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock, FaUser, FaGoogle, FaApple, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const registrationData = {
        email: formData.email,
        password: formData.password,
        password_confirm: formData.confirmPassword,
        first_name: formData.firstName,
        last_name: formData.lastName
      };
      await register(registrationData);
      router.push('/login?message=Registration successful! Please log in.');
    } catch (error) {
      // Error is handled by the auth store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleGoogleSignIn = async () => {
    try {
      // await signInWithGoogle();
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the auth store
    }
  };

  const handleAppleSignIn = async () => {
    try {
      // await signInWithApple();
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the auth store
    }
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
            Create Your Account
          </h2>
          <p className="mt-2 text-center text-sm text-chalk">
            Already have an account?{' '}
            <Link
              href="/login"
              className="font-medium text-gold hover:text-gold/80 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-gold text-sm font-medium rounded-md text-gold bg-transparent hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
          >
            <FaGoogle className="mr-2 h-5 w-5" />
            Continue with Google
          </button>
          <button
            onClick={handleAppleSignIn}
            className="group relative w-full flex justify-center py-2 px-4 border border-gold text-sm font-medium rounded-md text-gold bg-transparent hover:bg-gold/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
          >
            <FaApple className="mr-2 h-5 w-5" />
            Continue with Apple
          </button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gold/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-jet-black text-chalk">Or continue with email</span>
            </div>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="rounded-md shadow-sm -space-y-px">
            <div className="relative">
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <FaUser className="absolute top-3 left-3 text-gold" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent rounded-t-md focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="First Name"
              />
            </div>
            <div className="relative">
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <FaUser className="absolute top-3 left-3 text-gold" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Last Name"
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="sr-only">
                Email
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
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Email"
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
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
            <div className="relative">
              <label htmlFor="confirmPassword" className="sr-only">
                Confirm Password
              </label>
              <FaLock className="absolute top-3 left-3 text-gold" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none rounded-none relative block w-full px-10 py-2 border border-gold/30 placeholder-chalk/50 text-chalk bg-transparent rounded-b-md focus:outline-none focus:ring-gold focus:border-gold focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-gold hover:bg-gold/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                'Create Account'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
