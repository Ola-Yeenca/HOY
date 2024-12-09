'use client';

import { motion } from 'framer-motion';
import { EventCard } from '@/components/events/EventCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { useInView } from 'react-intersection-observer';
import { useEffect } from 'react';

interface Event {
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
}

interface ExploreGridProps {
  events: Event[];
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

export function ExploreGrid({ events, isLoading, hasMore, onLoadMore }: ExploreGridProps) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      onLoadMore();
    }
  }, [inView, isLoading, hasMore, onLoadMore]);

  if (!events.length && !isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <h3 className="text-2xl font-semibold text-white mb-2">No Events Found</h3>
        <p className="text-gray-400">Try adjusting your search criteria or exploring a different area.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>

      {/* Loading indicator and infinite scroll trigger */}
      <div
        ref={ref}
        className="flex justify-center py-8"
      >
        {isLoading && (
          <LoadingSpinner size="medium" />
        )}
      </div>
    </div>
  );
}
