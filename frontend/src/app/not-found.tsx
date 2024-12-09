"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTools, FaHome, FaRocket } from "react-icons/fa";
import Link from "next/link";
import { useEffect, useState } from "react";

// Animation references from default_urlconf.html
const smokeAnimation = {
  transform: ["translate3d(-5px, 0, 0)", "translate3d(5px, 0, 0)"],
};

const flameAnimation = {
  transform: ["translate3d(0, 0, 0)", "translate3d(0, 3px, 0)"],
};

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AnimatePresence>
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#2e353d] to-[#23282e]">
        {/* Animated particles */}
        {mounted && (
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 bg-gold/20 rounded-full"
                initial={{
                  x: `${Math.random() * 100}%`,
                  y: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: ["0%", "-100%"],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative z-10 container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              className="relative inline-block mb-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <FaRocket className="text-6xl text-gold transform -rotate-45" />
            </motion.div>

            <motion.h1
              className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-[#ffd700] to-gold mb-6"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              404
            </motion.h1>

            <motion.div
              className="space-y-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <p className="text-xl text-white-plum/80">
                Houston, we have a problem! This page is lost in space.
              </p>

              <motion.div
                className="flex items-center justify-center gap-4 mt-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Link href="/">
                  <motion.button
                    className="px-6 py-3 bg-gold/10 hover:bg-gold/20 text-gold rounded-full flex items-center gap-2 transition-colors duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FaHome className="text-lg" />
                    <span>Return to Base</span>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
