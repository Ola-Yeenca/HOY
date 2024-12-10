'use client';

import { motion } from 'framer-motion';
import { FiMusic, FiCamera, FiCoffee, FiHeart, FiStar, FiGrid } from 'react-icons/fi';

interface CategoryFilterProps {
  selected: string;
  onChange: (category: string) => void;
  categories: { name: string; count: number }[];
}

const defaultCategories = [
  { id: 'all', label: 'All', icon: FiGrid },
  { id: 'events', label: 'Events', icon: FiMusic },
  { id: 'art', label: 'Art', icon: FiCamera },
  { id: 'food', label: 'Food', icon: FiCoffee },
  { id: 'wellness', label: 'Wellness', icon: FiHeart },
  { id: 'featured', label: 'Featured', icon: FiStar },
];

export function CategoryFilter({ selected, onChange, categories }: CategoryFilterProps) {
  const mappedCategories = categories.map(cat => ({
    id: cat.name.toLowerCase(),
    label: cat.name,
    icon: defaultCategories.find(dc => dc.id === cat.name.toLowerCase())?.icon || FiGrid,
    count: cat.count
  }));

  return (
    <div className="flex flex-wrap gap-4">
      {mappedCategories.map(({ id, label, icon: Icon, count }) => {
        const isSelected = selected === id;
        return (
          <motion.button
            key={id}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border ${
              isSelected
                ? 'bg-gold/20 border-gold text-gold'
                : 'bg-coffee-bean/30 border-gold/20 text-white/70 hover:bg-gold/10 hover:border-gold/50'
            } transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {count > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-gold/10 rounded-full text-sm">
                {count}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
