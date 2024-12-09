'use client';

import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  size = 'medium', 
  color = 'gold' 
}: LoadingSpinnerProps) {
  const sizes = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  const colors = {
    indigo: 'border-indigo-500',
    white: 'border-white',
    gray: 'border-gray-500',
    gold: 'border-gold',
  };

  return (
    <motion.div
      className={`${sizes[size]} animate-spin rounded-full border-2 border-t-transparent ${colors[color as keyof typeof colors]}`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      }}
    />
  );
}
