import axios from './api';
import { Event } from '@/types/events';
import { FEATURED_EVENTS } from '@/data/events';

export async function getEvent(id: string): Promise<Event | null> {
  try {
    // First check featured events
    const featuredEvent = FEATURED_EVENTS.find(event => event.id === id);
    if (featuredEvent) {
      return featuredEvent;
    }

    // If not found in featured events, try the API
    const response = await axios.get<Event>(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const response = await axios.get<Event[]>('/events/upcoming');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}
