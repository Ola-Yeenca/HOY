'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiClock } from 'react-icons/fi';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export function SearchBar({ value, onChange, className = '', placeholder = 'Search...' }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const addToRecent = (search: string) => {
    if (!search.trim()) return;
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addToRecent(value);
  };

  const handleRecentClick = (search: string) => {
    onChange(search);
    addToRecent(search);
    setIsFocused(false);
  };

  return (
    <div className={`relative ${className}`}>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <motion.div
            animate={isFocused ? { scale: 1.02 } : { scale: 1 }}
            className="relative"
          >
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold text-xl" />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
              placeholder={placeholder}
              className="w-full bg-coffee-bean/30 border border-gold/20 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold/50 transition-all"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <FiX />
              </button>
            )}
          </motion.div>
        </div>
      </form>

      {/* Recent Searches Dropdown */}
      <AnimatePresence>
        {isFocused && recentSearches.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-lg border border-gold/20 rounded-xl overflow-hidden shadow-xl z-50"
          >
            <div className="p-2">
              <div className="text-sm text-gray-400 px-3 py-2 flex items-center gap-2">
                <FiClock />
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <motion.button
                  key={search}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleRecentClick(search)}
                  className="w-full text-left px-3 py-2 text-white hover:bg-gold/20 rounded-lg transition-colors"
                >
                  {search}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
