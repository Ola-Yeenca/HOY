import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, useScroll, useSpring, useTransform, useInView } from 'framer-motion';
import { FaArrowLeft, FaHeart } from 'react-icons/fa';
import { Event } from '@/types/events';
import { parseISO } from 'date-fns';

interface EventDetailProps {
  id: string;
  initialEvent: Event;
}

export default function EventDetail({ id, initialEvent }: EventDetailProps) {
  const router = useRouter();
  const [event] = useState<Event>(initialEvent);
  const [isLiked, setIsLiked] = useState(false);

  // Refs for scroll animations
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animation for scroll
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Parallax transformations
  const heroScale = useTransform(smoothProgress, [0, 1], [1, 1.1]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.5], [0, 100]);

  // Check if sections are in view
  const isHeroInView = useInView(heroRef, { once: true });
  const isContentInView = useInView(contentRef, { once: true });

  const eventDate = parseISO(event.date);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum">
      {/* Back button */}
      <motion.button
        onClick={() => router.back()}
        className="fixed top-4 left-4 z-50 bg-black/50 p-3 rounded-full hover:bg-black/70 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <FaArrowLeft className="w-6 h-6" />
      </motion.button>

      {/* Hero Section */}
      <motion.div
        ref={heroRef}
        className="relative h-[60vh] w-full overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isHeroInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        {event.video ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src={event.video} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={event.featured_image || event.image || '/images/default-event.jpg'}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-transparent" />
        
        {/* Hero Content */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center text-center px-4"
          style={{ y: titleY }}
        >
          <div className="max-w-4xl">
            <motion.h1 
              className="text-6xl font-bold mb-4 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {event.title}
            </motion.h1>
            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span className="text-gold">{event.location}</span>
              <span className="text-gold">•</span>
              <span className="text-gold">{eventDate.toLocaleDateString()}</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Event Details */}
      <motion.div
        ref={contentRef}
        className="relative z-10 -mt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isContentInView ? 1 : 0, y: isContentInView ? 0 : 20 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-jet-black/50 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gold/10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Event Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gold mb-4">About the Event</h2>
                <p className="text-white-plum/80 leading-relaxed">{event.description}</p>
              </div>
              
              {event.djs && event.djs.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gold mb-4">Featured Artists</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.djs.map((dj) => (
                      <div key={dj.name} className="flex items-center space-x-4 bg-jet-black/30 rounded-xl p-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={dj.profile_image}
                            alt={dj.artist_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gold">{dj.artist_name}</h3>
                          <p className="text-sm text-white-plum/60">{dj.name}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Ticket Info */}
            <div>
              <div className="bg-jet-black/30 rounded-2xl p-6 sticky top-24">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-sm text-white-plum/60">Starting from</p>
                    <p className="text-3xl font-bold text-gold">{event.price}</p>
                  </div>
                  <button
                    onClick={() => setIsLiked(!isLiked)}
                    className="p-3 rounded-full bg-jet-black/50 hover:bg-jet-black/70 transition-colors"
                  >
                    <FaHeart className={`w-6 h-6 ${isLiked ? 'text-gold' : 'text-white-plum/30'}`} />
                  </button>
                </div>

                {event.ticket_types && (
                  <div className="space-y-4 mb-6">
                    {event.ticket_types.map((ticket) => (
                      <div
                        key={ticket.name}
                        className="flex justify-between items-center p-4 rounded-xl bg-jet-black/20 border border-gold/10"
                      >
                        <div>
                          <p className="font-semibold text-gold">{ticket.name}</p>
                          <p className="text-sm text-white-plum/60">€{ticket.price}</p>
                        </div>
                        <button className="px-4 py-2 rounded-full bg-gold text-black font-semibold hover:bg-gold/90 transition-colors">
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 text-sm text-white-plum/60">
                  <div className="flex items-center justify-between">
                    <span>Age Restriction</span>
                    <span className="text-gold">{event.age_restriction}+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Capacity</span>
                    <span className="text-gold">{event.capacity} people</span>
                  </div>
                  {event.category && (
                    <div className="flex items-center justify-between">
                      <span>Category</span>
                      <span className="text-gold">{event.category}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
