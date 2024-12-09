'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { Event, getEvent } from '@/services/events';
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion';
import Image from 'next/image';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaHeart, FaShare, FaTicketAlt } from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { ThreeDCard } from '../ui/design-system/3DCard';
import { FloatingOrb } from '../ui/design-system/FloatingOrb';

interface EventDetailProps {
  id: string;
  initialEvent?: Event;
}

export default function EventDetail({ id, initialEvent }: EventDetailProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(initialEvent || null);
  const [loading, setLoading] = useState(!initialEvent);
  const [error, setError] = useState<string | null>(null);
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

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        setError('Event ID is required');
        setLoading(false);
        return;
      }

      if (initialEvent) {
        setEvent(initialEvent);
        setLoading(false);
        return;
      }

      try {
        const eventData = await getEvent(id);
        if (!eventData) {
          setError('Event not found');
          router.push('/404');
          return;
        }
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event:', error);
        setError('Failed to load event');
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, router, initialEvent]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum flex items-center justify-center">
        <div className="text-xl">{error || 'Event not found'}</div>
      </div>
    );
  }

  const eventDate = parseISO(event.date);

  return (
    <div ref={containerRef} className="relative min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum">
      {/* Floating Orbs */}
      <FloatingOrb className="top-20 left-20" color="gold" size="lg" delay={0} />
      <FloatingOrb className="bottom-40 right-20" color="gold" size="xl" delay={0.5} />
      <FloatingOrb className="top-60 right-40" color="coffee-bean" size="md" delay={1} />

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
            src={event.featured_image}
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
              <span className="text-gold">{format(eventDate, 'MMMM d, yyyy')}</span>
              <span className="text-white-plum/80">•</span>
              <span className="text-gold">{event.location.name}</span>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Section */}
      <motion.div
        ref={contentRef}
        className="relative z-10 bg-gradient-to-br from-coffee-bean to-jet-black"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: isContentInView ? 1 : 0, y: isContentInView ? 0 : 50 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsLiked(!isLiked)}
              className="bg-black/30 p-3 rounded-full hover:bg-black/50 transition-colors"
            >
              <FaHeart className={`w-6 h-6 ${isLiked ? 'text-red-500' : 'text-white-plum/50'}`} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-black/30 p-3 rounded-full hover:bg-black/50 transition-colors"
            >
              <FaShare className="w-6 h-6 text-white-plum/50" />
            </motion.button>
          </div>

          {/* Event Details Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ThreeDCard>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Event Details</h3>
                <div className="flex items-center">
                  <FaCalendar className="w-5 h-5 text-gold mr-3" />
                  <span>{format(eventDate, 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center">
                  <FaClock className="w-5 h-5 text-gold mr-3" />
                  <span>{event.start_time} - {event.end_time}</span>
                </div>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="w-5 h-5 text-gold mr-3" />
                  <div>
                    <div>{event.location.name}</div>
                    <div className="text-sm text-white-plum/60">{event.location.address}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaUsers className="w-5 h-5 text-gold mr-3" />
                  <span>Capacity: {event.capacity} people</span>
                </div>
              </div>
            </ThreeDCard>

            <ThreeDCard>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-semibold mb-4">Ticket Information</h3>
                {event.ticket_types?.length > 0 && event.ticket_types.map((ticket, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between p-3 bg-black/20 rounded-lg"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div>
                      <div className="font-medium">{ticket.name}</div>
                      <div className="text-sm text-white-plum/60">${ticket.price}</div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gold text-black rounded-lg font-medium flex items-center space-x-2"
                    >
                      <FaTicketAlt className="w-4 h-4" />
                      <span>Buy</span>
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </ThreeDCard>
          </div>

          {/* Description */}
          <motion.div
            className="prose prose-invert max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-semibold mb-4">About This Event</h2>
            <p className="text-lg leading-relaxed">{event.description}</p>
          </motion.div>

          {/* Featured DJs */}
          {event.djs?.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-semibold mb-6">Featured DJs</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {event.djs.map((dj, index) => (
                  <ThreeDCard key={index} className="bg-black/20">
                    <motion.div
                      className="p-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-gold">
                        <Image
                          src={dj.profile_image}
                          alt={dj.artist_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-xl font-semibold text-center mb-2">{dj.artist_name}</h3>
                      <p className="text-sm text-white-plum/70 text-center mb-4">{dj.name}</p>
                    </motion.div>
                  </ThreeDCard>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
