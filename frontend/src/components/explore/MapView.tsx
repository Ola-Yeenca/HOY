'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMapPin, FiStar, FiX, FiCalendar, FiUsers } from 'react-icons/fi';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Event } from '@/types/events';

interface Location {
  latitude: number;
  longitude: number;
}

interface MapViewProps {
  searchQuery: string;
  category: string;
  userLocation: Location | null;
  events: Event[];
}

export function MapView({ searchQuery, category, userLocation, events }: MapViewProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewport, setViewport] = useState({
    latitude: userLocation?.latitude || 0,
    longitude: userLocation?.longitude || 0,
    zoom: 12
  });

  useEffect(() => {
    if (userLocation) {
      setViewport(prev => ({
        ...prev,
        latitude: userLocation.latitude,
        longitude: userLocation.longitude
      }));
    }
  }, [userLocation]);

  return (
    <div className="relative h-[70vh] rounded-xl overflow-hidden">
      <Map
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/dark-v10"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        {/* User Location Marker */}
        {userLocation && (
          <Marker
            latitude={userLocation.latitude}
            longitude={userLocation.longitude}
          >
            <div className="relative">
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
              <div className="relative w-4 h-4 bg-blue-500 rounded-full border-2 border-white" />
            </div>
          </Marker>
        )}

        {/* Event Markers */}
        {events.map(event => {
          const { latitude, longitude } = event.location;
          if (!latitude || !longitude) return null;
          
          return (
            <Marker
              key={event.id}
              latitude={latitude}
              longitude={longitude}
            >
              <button
                onClick={e => {
                  e.preventDefault();
                  setSelectedEvent(event);
                }}
                className="relative group"
              >
                <div className="absolute -top-2 -left-2 w-4 h-4 bg-gold rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-200" />
                <div className="w-4 h-4 bg-gold rounded-full border-2 border-white transform transition-transform duration-200 group-hover:scale-125" />
              </button>
            </Marker>
          );
        })}

        {/* Event Popup */}
        <AnimatePresence>
          {selectedEvent && selectedEvent.location && (
            <Popup
              latitude={selectedEvent.location.latitude}
              longitude={selectedEvent.location.longitude}
              onClose={() => setSelectedEvent(null)}
              closeOnClick={false}
              anchor="bottom"
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-black/90 backdrop-blur-lg p-4 rounded-lg border border-gold/20 shadow-xl min-w-[300px]"
              >
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <FiX />
                </button>

                <h3 className="text-lg font-semibold text-white mb-2">
                  {selectedEvent.title}
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  {selectedEvent.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiMapPin className="text-gold" />
                    {selectedEvent.location.name}, {selectedEvent.location.address}
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiCalendar className="text-gold" />
                    {new Date(selectedEvent.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1 text-gray-300">
                    <FiUsers className="text-gold" />
                    {selectedEvent.capacity} capacity
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 w-full rounded-lg bg-gold py-2 text-center text-sm font-medium text-black transition-colors hover:bg-gold/90"
                >
                  View Details
                </motion.button>
              </motion.div>
            </Popup>
          )}
        </AnimatePresence>
      </Map>
    </div>
  );
}
