'use client';

import { motion } from 'framer-motion';
import { FiMusic, FiCamera, FiCoffee, FiHeart, FiStar, FiGrid } from 'react-icons/fi';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
}

const categories = [
  { id: 'all', label: 'All', icon: FiGrid },
  { id: 'events', label: 'Events', icon: FiMusic },
  { id: 'art', label: 'Art', icon: FiCamera },
  { id: 'food', label: 'Food', icon: FiCoffee },
  { id: 'wellness', label: 'Wellness', icon: FiHeart },
  { id: 'featured', label: 'Featured', icon: FiStar },
];

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => {
        const isSelected = selected === category.id;
        const Icon = category.icon;

        return (
          <motion.button
            key={category.id}
            onClick={() => onChange(category.id)}
            className={`
              flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-medium transition-all
              ${isSelected 
                ? 'bg-gold text-black shadow-lg shadow-gold/20' 
                : 'bg-coffee-bean/30 text-gold hover:bg-gold/20 border border-gold/20'}
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <Icon className={`h-4 w-4 ${isSelected ? 'text-black' : 'text-gold'}`} />
            {category.label}
          </motion.button>
        );
      })}
    </div>
  );
}
