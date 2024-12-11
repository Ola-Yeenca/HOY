import api from './api';
import { Event } from '@/types/events';
import { FEATURED_EVENTS } from '@/data/events';

class EventService {
  async getEventDetails(id: string): Promise<Event | null> {
    try {
      // First check featured events
      const featuredEvent = FEATURED_EVENTS.find(event => event.id.toString() === id);
      if (featuredEvent) {
        return featuredEvent;
      }

      // If not found in featured events, try the API
      const response = await api.get(`/events/${id}`);
      const apiEvent = response.data;

      // Transform API response to match Event type
      return {
        id: apiEvent.id.toString(),
        title: apiEvent.title,
        slug: apiEvent.slug,
        description: apiEvent.description,
        date: apiEvent.date,
        start_time: apiEvent.start_time,
        location: apiEvent.location,
        featured_image: apiEvent.featured_image,
        image: apiEvent.image || apiEvent.featured_image, // Use featured_image as fallback
        djs: apiEvent.djs || [],
        capacity: apiEvent.capacity,
        ticket_types: apiEvent.ticket_types || [],
        status: apiEvent.status || 'draft',
        is_featured: apiEvent.is_featured || false,
        category: apiEvent.category
      };
    } catch (error) {
      console.error('Error fetching event:', error);
      return null;
    }
  }

  async getEvents(): Promise<Event[]> {
    try {
      const response = await api.get('/events');
      const apiEvents = response.data.events || [];

      // Transform API events to match Event type
      const transformedEvents = apiEvents.map((apiEvent: any) => ({
        id: apiEvent.id.toString(),
        title: apiEvent.title,
        slug: apiEvent.slug,
        description: apiEvent.description,
        date: apiEvent.date,
        start_time: apiEvent.start_time,
        location: apiEvent.location,
        featured_image: apiEvent.featured_image,
        image: apiEvent.image || apiEvent.featured_image, // Use featured_image as fallback
        djs: apiEvent.djs || [],
        capacity: apiEvent.capacity,
        ticket_types: apiEvent.ticket_types || [],
        status: apiEvent.status || 'draft',
        is_featured: apiEvent.is_featured || false,
        category: apiEvent.category
      }));

      // Combine with featured events
      return [
        ...FEATURED_EVENTS,
        ...transformedEvents.filter(apiEvent => 
          !FEATURED_EVENTS.some(fe => fe.id.toString() === apiEvent.id.toString())
        )
      ];
    } catch (error) {
      console.error('Error fetching events:', error);
      return FEATURED_EVENTS;
    }
  }

  async fetchNearbyEvents({ 
    latitude, 
    longitude, 
    category,
    searchQuery,
    page = 1,
    limit = 10
  }: { 
    latitude: number;
    longitude: number;
    category?: string;
    searchQuery?: string;
    page?: number;
    limit?: number;
  }): Promise<{ events: Event[]; total: number }> {
    try {
      const response = await api.get('/events/nearby', {
        params: {
          latitude,
          longitude,
          category,
          q: searchQuery,
          page,
          limit
        }
      });

      const apiEvents = response.data.events || [];
      const total = response.data.total || 0;

      // Transform API events to match Event type
      const transformedEvents = apiEvents.map((apiEvent: any) => ({
        id: apiEvent.id.toString(),
        title: apiEvent.title,
        slug: apiEvent.slug,
        description: apiEvent.description,
        date: apiEvent.date,
        start_time: apiEvent.start_time,
        location: apiEvent.location,
        featured_image: apiEvent.featured_image,
        image: apiEvent.image || apiEvent.featured_image, // Use featured_image as fallback
        djs: apiEvent.djs || [],
        capacity: apiEvent.capacity,
        ticket_types: apiEvent.ticket_types || [],
        status: apiEvent.status || 'draft',
        is_featured: apiEvent.is_featured || false,
        category: apiEvent.category
      }));

      return {
        events: transformedEvents,
        total
      };
    } catch (error) {
      console.error('Error fetching nearby events:', error);
      return {
        events: [],
        total: 0
      };
    }
  }

  async getPopularCategories(): Promise<{ name: string; count: number }[]> {
    try {
      const response = await api.get('/events/categories');
      const categories = response.data.categories || [];
      return categories.map((category: string) => ({
        name: category,
        count: 0 // We'll update this when we have the actual count from the API
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [
        { name: 'Music', count: 0 },
        { name: 'Art', count: 0 },
        { name: 'Food', count: 0 },
        { name: 'Sports', count: 0 },
        { name: 'Technology', count: 0 },
        { name: 'Business', count: 0 },
        { name: 'Health', count: 0 },
        { name: 'Education', count: 0 }
      ];
    }
  }
}

export default new EventService();
