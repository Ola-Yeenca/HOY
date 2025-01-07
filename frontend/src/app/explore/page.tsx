'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMap, FiGrid, FiMapPin } from 'react-icons/fi';
import { SearchBar } from '@/components/explore/SearchBar';
import { CategoryFilter } from '@/components/explore/CategoryFilter';
import { ExploreGrid } from '@/components/explore/ExploreGrid';
import { MapView } from '@/components/explore/MapView';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ExploreFiltersComponent } from '@/components/explore/ExploreFilters';
import useGeolocation from '@/hooks/useGeolocation';
import { useExplore } from '@/hooks/useExplore';
import { useCategories } from '@/contexts/AppContext';

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const { location, error: locationError } = useGeolocation();
  const { categories } = useCategories();
  
  const { 
    items, 
    isLoading, 
    error, 
    filters, 
    hasMore,
    updateFilters,
    loadMore 
  } = useExplore({
    category: selectedCategory !== 'all' ? selectedCategory : undefined,
    location: location ? `${location.latitude},${location.longitude}` : undefined,
    searchQuery
  });

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
              onChange={(value) => {
                setSearchQuery(value);
                updateFilters({ searchQuery: value });
              }}
              placeholder="Search for events..."
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <CategoryFilter 
            categories={[
              { name: 'all', count: items.length },
              ...categories.map(cat => ({
                name: cat,
                count: items.filter(item => item.category === cat).length
              }))
            ]}
            selected={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              updateFilters({ 
                category: category !== 'all' ? category : undefined 
              });
            }}
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

        <ExploreFiltersComponent
          filters={filters}
          onFilterChange={updateFilters}
        />

        {viewMode === 'grid' ? (
          <div className="grid gap-6 mt-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading && items.length === 0 ? (
              <div className="col-span-full flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="large" />
              </div>
            ) : error ? (
              <div className="col-span-full flex items-center justify-center min-h-[400px] text-red-500">
                {error}
              </div>
            ) : items.length === 0 ? (
              <div className="col-span-full flex items-center justify-center min-h-[400px] text-gray-300">
                No items found matching your criteria
              </div>
            ) : (
              <>
                {items.map((item) => (
                  <motion.div
                    key={`${item.type}-${item.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ExploreGrid events={[item]} />
                  </motion.div>
                ))}
                {isLoading && (
                  <div className="col-span-full flex items-center justify-center py-8">
                    <LoadingSpinner size="medium" />
                  </div>
                )}
                {hasMore && !isLoading && (
                  <button
                    onClick={loadMore}
                    className="col-span-full mx-auto mt-8 px-6 py-2 bg-gold text-black rounded-lg hover:bg-gold/90 transition-colors"
                  >
                    Load More
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <MapView 
            searchQuery={searchQuery}
            category={selectedCategory}
            userLocation={location}
            events={items}
          />
        )}
      </div>
    </div>
  );
}
