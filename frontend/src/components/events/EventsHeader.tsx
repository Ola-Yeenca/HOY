'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

type EventFilter = 'all' | 'upcoming' | 'past';

export function EventsHeader() {
  const [activeFilter, setActiveFilter] = useState<EventFilter>('upcoming');

  const filters: { label: string; value: EventFilter }[] = [
    { label: 'All Events', value: 'all' },
    { label: 'Upcoming', value: 'upcoming' },
    { label: 'Past', value: 'past' },
  ];

  return (
    <div className="mb-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-gold mb-6"
      >
        House Of Young Events
      </motion.h1>
      
      <div className="flex space-x-4">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActiveFilter(filter.value)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${
              activeFilter === filter.value
                ? 'bg-gold text-jet-black'
                : 'bg-transparent text-gold border border-gold hover:bg-gold/10'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
