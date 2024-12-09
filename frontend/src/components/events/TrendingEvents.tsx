import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaUsers, FaRegHeart, FaHeart } from 'react-icons/fa';
import { useState } from 'react';

export function TrendingEvents() {
  const [liked, setLiked] = useState(false);

  const trendingEvent = {
    id: '1',
    title: 'Summer Night Festival 2024',
    image: '/images/event-1.jpg',
    date: 'June 15, 2024',
    time: '8:00 PM',
    location: 'Beachfront Arena, Miami',
    attendees: 1240,
    description:
      'Experience the ultimate summer night festival featuring world-renowned DJs, spectacular light shows, and unforgettable moments.',
  };

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        <Image
          src={trendingEvent.image}
          alt={trendingEvent.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          width={1200}
          height={800}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jet-black via-jet-black/50 to-transparent" />
      </div>

      <div className="relative h-full flex flex-col justify-end p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl font-bold text-gold mb-2"
            >
              {trendingEvent.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-chalk text-lg mb-4"
            >
              {trendingEvent.description}
            </motion.p>
          </div>
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setLiked(!liked)}
            className="bg-jet-black/50 p-3 rounded-full backdrop-blur-sm hover:bg-jet-black/70 transition-colors"
          >
            {liked ? (
              <FaHeart className="text-gold text-xl" />
            ) : (
              <FaRegHeart className="text-gold text-xl" />
            )}
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-4 mb-6"
        >
          <div className="bg-jet-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <p className="text-chalk">{trendingEvent.date}</p>
          </div>
          <div className="bg-jet-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <p className="text-chalk">{trendingEvent.time}</p>
          </div>
          <div className="bg-jet-black/50 px-4 py-2 rounded-full backdrop-blur-sm">
            <p className="text-chalk">{trendingEvent.location}</p>
          </div>
          <div className="bg-jet-black/50 px-4 py-2 rounded-full backdrop-blur-sm flex items-center gap-2">
            <FaUsers className="text-gold" />
            <p className="text-chalk">{trendingEvent.attendees} attending</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex gap-4"
        >
          <Link
            href={`/events/${trendingEvent.id}`}
            className="bg-gold hover:bg-gold/80 text-jet-black px-6 py-3 rounded-full font-semibold transition-colors"
          >
            View Details
          </Link>
          <button className="bg-jet-black/50 hover:bg-jet-black/70 text-gold px-6 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors">
            RSVP Now
          </button>
        </motion.div>
      </div>
    </div>
  );
}
