'use client';

import { motion } from 'framer-motion';
import { format } from 'date-fns';
import React from 'react';

interface FireDateProps {
  date: Date;
  isUpNext?: boolean;
}

export function FireDate({ date, isUpNext = false }: FireDateProps) {
  const innerFlames = Array.from({ length: 8 }, (_, i) => i);
  const outerFlames = Array.from({ length: 12 }, (_, i) => i);
  
  return (
    <motion.div
      className="relative w-10 h-10"
      initial={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
    >
      {isUpNext && (
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          {/* Base glow */}
          <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 via-red-600/10 to-transparent animate-pulse" />
          
          {/* Inner flames - more intense */}
          {innerFlames.map((i) => (
            <motion.div
              key={`inner-${i}`}
              className="absolute bottom-0 left-1/2 w-[3px] bg-gradient-to-t from-yellow-500 via-orange-400 to-transparent"
              style={{
                height: Math.random() * 15 + 10,
                left: `${((i + 0.5) / innerFlames.length) * 100}%`,
                filter: 'blur(0.8px)',
                transformOrigin: 'bottom',
                opacity: 0.9,
              }}
              animate={{
                height: [
                  Math.random() * 15 + 10,
                  Math.random() * 20 + 15,
                  Math.random() * 15 + 10,
                ],
                scaleY: [1, 1.2, 1],
                rotate: [
                  Math.random() * 2 - 1,
                  Math.random() * -2 + 1,
                  Math.random() * 2 - 1,
                ],
              }}
              transition={{
                duration: 0.4 + Math.random() * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.2,
              }}
            />
          ))}

          {/* Outer flames - more spread */}
          {outerFlames.map((i) => (
            <motion.div
              key={`outer-${i}`}
              className="absolute bottom-0 left-1/2 w-[2px] bg-gradient-to-t from-red-500 via-orange-400 via-yellow-300 to-transparent"
              style={{
                height: Math.random() * 18 + 8,
                left: `${(i / outerFlames.length) * 100}%`,
                filter: 'blur(1.2px)',
                transformOrigin: 'bottom',
                opacity: 0.7,
              }}
              animate={{
                height: [
                  Math.random() * 18 + 8,
                  Math.random() * 22 + 12,
                  Math.random() * 18 + 8,
                ],
                scaleY: [1, 1.3, 1],
                rotate: [
                  Math.random() * 4 - 2,
                  Math.random() * -4 + 2,
                  Math.random() * 4 - 2,
                ],
              }}
              transition={{
                duration: 0.6 + Math.random() * 0.4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 0.3,
              }}
            />
          ))}

          {/* Center glow */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-yellow-500/30 via-orange-500/20 to-transparent"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Ember effect */}
          <motion.div
            className="absolute inset-0"
            animate={{
              background: [
                'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.3) 0%, transparent 60%)',
                'radial-gradient(circle at 50% 50%, rgba(255,165,0,0.2) 0%, transparent 50%)',
              ],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-xs font-bold text-gold">
          {format(date, 'd')}
        </div>
      </div>
    </motion.div>
  );
}
