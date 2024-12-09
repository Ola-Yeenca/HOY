'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMap, FiGrid, FiMapPin } from 'react-icons/fi';
import { SearchBar } from '@/components/explore/SearchBar';
import { CategoryFilter } from '@/components/explore/CategoryFilter';
import { ExploreGrid } from '@/components/explore/ExploreGrid';
import { MapView } from '@/components/explore/MapView';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import useGeolocation from '@/hooks/useGeolocation';
import eventService from '@/services/eventService';
import { Event } from '@/types/events';
import { toast } from 'react-hot-toast';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([]);
  const { location, error: locationError } = useGeolocation();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchEvents = async (newSearch = false) => {
    if (!location) return;
    
    try {
      setIsLoading(true);
      const currentPage = newSearch ? 1 : page;
      const { events: newEvents, total } = await eventService.fetchNearbyEvents({
        latitude: location.latitude,
        longitude: location.longitude,
        category: selectedCategory,
        searchQuery,
        page: currentPage,
        limit: 20
      });

      if (newSearch) {
        setEvents(newEvents);
        setPage(1);
      } else {
        setEvents(prev => [...prev, ...newEvents]);
      }
      
      setHasMore(events.length < total);
    } catch (error) {
      toast.error('Failed to fetch events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const popularCategories = await eventService.getPopularCategories();
      setCategories(popularCategories);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  useEffect(() => {
    if (location) {
      fetchEvents(true);
      fetchCategories();
    }
  }, [location, selectedCategory, searchQuery]);

  const handleLoadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
      fetchEvents();
    }
  };

  if (!location && !locationError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (locationError) {
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4 p-4 text-center">
        <FiMapPin className="w-12 h-12 text-gold" />
        <h2 className="text-2xl font-bold text-white">Location Access Required</h2>
        <p className="text-gray-300 max-w-md">
          Please enable location services to discover events near you. 
          This helps us show you the most relevant events in your area.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black">
      {/* Hero Section with Parallax */}
      <div className="relative h-[50vh] overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10" />
        <div 
          className="absolute inset-0 bg-[url('/images/explore-hero.jpg')] bg-cover bg-center"
          style={{
            transform: 'scale(1.1)',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Discover Your <span className="text-gold">Next Adventure</span>
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-300 mb-8"
          >
            Find amazing events happening near you
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-2xl"
          >
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for events..."
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <CategoryFilter 
            categories={[{ name: 'all', count: 0 }, ...categories]}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
          
          <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-gold text-black' : 'text-white'}`}
            >
              <FiGrid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`p-2 rounded ${viewMode === 'map' ? 'bg-gold text-black' : 'text-white'}`}
            >
              <FiMap className="w-5 h-5" />
            </button>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <ExploreGrid 
            events={events}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
          />
        ) : (
          <MapView 
            searchQuery={searchQuery}
            category={selectedCategory}
            userLocation={location}
            events={events}
          />
        )}
      </div>
    </div>
  );
}
