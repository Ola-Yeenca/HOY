'use client';

import { Suspense, useEffect, useState } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { format, compareAsc, parseISO, isFuture } from 'date-fns';
import { FaCalendarCheck, FaStar, FaHeart, FaUserFriends, FaBell, FaPlay, FaCrown, FaTicketAlt } from 'react-icons/fa';
import { AnimatedText } from '../ui/design-system/AnimatedText';
import { ThreeDCard } from '../ui/design-system/3DCard';
import { FEATURED_EVENTS } from '@/data/events';
import Link from 'next/link';
import { Loader } from '../ui/loader';
import { FloatingOrb } from '../ui/design-system/FloatingOrb';
import axios from '@/services/api';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  profile?: {
    profile_image?: string;
  };
}

interface UserDashboardProps {
  user: User;
}

interface Event {
  id: string | number;
  title: string;
  date: string;
  description: string;
  image: string;
  location: string;
  dj?: string;
  tag?: string;
  price?: string;
  vip?: boolean;
}

function DashboardContent({ user }: UserDashboardProps) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
  const [stats, setStats] = useState({
    eventsAttended: '...',
    membershipTier: '...',
    perksAvailable: '...',
    monthlyEvents: '...',
    notifications: []
  });
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setStats({
        eventsAttended: '12',
        membershipTier: 'VIP',
        perksAvailable: '8',
        monthlyEvents: '4',
        notifications: []
      });
    };
    loadStats();
  }, []);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        let apiEvents: Event[] = [];
        
        try {
          // Try to load events from API
          const response = await axios.get('/events/upcoming');
          if (response?.data?.events && Array.isArray(response.data.events)) {
            apiEvents = response.data.events.filter((event: any) => {
              // Validate API event data
              return (
                event?.id &&
                event?.title &&
                event?.date &&
                event?.description &&
                event?.image &&
                event?.location &&
                typeof event.id !== 'undefined' &&
                typeof event.title === 'string' &&
                typeof event.date === 'string' &&
                typeof event.description === 'string' &&
                typeof event.image === 'string' &&
                typeof event.location === 'string'
              );
            });
          }
        } catch (apiError) {
          console.warn('Failed to fetch events from API:', apiError);
          // Continue with featured events only
        }

        // Combine and deduplicate events
        const combinedEvents = [
          ...FEATURED_EVENTS,
          ...apiEvents.filter(apiEvent => 
            !FEATURED_EVENTS.some(fe => fe.id === apiEvent.id)
          )
        ];

        // Process and filter events
        const validEvents = combinedEvents
          .filter(event => {
            try {
              return event?.date && isFuture(parseISO(event.date));
            } catch (err) {
              console.warn(`Invalid date for event ${event?.id}:`, err);
              return false;
            }
          })
          .sort((a, b) => {
            try {
              return compareAsc(parseISO(a.date), parseISO(b.date));
            } catch (err) {
              console.warn('Error comparing dates:', err);
              return 0;
            }
          })
          .slice(0, 4);

        setUpcomingEvents(validEvents);
      } catch (error) {
        console.error('Error in loadDashboardData:', error);
        
        // Fallback to featured events with proper error handling
        const fallbackEvents = FEATURED_EVENTS
          .filter(event => {
            try {
              return event?.date && isFuture(parseISO(event.date));
            } catch (err) {
              console.warn(`Invalid date for featured event ${event?.id}:`, err);
              return false;
            }
          })
          .sort((a, b) => {
            try {
              return compareAsc(parseISO(a.date), parseISO(b.date));
            } catch (err) {
              console.warn('Error comparing dates:', err);
              return 0;
            }
          })
          .slice(0, 4);

        setUpcomingEvents(fallbackEvents);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum">
      {/* Floating Orbs */}
      <FloatingOrb className="top-20 left-20" color="gold" size="lg" delay={0} />
      <FloatingOrb className="bottom-40 right-20" color="gold" size="xl" delay={0.5} />
      <FloatingOrb className="top-60 right-40" color="coffee-bean" size="md" delay={1} />

      {/* Hero Section */}
      <section className="relative min-h-[80vh] w-full overflow-hidden">
        {/* Animated Background */}
        <motion.div 
          className="absolute inset-0 z-0"
          style={{ y }}
        >
          <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gold/20 rounded-full filter blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/10 rounded-full filter blur-[120px] animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-coffee-bean/30 rounded-full filter blur-[150px] animate-pulse delay-1000" />
        </motion.div>

        {/* Top Navigation */}
        <motion.div 
          className="absolute top-0 left-0 right-0 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between py-6">
              <Link href="/" className="text-gold font-bold text-2xl">
                House of Young
              </Link>
              <div className="flex items-center gap-8">
                <AnimatePresence>
                  {stats.notifications.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="relative group"
                    >
                      <button className="relative">
                        <FaBell className="w-6 h-6 text-gold/80 group-hover:text-gold transition-colors" />
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-gold rounded-full">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                        </span>
                      </button>
                      <div className="absolute right-0 mt-2 w-64 bg-jet-black/90 backdrop-blur-xl rounded-xl border border-gold/20 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {stats.notifications.map((notification, index) => (
                          <div key={index} className="p-4 border-b border-gold/10 last:border-0">
                            <p className="text-sm text-white-plum">{notification}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Link href="/profile">
                  <motion.div 
                    className="relative group"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.profile?.profile_image ? (
                      <>
                        <div className="absolute -inset-1 bg-gradient-to-r from-gold via-gold/50 to-gold rounded-full blur opacity-30 group-hover:opacity-75 transition duration-1000"></div>
                        <Image
                          src={user.profile.profile_image} 
                          alt={`${user.first_name} ${user.last_name}`} 
                          width={40}
                          height={40}
                          className="relative w-10 h-10 rounded-full border-2 border-gold/30 group-hover:border-gold transition-colors"
                        />
                      </>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold border-2 border-gold/30">
                        {user.first_name[0]}
                      </div>
                    )}
                  </motion.div>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-6 h-[80vh]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 h-full items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col justify-center"
            >
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-gold/80 text-xl mb-4"
              >
                Welcome to your exclusive space
              </motion.p>
              <motion.div className="mb-8">
                <AnimatedText
                  text={`${user.first_name} ${user.last_name}`}
                  className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 gap-6 mb-8"
              >
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-gold/10">
                  <div className="text-4xl font-bold text-gold mb-2">{stats.eventsAttended}</div>
                  <div className="text-white-plum/60">Events Attended</div>
                  <div className="text-sm text-gold/60 mt-2">+{stats.monthlyEvents} this month</div>
                </div>
                <div className="bg-black/30 backdrop-blur-xl rounded-xl p-6 border border-gold/10">
                  <div className="text-4xl font-bold text-gold mb-2">{stats.membershipTier}</div>
                  <div className="text-white-plum/60">Member Status</div>
                  <div className="text-sm text-gold/60 mt-2">{stats.perksAvailable} perks available</div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex gap-6"
              >
                <Link href="/dashboard/events">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative px-8 py-4 bg-transparent border-2 border-gold text-gold font-bold rounded-xl overflow-hidden"
                  >
                    <span className="relative z-10 group-hover:text-jet-black transition-colors duration-300">
                      Events Calendar
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gold"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: 0 }}
                      transition={{ type: "tween" }}
                    />
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Right Content - Featured Event */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative h-full flex items-center justify-center"
            >
              <div className="relative group w-full max-w-2xl">
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold/50 to-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                {/* Card Content */}
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm border border-gold/20">
                  {/* Video */}
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  >
                    <source src="/videos/VIDEO-2024-11-30-12-53-37.mp4" type="video/mp4" />
                  </video>

                  {/* Overlay Content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Featured Event Info */}
                  <div className="absolute inset-0 p-8 flex flex-col justify-end">
                    <div className="mb-4">
                      <span className="inline-block px-4 py-1 bg-gold/20 backdrop-blur-sm rounded-full text-sm text-gold mb-4">
                        Featured Event
                      </span>
                      <h3 className="text-3xl font-bold mb-2">New Year's Eve Gala</h3>
                      <p className="text-white-plum/90 mb-4">
                        Join us for an unforgettable night of luxury and celebration.
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="text-gold font-semibold">Dec 31, 2024</span>
                        <span className="text-white-plum/60">-</span>
                        <span className="text-white-plum/60">9:00 PM</span>
                      </div>
                      <button className="group relative px-6 py-2 bg-gold/20 hover:bg-gold/30 backdrop-blur-sm rounded-lg text-gold transition-all duration-300 hover:pl-10">
                        <FaPlay className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                        <span>Learn More</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="relative py-20">
        <div className="container mx-auto px-6">
          {/* Upcoming Events Grid */}
          <div className="mb-20">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gold via-white to-gold">
                  Your Upcoming Events
                </h2>
                <p className="text-white-plum/60">Experience luxury at its finest</p>
              </div>
              <Link 
                href="/events"
                className="group relative px-6 py-2 bg-transparent border border-gold text-gold rounded-lg overflow-hidden"
              >
                <span className="relative z-10 group-hover:text-jet-black transition-colors duration-300">
                  View All Events
                </span>
                <motion.div
                  className="absolute inset-0 bg-gold"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ type: "tween" }}
                />
              </Link>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="h-[500px] bg-black/30 backdrop-blur-sm rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.map((event, index) => (
                  <ThreeDCard key={event.id} className="h-[500px]">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 }}
                      className="relative h-full group"
                    >
                      <div className="absolute inset-0 rounded-xl overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-black/50 to-black group-hover:opacity-75 transition-opacity duration-500" />
                        <Image
                          src={event.image}
                          alt={event.title}
                          width={500}
                          height={500}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="relative h-full p-8 flex flex-col justify-end">
                        <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="inline-block px-4 py-1 bg-gold/20 backdrop-blur-sm rounded-full text-sm text-gold">
                              {format(new Date(event.date), 'MMM d, yyyy')}
                            </span>
                            {event.vip && (
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/30 backdrop-blur-sm rounded-full text-sm text-gold">
                                <FaCrown className="w-3 h-3" />
                                VIP
                              </span>
                            )}
                          </div>
                          <h3 className="text-2xl font-bold mb-3">{event.title}</h3>
                          <p className="text-white-plum/80 mb-6 line-clamp-2">
                            {event.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <FaTicketAlt className="text-gold" />
                              <span className="text-gold font-semibold">{event.price}</span>
                            </div>
                            <button className="group relative px-6 py-2 bg-transparent border border-gold text-gold rounded-lg overflow-hidden">
                              <span className="relative z-10 group-hover:text-jet-black transition-colors duration-300">
                                Book Now
                              </span>
                              <motion.div
                                className="absolute inset-0 bg-gold"
                                initial={{ x: "-100%" }}
                                whileHover={{ x: 0 }}
                                transition={{ type: "tween" }}
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </ThreeDCard>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FaCalendarCheck className="w-8 h-8" />,
                title: 'Event Calendar',
                description: 'View your upcoming events and schedule',
                href: '/dashboard/events',
                gradient: 'from-purple-500/20 to-blue-500/20'
              },
              {
                icon: <FaStar className="w-8 h-8" />,
                title: 'VIP Benefits',
                description: 'Explore your exclusive member perks',
                href: '/dashboard/benefits',
                gradient: 'from-amber-500/20 to-orange-500/20'
              },
              {
                icon: <FaUserFriends className="w-8 h-8" />,
                title: 'Your Network',
                description: 'Connect with other elite members',
                href: '/dashboard/network',
                gradient: 'from-emerald-500/20 to-teal-500/20'
              },
              {
                icon: <FaHeart className="w-8 h-8" />,
                title: 'Saved Events',
                description: 'Quick access to your bookmarked events',
                href: '/dashboard/saved',
                gradient: 'from-red-500/20 to-pink-500/20'
              }
            ].map((item, index) => (
              <Link key={item.title} href={item.href}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative p-8 rounded-xl border border-gold/10 hover:border-gold/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                >
                  {/* Background Gradient */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                  />
                  <div className="absolute inset-0 backdrop-blur-xl bg-black/20" />
                  
                  {/* Content */}
                  <div className="relative">
                    <div className="text-gold mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white-plum/60">{item.description}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function UserDashboard(props: UserDashboardProps) {
  return (
    <Suspense fallback={<Loader className="w-12 h-12 text-gold" />}>
      <DashboardContent {...props} />
    </Suspense>
  );
}
