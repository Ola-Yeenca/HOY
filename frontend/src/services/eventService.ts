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
        description: apiEvent.description,
        date: apiEvent.date,
        location: apiEvent.location,
        featured_image: apiEvent.featured_image || apiEvent.image,
        image: apiEvent.image || apiEvent.featured_image,
        capacity: apiEvent.capacity,
        age_restriction: apiEvent.age_restriction,
        ticket_types: apiEvent.ticket_types || [],
        djs: apiEvent.djs || [],
        is_featured: apiEvent.is_featured || false,
        price: apiEvent.price || "€0",
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
        description: apiEvent.description,
        date: apiEvent.date,
        location: apiEvent.location,
        featured_image: apiEvent.featured_image || apiEvent.image,
        image: apiEvent.image || apiEvent.featured_image,
        capacity: apiEvent.capacity,
        age_restriction: apiEvent.age_restriction,
        ticket_types: apiEvent.ticket_types || [],
        djs: apiEvent.djs || [],
        is_featured: apiEvent.is_featured || false,
        price: apiEvent.price || "€0",
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
}

export default new EventService();
