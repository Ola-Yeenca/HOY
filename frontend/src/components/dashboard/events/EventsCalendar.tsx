'use client';

import { motion } from 'framer-motion';
import { Calendar } from '@/components/ui/calendar';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { format, parseISO, isAfter, isSameDay, compareAsc, compareDesc } from 'date-fns';
import { useState, useEffect, useMemo } from 'react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import axios from '@/services/api';
import { FEATURED_EVENTS } from '@/data/events';
import { cn } from '@/lib/utils';
import { FaCalendarAlt, FaCrown, FaFire } from 'react-icons/fa';
import Link from 'next/link';
import { FireDate } from '@/components/ui/design-system/FireDate';
import { ThreeDCard } from '@/components/ui/design-system/3DCard';

interface Event {
  id: string | number;
  title: string;
  date: string;
  description: string;
  category: string;
  image?: string;
  location: string;
  dj?: string;
  tag?: string;
  price?: string;
  isHot?: boolean;
}

export default function EventsCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const currentDate = new Date();
        // Sort all events by date
        const sortedEvents = FEATURED_EVENTS.sort((a: Event, b: Event) => 
          compareAsc(parseISO(a.date), parseISO(b.date))
        );
        setEvents(sortedEvents);
      } catch (error) {
        console.error('Error setting events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Memoize filtered events
  const { upcomingEvents, pastEvents } = useMemo(() => {
    const currentDate = new Date();
    const upcoming = events.filter(event => isAfter(parseISO(event.date), currentDate))
      .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
    const past = events.filter(event => !isAfter(parseISO(event.date), currentDate))
      .sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
    
    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const upNextEvent = upcomingEvents[0];

  // Create a map of dates that have events
  const eventDates = useMemo(() => {
    const currentDate = new Date();
    return events
      .filter(event => isAfter(parseISO(event.date), currentDate))
      .reduce((acc, event) => {
        const eventDate = format(parseISO(event.date), 'yyyy-MM-dd');
        acc[eventDate] = {
          ...event,
          isHot: event.tag === 'VIP' || event.featured
        };
        return acc;
      }, {} as Record<string, Event>);
  }, [events]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const matchingEvent = eventDates[dateStr];
      setSelectedEvent(matchingEvent || null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gold mb-4">Events Calendar</h1>
        <p className="text-white/80">Discover and manage your upcoming luxury events</p>
      </div>

      <div className="grid gap-6">
        {selectedEvent && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]">
            <div className="bg-black/80 border border-gold/20 rounded-lg p-6 max-w-md w-full mx-4 relative">
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute -top-10 right-0 text-white/60 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="space-y-4">
                <div className="relative h-48 w-full rounded-lg overflow-hidden">
                  <Image
                    src={selectedEvent.image}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-gold">{selectedEvent.title}</h3>
                  <p className="text-white/80">
                    {format(parseISO(selectedEvent.date), 'EEEE, MMMM do, yyyy')}
                  </p>
                  <p className="text-white/80">{selectedEvent.description}</p>
                  
                  <div className="pt-4">
                    <Link
                      href={`/events/${selectedEvent.id}`}
                      className="inline-block bg-gold/20 hover:bg-gold/30 text-gold px-4 py-2 rounded-lg transition-colors"
                    >
                      View Event Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Card */}
          <Card className="col-span-1 p-6 bg-black/40 backdrop-blur-xl border border-gold/20">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="w-full text-white"
              modifiersStyles={{
                selected: {
                  color: '#D4AF37',
                  fontWeight: 'bold'
                },
                today: {
                  textDecoration: 'underline',
                  textDecorationColor: '#D4AF37',
                  textDecorationThickness: '2px',
                  color: 'white'
                }
              }}
              modifiers={{
                event: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return dateStr in eventDates;
                },
                hot: (date) => {
                  const dateStr = format(date, 'yyyy-MM-dd');
                  return eventDates[dateStr]?.isHot;
                }
              }}
              styles={{
                day_today: { 
                  color: 'white',
                  fontWeight: 'normal'
                },
                day: {
                  color: 'white'
                },
                day_selected: { 
                  color: '#D4AF37',
                  fontWeight: 'bold'
                },
                day_event: {
                  position: 'relative',
                  color: 'white',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    backgroundColor: 'rgba(212, 175, 55, 0.15)',
                    borderRadius: '50%',
                    zIndex: -1
                  }
                },
                day_hot: {
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    background: 'radial-gradient(circle, rgba(255,69,0,0.2) 0%, rgba(255,69,0,0) 70%)',
                    animation: 'pulse 2s infinite'
                  }
                },
                caption: {
                  color: 'white'
                },
                head_cell: {
                  color: 'rgba(255, 255, 255, 0.6)'
                },
                nav_button_previous: {
                  color: 'white'
                },
                nav_button_next: {
                  color: 'white'
                },
                cell: {
                  color: 'white'
                }
              }}
            />
            <style jsx global>{`
              @keyframes pulse {
                0% {
                  transform: translate(-50%, -50%) scale(1);
                  opacity: 0.5;
                }
                50% {
                  transform: translate(-50%, -50%) scale(1.2);
                  opacity: 0.3;
                }
                100% {
                  transform: translate(-50%, -50%) scale(1);
                  opacity: 0.5;
                }
              }
            `}</style>
          </Card>

          {/* Upcoming Events List */}
          <Card className="col-span-1 lg:col-span-2 p-6 bg-black/40 backdrop-blur-xl border border-gold/20">
            <h2 className="text-2xl font-bold text-gold mb-6">Upcoming Events</h2>
            <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "p-4 rounded-xl transition-all duration-300 cursor-pointer",
                      selectedEvent?.id === event.id
                        ? "bg-gold/20 border border-gold/40"
                        : "bg-black/20 border border-gold/10 hover:bg-gold/10"
                    )}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="flex items-center gap-4">
                      {event.tag === 'VIP' && (
                        <div className="flex-shrink-0">
                          <FireDate date={parseISO(event.date)} isUpNext={true} />
                        </div>
                      )}
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={event.image || '/images/event-placeholder.jpg'}
                          alt={event.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold text-white/90 mb-1">{event.title}</h3>
                        <p className="text-sm text-white/60">
                          {format(parseISO(event.date), 'EEEE, MMMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.tag === 'VIP' && (
                          <span className="px-2 py-1 bg-gold/20 rounded-full text-xs text-gold flex items-center gap-1">
                            <FaCrown className="w-3 h-3" />
                            VIP
                          </span>
                        )}
                        {event.isHot && (
                          <span className="px-2 py-1 bg-red-500/20 rounded-full text-xs text-red-500 flex items-center gap-1">
                            <FaFire className="w-3 h-3" />
                            HOT
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-white/60">No upcoming events scheduled</p>
                </div>
              )}
            </div>
          </Card>

          {/* Selected Event Preview */}
          {selectedEvent && (
            <Card className="col-span-1 lg:col-span-3 p-6 bg-black/40 backdrop-blur-xl border border-gold/20">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src={selectedEvent.image || '/images/event-placeholder.jpg'}
                    alt={selectedEvent.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gold mb-4">{selectedEvent.title}</h2>
                  <p className="text-white/80 mb-6">{selectedEvent.description}</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-white/60">
                      <FaCalendarAlt className="text-gold" />
                      {format(parseISO(selectedEvent.date), 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center gap-2 text-white/60">
                      <span className="text-gold">Location:</span>
                      {selectedEvent.location}
                    </div>
                    {selectedEvent.dj && (
                      <div className="flex items-center gap-2 text-white/60">
                        <span className="text-gold">DJ:</span>
                        {selectedEvent.dj}
                      </div>
                    )}
                    {selectedEvent.price && (
                      <div className="flex items-center gap-2 text-white/60">
                        <span className="text-gold">Price:</span>
                        {selectedEvent.price}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  );
}
