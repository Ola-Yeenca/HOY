import { useState, useCallback, useEffect } from 'react';
import recommendationService, {
  EventRecommendation,
  MusicRecommendation,
  UserPreferences
} from '@/services/recommendationService';
import { useAuth } from '@/hooks/useAuth';

interface CachedRecommendations {
  data: EventRecommendation[] | MusicRecommendation[];
  timestamp: number;
  preferences: UserPreferences;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

interface UseRecommendationsReturn {
  eventRecommendations: EventRecommendation[];
  musicRecommendations: MusicRecommendation[];
  isLoading: boolean;
  error: string | null;
  fetchEventRecommendations: (preferences: UserPreferences) => Promise<void>;
  fetchMusicRecommendations: (preferences: UserPreferences) => Promise<void>;
  updatePreferences: (preferences: UserPreferences) => Promise<void>;
  clearCache: () => void;
}

// Cache storage
const recommendationCache = {
  events: new Map<string, CachedRecommendations>(),
  music: new Map<string, CachedRecommendations>()
};

// Create a cache key from preferences
const createCacheKey = (preferences: UserPreferences): string => {
  return JSON.stringify(preferences);
};

// Check if cache is valid
const isCacheValid = (cache: CachedRecommendations): boolean => {
  return Date.now() - cache.timestamp < CACHE_DURATION;
};

export function useRecommendations(): UseRecommendationsReturn {
  const [eventRecommendations, setEventRecommendations] = useState<EventRecommendation[]>([]);
  const [musicRecommendations, setMusicRecommendations] = useState<MusicRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  // Clear expired cache entries
  useEffect(() => {
    const clearExpiredCache = () => {
      for (const [key, value] of recommendationCache.events.entries()) {
        if (!isCacheValid(value)) {
          recommendationCache.events.delete(key);
        }
      }
      for (const [key, value] of recommendationCache.music.entries()) {
        if (!isCacheValid(value)) {
          recommendationCache.music.delete(key);
        }
      }
    };

    const interval = setInterval(clearExpiredCache, CACHE_DURATION);
    return () => clearInterval(interval);
  }, []);

  const fetchEventRecommendations = useCallback(async (preferences: UserPreferences) => {
    if (!isAuthenticated) {
      setError('Please log in to get personalized recommendations');
      return;
    }

    const cacheKey = createCacheKey(preferences);
    const cachedData = recommendationCache.events.get(cacheKey);

    if (cachedData && isCacheValid(cachedData)) {
      setEventRecommendations(cachedData.data as EventRecommendation[]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const recommendations = await recommendationService.getEventRecommendations(preferences);
      
      // Cache the results
      recommendationCache.events.set(cacheKey, {
        data: recommendations,
        timestamp: Date.now(),
        preferences
      });
      
      setEventRecommendations(recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchMusicRecommendations = useCallback(async (preferences: UserPreferences) => {
    if (!isAuthenticated) {
      setError('Please log in to get personalized recommendations');
      return;
    }

    const cacheKey = createCacheKey(preferences);
    const cachedData = recommendationCache.music.get(cacheKey);

    if (cachedData && isCacheValid(cachedData)) {
      setMusicRecommendations(cachedData.data as MusicRecommendation[]);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const recommendations = await recommendationService.getMusicRecommendations(preferences);
      
      // Cache the results
      recommendationCache.music.set(cacheKey, {
        data: recommendations,
        timestamp: Date.now(),
        preferences
      });
      
      setMusicRecommendations(recommendations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch music recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const updatePreferences = useCallback(async (preferences: UserPreferences) => {
    if (!isAuthenticated) {
      setError('Please log in to update preferences');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await recommendationService.updateUserPreferences(preferences);
      
      // Clear cache when preferences are updated
      recommendationCache.events.clear();
      recommendationCache.music.clear();
      
      // Refresh recommendations
      await Promise.all([
        fetchEventRecommendations(preferences),
        fetchMusicRecommendations(preferences)
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, fetchEventRecommendations, fetchMusicRecommendations]);

  const clearCache = useCallback(() => {
    recommendationCache.events.clear();
    recommendationCache.music.clear();
  }, []);

  return {
    eventRecommendations,
    musicRecommendations,
    isLoading,
    error,
    fetchEventRecommendations,
    fetchMusicRecommendations,
    updatePreferences,
    clearCache
  };
}
