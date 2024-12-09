'use client';

import { motion } from 'framer-motion';

interface FloatingOrbProps {
  className?: string;
  color?: 'gold' | 'coffee-bean';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  delay?: number;
}

const sizeMap = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-96 h-96'
};

export function FloatingOrb({ className = '', color = 'gold', size = 'md', delay = 0 }: FloatingOrbProps) {
  const baseColor = color === 'gold' ? 'bg-gold' : 'bg-coffee-bean';
  
  return (
    <motion.div
      className={`absolute ${sizeMap[size]} rounded-full filter blur-[100px] ${baseColor}/20 pointer-events-none ${className}`}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.3, 0.2],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        repeatType: "reverse",
        ease: "easeInOut",
        delay: delay,
      }}
    />
  );
}
