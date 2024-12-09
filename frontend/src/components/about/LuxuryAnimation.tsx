'use client';

import { motion } from 'framer-motion';

export function LuxuryAnimation() {
  return (
    <div className="relative w-full h-[400px] overflow-hidden rounded-xl bg-gradient-to-br from-black to-coffee-bean">
      {/* Animated gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-gold/20 to-transparent animate-shimmer" />
      
      {/* Animated text */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute inset-0 flex flex-col items-center justify-center text-center p-6"
      >
        <motion.h1 
          className="text-7xl font-playfair text-gold mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ 
            duration: 1.2,
            ease: "easeOut"
          }}
        >
          House Of Young
        </motion.h1>
        <motion.p 
          className="text-xl text-gold/80 max-w-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          The Future is HOY!
        </motion.p>
      </motion.div>

      {/* Decorative elements */}
      <div className="absolute inset-0">
        {/* Top left corner decoration */}
        <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-gold/30" />
        {/* Bottom right corner decoration */}
        <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-gold/30" />
      </div>

      {/* Animated particles */}
      <div className="absolute inset-0">
        {[...Array(5)].map((_, i) => {
          // Use predetermined positions based on index
          const positions = [
            { x: 100, y: 100 },
            { x: 200, y: 150 },
            { x: 300, y: 200 },
            { x: 150, y: 250 },
            { x: 250, y: 300 }
          ];
          
          return (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gold/20 rounded-full"
              initial={{ 
                x: positions[i].x,
                y: positions[i].y,
                opacity: 0 
              }}
              animate={{ 
                x: [positions[i].x, positions[i].x + 100],
                y: [positions[i].y, positions[i].y + 100],
                opacity: [0, 1, 0] 
              }}
              transition={{ 
                duration: 5 + i * 2,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
