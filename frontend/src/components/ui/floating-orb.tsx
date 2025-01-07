import { motion } from 'framer-motion';
import { cn } from '@/utils';

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

const colorMap = {
  gold: 'bg-gold/20',
  'coffee-bean': 'bg-coffee-bean/20'
};

export function FloatingOrb({ 
  className, 
  color = 'gold',
  size = 'md',
  delay = 0 
}: FloatingOrbProps) {
  return (
    <motion.div
      className={cn(
        'absolute rounded-full filter blur-3xl mix-blend-multiply pointer-events-none',
        sizeMap[size],
        colorMap[color],
        className
      )}
      animate={{
        y: [0, -20, 0],
        scale: [1, 1.1, 1],
        opacity: [0.5, 0.7, 0.5]
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        delay,
        ease: 'easeInOut'
      }}
    />
  );
}
