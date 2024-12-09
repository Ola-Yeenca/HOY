'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { FaCalendar, FaClock, FaMapMarkerAlt, FaHeart, FaTicketAlt, FaUsers } from 'react-icons/fa';
import { IoMdPricetags } from 'react-icons/io';

interface EventCardProps {
  event: {
    id: string;
    slug: string;
    title: string;
    description: string;
    date: string;
    start_time: string;
    end_time: string;
    location: {
      name: string;
      address: string;
    };
    featured_image: string;
    capacity: number;
    age_restriction: number;
    ticket_types: Array<{
      name: string;
      price: number;
    }>;
    djs: Array<{
      name: string;
      artist_name: string;
      profile_image: string;
    }>;
    is_featured: boolean;
  };
}

export const EventCard = ({ event }: EventCardProps) => {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const lowestPrice = Math.min(...event.ticket_types.map(ticket => ticket.price));
  
  // Initial render without animations
  if (!mounted) {
    return (
      <div className="event-card-wrapper relative bg-jet-black/30 rounded-xl overflow-hidden">
        {/* Featured Badge */}
        {event.is_featured && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gold text-dark-gray text-xs font-bold px-3 py-1 rounded-full">
              Featured
            </div>
          </div>
        )}

        {/* Event Image */}
        <div className="relative aspect-[2/1] overflow-hidden">
          <Image
            src={event.featured_image}
            alt={event.title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Event Content */}
        <div className="p-4 relative">
          {/* Title and Like Button */}
          <div className="flex justify-between items-start mb-1">
            <h3 className="text-lg font-semibold text-white line-clamp-1">{event.title}</h3>
            <button className="text-2xl">
              <FaHeart className="text-white-plum/50" />
            </button>
          </div>

          {/* Description */}
          <p className="text-sm text-white-plum/80 line-clamp-2 mb-2">{event.description}</p>

          {/* Event Details */}
          <div className="space-y-1 mb-2">
            <div className="flex items-center text-xs text-white-plum/80">
              <FaCalendar className="mr-1 text-gold w-3 h-3" />
              {format(new Date(event.date), 'MMM d, yyyy')}
            </div>
            <div className="flex items-center text-xs text-white-plum/80">
              <FaClock className="mr-1 text-gold w-3 h-3" />
              {event.start_time}
            </div>
            <div className="flex items-center text-xs text-white-plum/80">
              <FaMapMarkerAlt className="mr-1 text-gold w-3 h-3" />
              {event.location.name}
            </div>
          </div>

          {/* DJs */}
          <div className="flex items-center mb-2 overflow-x-auto scrollbar-hide">
            {event.djs.map((dj) => (
              <div
                key={dj.name}
                className="flex-shrink-0 mr-2 last:mr-0"
              >
                <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gold">
                  <Image
                    src={dj.profile_image}
                    alt={dj.artist_name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <FaUsers className="mr-1 text-gold w-3 h-3" />
                <span className="text-xs text-white-plum/80">{event.capacity}</span>
              </div>
              <div className="flex items-center">
                <IoMdPricetags className="mr-1 text-gold w-3 h-3" />
                <span className="text-xs text-white-plum/80">From ${lowestPrice}</span>
              </div>
            </div>
            <Link
              href={`/events/${event.slug}`}
              className="px-3 py-1 text-xs bg-gold text-black rounded hover:bg-gold/90 transition-colors"
            >
              <FaTicketAlt className="mr-1 inline-block w-3 h-3" />
              Tickets
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <motion.div
      className="event-card-wrapper relative bg-jet-black/30 rounded-xl overflow-hidden hover:bg-jet-black/40 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Featured Badge */}
      {event.is_featured && (
        <div className="absolute top-4 right-4 z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-gold text-dark-gray text-xs font-bold px-3 py-1 rounded-full"
          >
            Featured
          </motion.div>
        </div>
      )}

      {/* Event Image */}
      <div className="relative aspect-[2/1] overflow-hidden">
        <Image
          src={event.featured_image}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
      </div>

      {/* Event Content */}
      <motion.div
        className="p-4 relative"
        initial={false}
        animate={isHovered ? { y: -10 } : { y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Title and Like Button */}
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-semibold text-white line-clamp-1">{event.title}</h3>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsLiked(!isLiked)}
            className="text-2xl"
          >
            <FaHeart className={isLiked ? 'text-red-500' : 'text-white-plum/50'} />
          </motion.button>
        </div>

        {/* Description */}
        <p className="text-sm text-white-plum/80 line-clamp-2 mb-2">{event.description}</p>

        {/* Event Details */}
        <div className="space-y-1 mb-2">
          <div className="flex items-center text-xs text-white-plum/80">
            <FaCalendar className="mr-1 text-gold w-3 h-3" />
            {format(new Date(event.date), 'MMM d, yyyy')}
          </div>
          <div className="flex items-center text-xs text-white-plum/80">
            <FaClock className="mr-1 text-gold w-3 h-3" />
            {event.start_time}
          </div>
          <div className="flex items-center text-xs text-white-plum/80">
            <FaMapMarkerAlt className="mr-1 text-gold w-3 h-3" />
            {event.location.name}
          </div>
        </div>

        {/* DJs */}
        <div className="flex items-center mb-2 overflow-x-auto scrollbar-hide">
          {event.djs.map((dj, index) => (
            <motion.div
              key={dj.name}
              className="flex-shrink-0 mr-2 last:mr-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative w-6 h-6 rounded-full overflow-hidden border border-gold">
                <Image
                  src={dj.profile_image}
                  alt={dj.artist_name}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <FaUsers className="mr-1 text-gold w-3 h-3" />
              <span className="text-xs text-white-plum/80">{event.capacity}</span>
            </div>
            <div className="flex items-center">
              <IoMdPricetags className="mr-1 text-gold w-3 h-3" />
              <span className="text-xs text-white-plum/80">From ${lowestPrice}</span>
            </div>
          </div>
          <Link
            href={`/events/${event.slug}`}
            className="px-3 py-1 text-xs bg-gold text-black rounded hover:bg-gold/90 transition-colors"
          >
            <FaTicketAlt className="mr-1 inline-block w-3 h-3" />
            Tickets
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};
