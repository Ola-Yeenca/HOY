'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaUsers, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { Event } from '@/types/events';

interface EventsListProps {
  category?: string;
}

export function EventsList({ category = 'all' }: EventsListProps) {
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set());

  const events: Event[] = [
    {
      id: '1',
      title: 'Neon Dreams Festival',
      description: 'Join us for a night of neon-lit electronic music experience.',
      slug: 'neon-dreams-festival',
      image: '/images/events/neon-dreams.jpg',
      date: '2024-12-20',
      start_time: '20:00',
      location: {
        name: 'Neon Arena',
        address: '123 Neon Street',
        city: 'San Francisco',
        latitude: 37.7749,
        longitude: -122.4194
      },
      djs: [
        {
          id: 'dj1',
          name: 'DJ Neon',
          artist_name: 'Neon Master',
          bio: 'Electronic music specialist',
          profile_image: '/images/djs/dj-neon.jpg',
          genres: ['Electronic', 'House'],
          social_media: {}
        }
      ],
      capacity: 500,
      ticket_types: [
        {
          name: 'General Admission',
          price: 50
        }
      ],
      featured_image: '/images/events/neon-dreams-featured.jpg',
      age_restriction: '18+',
      is_featured: true
    },
    {
      id: '2',
      title: 'Deep House Sessions',
      description: 'Experience the deep, soulful sounds of house music.',
      slug: 'deep-house-sessions',
      image: '/images/events/deep-house.jpg',
      date: '2024-12-21',
      start_time: '22:00',
      location: {
        name: 'Underground Club',
        address: '456 Underground Street',
        city: 'San Francisco',
        latitude: 37.7859,
        longitude: -122.4364
      },
      djs: [
        {
          id: 'dj2',
          name: 'DJ Deep',
          artist_name: 'Deep Master',
          bio: 'Deep house specialist',
          profile_image: '/images/djs/dj-deep.jpg',
          genres: ['Deep House'],
          social_media: {}
        }
      ],
      capacity: 400,
      ticket_types: [
        {
          name: 'General Admission',
          price: 40
        }
      ],
      featured_image: '/images/events/deep-house-featured.jpg',
      age_restriction: '18+',
      is_featured: false
    },
    {
      id: '3',
      title: 'Techno Nights',
      description: 'A night of pulsating techno beats.',
      slug: 'techno-nights',
      image: '/images/events/techno-nights.jpg',
      date: '2024-12-22',
      start_time: '23:00',
      location: {
        name: 'The Vault',
        address: '789 Vault Street',
        city: 'San Francisco',
        latitude: 37.7963,
        longitude: -122.4056
      },
      djs: [
        {
          id: 'dj3',
          name: 'DJ Techno',
          artist_name: 'Techno Master',
          bio: 'Techno specialist',
          profile_image: '/images/djs/dj-techno.jpg',
          genres: ['Techno'],
          social_media: {}
        }
      ],
      capacity: 600,
      ticket_types: [
        {
          name: 'General Admission',
          price: 45
        }
      ],
      featured_image: '/images/events/techno-nights-featured.jpg',
      age_restriction: '18+',
      is_featured: true
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
              {event.djs && event.djs.length > 0 && (
                <>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden">
                    <Image
                      src={event.djs[0].profile_image}
                      alt={event.djs[0].name}
                      fill
                      width={80}
                      height={80}
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-chalk text-sm">Featuring</p>
                    <p className="text-gold font-semibold">{event.djs[0].name}</p>
                  </div>
                </>
              )}
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
                <span>{event.start_time}</span>
              </div>
              <div className="flex items-center gap-2 text-chalk">
                <FaMapMarkerAlt className="text-gold" />
                <span>{event.location.name}, {event.location.address}, {event.location.city}</span>
              </div>
              <div className="flex items-center gap-2 text-chalk">
                <FaUsers className="text-gold" />
                <span>{event.capacity} attending</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-chalk">Price</p>
                <p className="text-gold font-bold text-xl">
                  {event.ticket_types && event.ticket_types.length > 0
                    ? `$${event.ticket_types[0].price}`
                    : 'TBA'}
                </p>
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
