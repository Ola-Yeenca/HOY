'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const PARTICLE_COUNT = 50;

function createParticles() {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 3 + 2,
    delay: Math.random() * 2
  }));
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [particles] = useState(createParticles);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black opacity-50" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black opacity-50" />
      
      {/* Animated particles */}
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gold"
          initial={{ 
            x: `${particle.x}%`,
            y: '100%',
            opacity: 0,
            scale: 0
          }}
          animate={{
            y: '-100%',
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
          }}
        />
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,215,0,0.1),transparent_50%)]" />
    </div>
  );
}
