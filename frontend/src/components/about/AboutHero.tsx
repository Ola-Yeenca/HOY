'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Scene = dynamic(() => import('./Scene'), { ssr: false });

const AboutHero = () => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative h-screen w-full bg-coffee-bean text-white-plum overflow-hidden"
    >
      <div className="absolute inset-0">
        <Suspense fallback={<div className="w-full h-full bg-coffee-bean" />}>
          <Scene />
        </Suspense>
      </div>

      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <motion.h1
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl font-bold mb-6 text-gold"
          >
            House of Young
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl text-white-plum mb-8"
          >
            Empowering the next generation of fashion through technology and innovation
          </motion.p>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <a
              href="#vision"
              className="inline-block px-8 py-3 bg-gold text-coffee-bean font-semibold rounded-md hover:bg-gold/90 transition-colors duration-200"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutHero;
