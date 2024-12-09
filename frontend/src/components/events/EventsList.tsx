'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

interface Event {
  id: string;
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  price: string;
  attendees: number;
  dj: {
    name: string;
    image: string;
  };
}

interface EventsListProps {
  category?: string;
}

export function EventsList({ category = 'all' }: EventsListProps) {
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());

  const events: Event[] = [
    {
      id: '1',
      title: 'Neon Dreams Festival',
      image: '/images/event-2.jpg',
      date: 'July 20, 2024',
      time: '9:00 PM',
      location: 'Skyline Warehouse, Downtown',
      price: '$45',
      attendees: 850,
      dj: {
        name: 'DJ Cascade',
        image: '/images/dj-1.jpg',
      },
    },
    {
      id: '2',
      title: 'Deep House Sessions',
      image: '/images/event-3.jpg',
      date: 'August 5, 2024',
      time: '10:00 PM',
      location: 'Underground Club, West End',
      price: '$35',
      attendees: 400,
      dj: {
        name: 'Luna Beat',
        image: '/images/dj-2.jpg',
      },
    },
    {
      id: '3',
      title: 'Techno Nights',
      image: '/images/event-4.jpg',
      date: 'August 12, 2024',
      time: '11:00 PM',
      location: 'The Vault, Industrial District',
      price: '$40',
      attendees: 600,
      dj: {
        name: 'Rhythm X',
        image: '/images/dj-3.jpg',
      },
    },
  ];

  const toggleLike = (eventId: string) => {
    setLikedEvents((prev) => {
      const newLiked = new Set(prev);
      if (newLiked.has(eventId)) {
        newLiked.delete(eventId);
      } else {
        newLiked.add(eventId);
      }
      return newLiked;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-jet-black/50 rounded-3xl overflow-hidden backdrop-blur-sm hover:bg-jet-black/60 transition-all duration-300 group"
        >
          <div className="relative h-48">
            <Image
              src={event.image}
              alt={event.title}
              fill
              width={800}
              height={400}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-transparent to-transparent" />
            <button
              onClick={() => toggleLike(event.id)}
              className="absolute top-4 right-4 bg-jet-black/50 p-2 rounded-full backdrop-blur-sm hover:bg-jet-black/70 transition-colors"
            >
              {likedEvents.has(event.id) ? (
                <FaHeart className="text-gold text-xl" />
              ) : (
                <FaRegHeart className="text-gold text-xl" />
              )}
            </button>
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src={event.dj.image}
                  alt={event.dj.name}
                  fill
                  width={80}
                  height={80}
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-chalk text-sm">Featuring</p>
                <p className="text-gold font-semibold">{event.dj.name}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-gold mb-4">{event.title}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-chalk">
                <FaCalendar className="text-gold" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2 text-chalk">
                <FaClock className="text-gold" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-2 text-chalk">
                <FaMapMarkerAlt className="text-gold" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-2 text-chalk">
                <FaUsers className="text-gold" />
                <span>{event.attendees} attending</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-chalk">Price</p>
                <p className="text-gold font-bold text-xl">{event.price}</p>
              </div>
              <Link
                href={`/events/${event.id}`}
                className="bg-gold hover:bg-gold/80 text-jet-black px-6 py-2 rounded-full font-semibold transition-colors"
              >
                Get Tickets
              </Link>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
