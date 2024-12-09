import api from './api';
import { Event } from '@/types/events';
import { mockEvents } from '@/data/mockEvents';

interface FetchEventsParams {
  latitude?: number;
  longitude?: number;
  radius?: number; // in kilometers
  category?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI/180);
}

class EventService {
  async fetchNearbyEvents({
    latitude,
    longitude,
    radius = 10,
    category = 'all',
    searchQuery = '',
    page = 1,
    limit = 20
  }: FetchEventsParams): Promise<{ events: Event[]; total: number }> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Filter events based on search criteria
      let filteredEvents = mockEvents;

      if (latitude && longitude) {
        filteredEvents = filteredEvents.filter(event => {
          const eventCoords = event.location.coordinates;
          if (!eventCoords) return false;
          
          const distance = calculateDistance(
            latitude,
            longitude,
            eventCoords.latitude,
            eventCoords.longitude
          );
          return distance <= radius;
        });
      }

      if (category !== 'all') {
        filteredEvents = filteredEvents.filter(event => 
          event.category.toLowerCase() === category.toLowerCase()
        );
      }

      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredEvents = filteredEvents.filter(event =>
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query) ||
          event.location.toLowerCase().includes(query)
        );
      }

      // Calculate pagination
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

      return {
        events: paginatedEvents,
        total: filteredEvents.length
      };
    } catch (error: any) {
      console.error('Error fetching nearby events:', error.response?.data || error.message);
      throw new Error('Failed to fetch nearby events');
    }
  }

  async getEventDetails(eventId: string): Promise<Event> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const event = mockEvents.find(e => e.id === eventId);
      if (!event) {
        throw new Error('Event not found');
      }

      return event;
    } catch (error: any) {
      console.error('Error fetching event details:', error.response?.data || error.message);
      throw new Error('Failed to fetch event details');
    }
  }

  async getPopularCategories(): Promise<{ name: string; count: number }[]> {
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Get unique categories and their counts from mock data
      const categoryCounts = mockEvents.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
      }));
    } catch (error: any) {
      console.error('Error fetching popular categories:', error.response?.data || error.message);
      throw new Error('Failed to fetch popular categories');
    }
  }
}

export default new EventService();
