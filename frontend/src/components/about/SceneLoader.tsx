'use client';

import { motion } from 'framer-motion';

export function SceneLoader() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-16 h-16 border-4 border-gold/30 border-t-gold rounded-full"
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <p className="text-gold/70 text-sm font-medium">Loading 3D Scene...</p>
      </motion.div>
    </div>
  );
}
