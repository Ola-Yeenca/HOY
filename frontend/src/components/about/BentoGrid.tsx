'use client';

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

const Scene3D = dynamic(() => import('./Scene3D'), { ssr: false });

const BentoBox = ({ children, className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true }}
    className={`bg-coffee-bean/50 backdrop-blur-sm rounded-lg p-8 border border-dark-gray hover:border-gold transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const BentoGrid = () => {
  return (
    <section className="py-24 bg-coffee-bean text-white-plum">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4 text-gold">Why Choose HOY</h2>
          <p className="text-lg max-w-2xl mx-auto">
            Experience the perfect blend of fashion, technology, and community.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
          {/* Feature 1 - Large Box */}
          <BentoBox className="md:col-span-2 md:row-span-2" delay={0.1}>
            <h3 className="text-3xl font-bold mb-4 text-gold">Innovation at Core</h3>
            <p className="text-white-plum/90 mb-6">
              At House of Young, we're not just following trends - we're creating them.
              Our innovative approach combines cutting-edge technology with timeless fashion principles.
            </p>
            <div className="h-48">
              <Suspense fallback={<div className="w-full h-full bg-coffee-bean/30" />}>
                <Scene3D />
              </Suspense>
            </div>
          </BentoBox>

          {/* Feature 2 */}
          <BentoBox delay={0.2}>
            <h3 className="text-2xl font-bold mb-4 text-gold">Sustainable Fashion</h3>
            <p className="text-white-plum/90">
              Committed to environmental responsibility through eco-friendly practices
              and sustainable materials.
            </p>
          </BentoBox>

          {/* Feature 3 */}
          <BentoBox delay={0.3}>
            <h3 className="text-2xl font-bold mb-4 text-gold">Global Community</h3>
            <p className="text-white-plum/90">
              Connect with fashion enthusiasts worldwide and be part of a growing
              community of innovators.
            </p>
          </BentoBox>

          {/* Feature 4 */}
          <BentoBox delay={0.4}>
            <h3 className="text-2xl font-bold mb-4 text-gold">Expert Curation</h3>
            <p className="text-white-plum/90">
              Every piece is carefully selected by our team of fashion experts and
              industry professionals.
            </p>
          </BentoBox>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;
