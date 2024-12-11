'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { BentoGrid, BentoGridItem } from '@/components/ui/design-system/BentoGrid';
import { ThreeDCard } from '@/components/ui/design-system/3DCard';
import { AnimatedText } from '@/components/ui/design-system/AnimatedText';
import { motion } from 'framer-motion';
import { FaSpinner, FaFilter, FaSearch, FaCalendarAlt, FaPlay, FaCrown } from 'react-icons/fa';
import { format, isAfter, isBefore, parseISO, compareAsc, compareDesc } from 'date-fns';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import axios from '@/services/api';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import { FEATURED_EVENTS } from '@/data/events';
import { Event } from '@/types/events';

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    const fetchEvents = async () => {
      try {
        const response = await axios.get('/events/upcoming');
        const apiEvents = response.data || [];

        // Ensure all events have required fields and valid dates
        const validApiEvents = apiEvents
          .filter((event: Event) => {
            try {
              parseISO(event.date); // Validate date
              return event.id && event.title && event.date; // Ensure required fields exist
            } catch {
              return false;
            }
          });

        // Combine API events with featured events, prioritizing featured events
        const allEvents = [
          ...FEATURED_EVENTS,
          ...validApiEvents.filter((apiEvent: Event) => 
            !FEATURED_EVENTS.find(fe => fe.id === apiEvent.id)
          )
        ];
        
        // Sort events by date, handling invalid dates gracefully
        const sortedEvents = allEvents.sort((a, b) => {
          try {
            return compareAsc(parseISO(a.date), parseISO(b.date));
          } catch {
            return 0; // Keep order unchanged if dates are invalid
          }
        });

        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
        // Use featured events as fallback, ensuring dates are valid
        const sortedFeatured = FEATURED_EVENTS
          .filter(event => {
            try {
              parseISO(event.date);
              return true;
            } catch {
              return false;
            }
          })
          .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
        setEvents(sortedFeatured);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [isAuthenticated, router]);

  // Memoize filtered events based on current date and filter selection
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const currentDate = new Date();
    const upcoming = events.filter(event => isAfter(parseISO(event.date), currentDate))
      .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
    const past = events.filter(event => !isAfter(parseISO(event.date), currentDate))
      .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
    
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  // Get the next upcoming event
  const upNextEvent = upcomingEvents[0];

  // Show loading state while checking authentication
  if (!isAuthenticated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const featuredEvent = events.find(event => event.is_featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white-plum">
      <div className="container mx-auto px-6 py-12">
        {/* Hero Section with Featured Event */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <AnimatedText
                text="Upcoming Events"
                className="text-5xl lg:text-6xl font-bold mb-6"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl text-white-plum/80 mb-8"
              >
                Experience luxury and exclusivity at our carefully curated events
              </motion.p>
              
              {/* Search and Filter */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/30 border border-gold/20 rounded-xl text-white placeholder:text-white/60 focus:outline-none focus:border-gold/40"
                  />
                </div>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-6 py-3 bg-black/30 border border-gold/20 rounded-xl text-white focus:outline-none focus:border-gold/40"
                >
                  <option value="all">All Events</option>
                  <option value="upcoming">Upcoming Only</option>
                  <option value="past">Past Only</option>
                </select>
              </div>
            </div>

            {/* Featured Event Card */}
            {featuredEvent && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold/50 to-gold rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-1000"></div>
                
                <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-black/80 to-black/40 backdrop-blur-sm border border-gold/20">
                  <Image
                    src={featuredEvent.featured_image}
                    alt={featuredEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="mb-4">
                    <span className="inline-block px-4 py-1 bg-gold/20 backdrop-blur-sm rounded-full text-sm text-gold mb-4">
                      Featured Event
                    </span>
                    <h3 className="text-3xl font-bold mb-2">{featuredEvent.title}</h3>
                    <p className="text-white-plum/90 mb-4">
                      {featuredEvent.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-white/60 flex items-center gap-2">
                        <FaCalendarAlt className="text-gold" />
                        {format(parseISO(featuredEvent.date), 'EEEE, MMM d, yyyy')}
                      </div>
                      <span className="text-white-plum/60">•</span>
                      <span className="text-white-plum/60">{featuredEvent.location.name}</span>
                    </div>
                    <button className="group relative px-6 py-2 bg-gold/20 hover:bg-gold/30 backdrop-blur-sm rounded-lg text-gold transition-all duration-300 hover:pl-10">
                      <FaPlay className="absolute left-4 opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      <span>Learn More</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* Events Sections */}
        <section className="space-y-16">
          {/* Up Next Section - Show for 'all' and 'upcoming' filters */}
          {(selectedFilter === 'all' || selectedFilter === 'upcoming') && upcomingEvents.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Up Next</h2>
              {upNextEvent && (
                <ThreeDCard key={upNextEvent.id} className="h-[400px]">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0 }}
                    className="relative h-full group"
                  >
                    <div className="absolute inset-0 rounded-xl overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-black/50 to-black group-hover:opacity-75 transition-opacity duration-500" />
                      <Image
                        src={upNextEvent.image}
                        alt={upNextEvent.title}
                        width={500}
                        height={500}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                    <div className="relative h-full p-8 flex flex-col justify-end">
                      <div className="transform group-hover:-translate-y-4 transition-transform duration-500">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="text-sm text-white/60 flex items-center gap-2">
                            <FaCalendarAlt className="text-gold" />
                            {format(parseISO(upNextEvent.date), 'EEEE, MMM d, yyyy')}
                          </div>
                          {upNextEvent.category === 'VIP' && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-gold/30 backdrop-blur-sm rounded-full text-sm text-gold">
                              <FaCrown className="w-3 h-3" />
                              VIP
                            </span>
                          )}
                        </div>
                        <h3 className="text-2xl font-bold mb-3">{upNextEvent.title}</h3>
                        <p className="text-white-plum/80 mb-6 line-clamp-2">
                          {upNextEvent.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-semibold">
                              {upNextEvent.ticket_types.length > 0 
                                ? `From €${Math.min(...upNextEvent.ticket_types.map(t => t.price))}` 
                                : 'Free'}
                            </span>
                          </div>
                          <button className="group relative px-6 py-2 bg-transparent border border-gold text-gold rounded-lg overflow-hidden">
                            <span className="relative z-10 group-hover:text-jet-black transition-colors duration-300">
                              Learn More
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
              )}
            </div>
          )}

          {/* Upcoming Events Section - Show for 'all' and 'upcoming' filters */}
          {(selectedFilter === 'all' || selectedFilter === 'upcoming') && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Upcoming Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingEvents.slice(1).map((event, index) => (
                  <ThreeDCard key={event.id} className="h-[500px]">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
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
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <FaCalendarAlt className="text-gold" />
                              {format(parseISO(event.date), 'EEEE, MMM d, yyyy')}
                            </div>
                            {event.category === 'VIP' && (
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
                              <span className="text-gold font-semibold">
                                {event.ticket_types.length > 0 
                                  ? `From €${Math.min(...event.ticket_types.map(t => t.price))}` 
                                  : 'Free'}
                              </span>
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
              {upcomingEvents.length === 0 && (
                <div className="text-center py-8 bg-black/30 rounded-xl border border-gold/20">
                  <p className="text-white-plum/60">No upcoming events scheduled</p>
                </div>
              )}
            </div>
          )}

          {/* Past Events Section - Show for 'all' and 'past' filters */}
          {(selectedFilter === 'all' || selectedFilter === 'past') && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Past Events</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pastEvents.map((event, index) => (
                  <ThreeDCard key={event.id} className="h-[500px]">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 }}
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
                            <div className="text-sm text-white/60 flex items-center gap-2">
                              <FaCalendarAlt className="text-gold" />
                              {format(parseISO(event.date), 'EEEE, MMM d, yyyy')}
                            </div>
                            {event.category === 'VIP' && (
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
                              <span className="text-gold font-semibold">
                                {event.ticket_types.length > 0 
                                  ? `From €${Math.min(...event.ticket_types.map(t => t.price))}` 
                                  : 'Free'}
                              </span>
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
              {pastEvents.length === 0 && (
                <div className="text-center py-8 bg-black/30 rounded-xl border border-gold/20">
                  <p className="text-white-plum/60">No past events to show</p>
                </div>
              )}
            </div>
          )}

          {/* Global No Events Message */}
          {((selectedFilter === 'upcoming' && 
             upcomingEvents.length === 0) ||
            (selectedFilter === 'past' && 
             pastEvents.length === 0)) && (
            <div className="text-center py-16">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl text-white-plum/60"
              >
                No events found for the selected filter
              </motion.p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
