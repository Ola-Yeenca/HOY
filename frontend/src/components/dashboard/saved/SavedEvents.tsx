'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { FaBookmark, FaCalendar, FaMapMarkerAlt, FaShare } from 'react-icons/fa';

interface SavedEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

export default function SavedEvents() {
  const [events] = useState<SavedEvent[]>([
    {
      id: '1',
      title: "New Year's Eve Gala",
      date: 'December 31, 2024',
      location: 'The Ritz-Carlton, San Francisco',
      description: 'Ring in the new year with an unforgettable night of luxury and celebration',
      image: '/images/events/nye-gala.jpg',
      price: '$1,000',
      category: 'Gala'
    },
    {
      id: '2',
      title: 'Summer Yacht Party',
      date: 'July 15, 2024',
      location: 'Marina Bay, Miami',
      description: 'Experience the ultimate luxury yacht party with stunning ocean views',
      image: '/images/events/yacht-party.jpg',
      price: '$1,500',
      category: 'Party'
    }
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gold mb-4">Saved Events</h1>
        <p className="text-white/80">Your curated collection of upcoming luxury events</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {events.map((event) => (
          <Card
            key={event.id}
            className="overflow-hidden bg-black/40 backdrop-blur-xl border border-gold/20 group"
          >
            <div className="relative h-48">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gold/20 backdrop-blur-sm flex items-center justify-center text-gold hover:bg-gold/30 transition-colors">
                <FaShare className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gold mb-2">{event.title}</h3>
                  <div className="flex items-center gap-4 text-white/60">
                    <div className="flex items-center gap-2">
                      <FaCalendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaMapMarkerAlt className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
                <button className="text-gold">
                  <FaBookmark className="w-6 h-6" />
                </button>
              </div>

              <p className="text-white/80 mb-6">{event.description}</p>

              <div className="flex items-center justify-between">
                <div>
                  <span className="px-3 py-1 rounded-full bg-gold/20 text-gold text-sm">
                    {event.category}
                  </span>
                  <span className="ml-4 text-gold font-semibold">{event.price}</span>
                </div>
                <button className="px-6 py-2 rounded-full bg-gold text-black font-semibold hover:bg-gold/90 transition-colors">
                  View Details
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {events.length === 0 && (
        <Card className="p-8 text-center bg-black/40 backdrop-blur-xl border border-gold/20">
          <FaBookmark className="w-12 h-12 text-gold/40 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gold mb-2">No Saved Events</h2>
          <p className="text-white/80 mb-6">
            You haven't saved any events yet. Browse our events and save your favorites!
          </p>
          <button className="px-6 py-3 rounded-full bg-gold text-black font-semibold hover:bg-gold/90 transition-colors">
            Explore Events
          </button>
        </Card>
      )}
    </motion.div>
  );
}
