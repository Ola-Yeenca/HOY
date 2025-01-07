import api from './api';
import { ExploreItem } from '@/hooks/useExplore';

export interface ExploreFilters {
  category?: string;
  startDate?: Date;
  endDate?: Date;
  location?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

class ExploreService {
  async getEvents(filters: ExploreFilters) {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.location) params.append('location', filters.location);
    if (filters.searchQuery) params.append('search', filters.searchQuery);
    if (filters.startDate) params.append('start_date', filters.startDate.toISOString());
    if (filters.endDate) params.append('end_date', filters.endDate.toISOString());
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());

    const response = await api.get<{ items: ExploreItem[]; total: number }>(`/events/?${params}`);
    return response.data;
  }

  async getCategories() {
    const response = await api.get<{ name: string; count: number }[]>('/events/categories/');
    return response.data;
  }

  async getLocations() {
    const response = await api.get<string[]>('/events/locations/');
    return response.data;
  }

  async getEventDetails(eventId: number) {
    const response = await api.get<ExploreItem>(`/events/${eventId}/`);
    return response.data;
  }

  async getRecommendedEvents(userId: number) {
    const response = await api.get<ExploreItem[]>(`/events/recommended/?user_id=${userId}`);
    return response.data;
  }

  async getTrendingEvents() {
    const response = await api.get<ExploreItem[]>('/events/trending/');
    return response.data;
  }

  async getUpcomingEvents() {
    const response = await api.get<ExploreItem[]>('/events/upcoming/');
    return response.data;
  }

  async getNearbyEvents(latitude: number, longitude: number, radius: number = 5) {
    const response = await api.get<ExploreItem[]>(
      `/events/nearby/?lat=${latitude}&lng=${longitude}&radius=${radius}`
    );
    return response.data;
  }
}

export const exploreService = new ExploreService();
export default exploreService;
