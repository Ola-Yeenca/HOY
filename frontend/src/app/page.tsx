'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { GlowEffect } from '@/components/ui/GlowEffect';
import { BentoGrid, BentoGridItem } from '@/components/ui/design-system/BentoGrid';
import { ThreeDCard } from '@/components/ui/design-system/3DCard';
import { AnimatedText } from '@/components/ui/design-system/AnimatedText';
import { FaMusic, FaTicketAlt, FaUsers, FaRegCalendarAlt, FaCalendarCheck, FaStar, FaHeart, FaClock, FaArrowRight } from 'react-icons/fa';
import { format } from 'date-fns';
import { FEATURED_EVENTS } from '@/data/events';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/services/api';

// Landing page for non-authorized users
function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-jet-black via-coffee-bean to-jet-black">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gold/20 rounded-full filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gold/10 rounded-full filter blur-[100px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-coffee-bean/30 rounded-full filter blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10 container mx-auto px-6 h-screen">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col justify-center"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <AnimatedText
                  text="House of Young"
                  className="text-7xl lg:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="overflow-hidden h-20 mb-8"
              >
                <motion.div
                  animate={{ y: ["0%", "-33.33%", "-66.66%", "0%"] }}
                  transition={{
                    duration: 6,
                    ease: "linear",
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl md:text-3xl font-light text-gold/90">Experience Luxury</h2>
                  <h2 className="text-2xl md:text-3xl font-light text-gold/90">Create Memories</h2>
                  <h2 className="text-2xl md:text-3xl font-light text-gold/90">Join the Elite</h2>
                </motion.div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-white-plum/80 text-lg mb-12 max-w-lg"
              >
                Step into a world where every moment is crafted for the extraordinary. 
                Join Europe's most exclusive entertainment community.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="flex gap-6"
              >
                <Link href="/register">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-xl overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:text-jet-black transition-colors duration-300">
                      Join Now
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gold"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ type: "tween" }}
                    />
                  </motion.button>
                </Link>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-black/30 backdrop-blur-sm text-gold font-bold rounded-xl hover:bg-black/40 transition-colors"
                  >
                    Sign In
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Glowing Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-full flex items-center justify-center py-12"
            >
              <div className="relative group w-full">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold/50 to-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                {/* Card Content */}
                <div className="relative aspect-[4/3] w-full max-w-2xl rounded-xl overflow-hidden bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm border border-gold/20">
                  {/* Video */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  >
                    <source src="/videos/VIDEO-2024-11-30-12-53-05.mp4" type="video/mp4" />
                  </video>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Card Description - Shows on Hover */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileHover={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex flex-col justify-end p-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  >
                    <h3 className="text-2xl font-bold text-gold mb-2">Elite Experience</h3>
                    <p className="text-white-plum/90">
                      Discover a new level of nightlife luxury. Access exclusive events, 
                      VIP treatment, and unforgettable moments.
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Events Grid */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedText
              text="Upcoming Events"
              className="text-5xl md:text-6xl font-bold mb-6"
            />
            <p className="text-xl text-white-plum/80 max-w-2xl mx-auto">
              Experience exclusive events curated for those who appreciate the extraordinary
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED_EVENTS.slice(0, 6).map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ThreeDCard>
                  <div className="group relative overflow-hidden rounded-xl">
                    <div className="aspect-[4/5]">
                      <Image
                        src={event.image}
                        alt={event.title}
                        width={800}
                        height={1000}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <div className="bg-gold/10 backdrop-blur-sm rounded-lg px-3 py-1 text-gold text-sm inline-block mb-3">
                          {event.category}
                        </div>
                        <h3 className="text-2xl font-bold text-gold mb-2">{event.title}</h3>
                        <p className="text-white-plum/90 mb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          {event.description}
                        </p>
                        <div className="flex flex-col gap-4">
                          <div className="flex items-center gap-4 text-sm text-white-plum/60">
                            <span>{format(new Date(event.date), 'MMM dd, yyyy')}</span>
                            <span>•</span>
                            <span>{event.location.name}</span>
                          </div>
                          
                          {/* Call to Action for Non-authenticated Users */}
                          <div className="flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                            <Link href="/register" className="w-full">
                              <button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                Register to Book Event
                              </button>
                            </Link>
                            <Link href="/login" className="w-full">
                              <button className="w-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-gold/30 text-gold font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                                Sign In
                              </button>
                            </Link>
                            <div className="flex items-center gap-2 justify-center mt-2">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-black bg-coffee-bean"></div>
                                <div className="w-6 h-6 rounded-full border-2 border-black bg-coffee-bean"></div>
                                <div className="w-6 h-6 rounded-full border-2 border-black bg-coffee-bean"></div>
                              </div>
                              <span className="text-xs text-white-plum/70">
                                Join {Math.floor(Math.random() * 50) + 100} others attending
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ThreeDCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-32 bg-black/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <AnimatedText
              text="Captured Moments"
              className="text-5xl md:text-6xl font-bold mb-6"
            />
            <p className="text-xl text-white-plum/80 max-w-2xl mx-auto">
              Step into our world of exclusive experiences
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[300px]">
            {Array.from({ length: 8 }).map((_, index) => (
              <motion.div
                key={index}
                className={`relative rounded-xl overflow-hidden group cursor-pointer ${
                  index === 3 || index === 6 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <Image
                  width={500}
                  height={500}
                  src={`/images/gallery/IMG_${2797 + index}.jpg`}
                  alt={`Gallery moment ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                
                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <motion.div
                    initial={false}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="text-white"
                  >
                    <h3 className="text-xl font-bold text-gold mb-2">Moment {index + 1}</h3>
                    <p className="text-white-plum/90 text-sm mb-4">Capturing the essence of unforgettable nights</p>
                    
                    {/* Call to Action for Non-authenticated Users */}
                    <div className="flex flex-col gap-3">
                      <Link href="/register" className="w-full">
                        <button className="w-full bg-gold hover:bg-gold/90 text-black font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                          Register to Download
                        </button>
                      </Link>
                      <Link href="/login" className="w-full">
                        <button className="w-full bg-black/40 hover:bg-black/60 backdrop-blur-sm border border-gold/30 text-gold font-semibold py-2 px-4 rounded-lg transition-colors text-sm">
                          Sign In
                        </button>
                      </Link>
                      <p className="text-xs text-white-plum/70 text-center mt-1">
                        Join us to access full gallery features
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover opacity-30"
          >
            <source src="/videos/cta-background.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-coffee-bean via-jet-black/50 to-jet-black" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <AnimatedText
              text="Join the Elite"
              className="text-6xl md:text-7xl font-bold mb-6"
            />
            <p className="text-xl text-white-plum/80 mb-12 max-w-2xl mx-auto">
              Experience nightlife redefined. Join House of Young and become part of Europe's most exclusive entertainment community.
            </p>
            <Link href="/register">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-12 py-6 bg-gold text-jet-black font-bold text-xl rounded-xl hover:bg-gold/90 transition-colors"
              >
                Start Your Journey
              </motion.button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-coffee-bean to-jet-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
}
