import axios from './api';
import { FEATURED_EVENTS } from '@/data/events';

export interface Event {
  id: string | number;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  video?: string;
  dj?: string;
  tag?: string;
  price?: string;
  featured?: boolean;
  likes?: number;
  comments?: number;
}

export async function getEvent(id: string): Promise<Event | null> {
  try {
    // First check featured events
    const featuredEvent = FEATURED_EVENTS.find(event => event.id.toString() === id);
    if (featuredEvent) {
      return featuredEvent;
    }

    // If not found in featured events, try the API
    const response = await axios.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching event:', error);
    return null;
  }
}

export async function getUpcomingEvents(): Promise<Event[]> {
  try {
    const response = await axios.get('/events/upcoming');
    return response.data || [];
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return [];
  }
}
