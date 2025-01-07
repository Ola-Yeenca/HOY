import api from './api';
import { toast } from 'react-hot-toast';

export interface EventRecommendation {
  event_id: string;
  score: number;
  explanation: string;
}

export interface MusicRecommendation {
  genre: string;
  score: number;
  confidence: string;
}

export interface UserPreferences {
  genres?: string[];
  location?: string;
  favorite_artists?: string[];
  activity_score?: number;
  diversity_score?: number;
}

class RecommendationService {
  private handleError(error: any): never {
    const message = error.response?.data?.detail || 
                   error.response?.data?.message ||
                   error.message || 
                   'Failed to get recommendations';
    toast.error(message);
    throw new Error(message);
  }

  async getEventRecommendations(
    preferences: UserPreferences,
    limit: number = 5
  ): Promise<EventRecommendation[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        ...(preferences.location && { location: preferences.location }),
        ...(preferences.genres && { genres: preferences.genres.join(',') })
      });

      const response = await api.get<EventRecommendation[]>(
        `/api/recommendations/events/?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getMusicRecommendations(
    preferences: UserPreferences,
    limit: number = 5
  ): Promise<MusicRecommendation[]> {
    try {
      const params = new URLSearchParams({
        limit: limit.toString()
      });

      const response = await api.get<MusicRecommendation[]>(
        `/api/recommendations/music/?${params.toString()}`
      );

      return response.data;
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updateUserPreferences(preferences: UserPreferences): Promise<void> {
    try {
      await api.post('/api/user/preferences/', preferences);
      toast.success('Preferences updated successfully');
    } catch (error) {
      this.handleError(error);
    }
  }
}

export default new RecommendationService();
