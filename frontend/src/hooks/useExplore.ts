import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { exploreService, ExploreFilters } from '@/services/exploreService';
import { useCategories, useLocations } from '@/contexts/AppContext';

export interface ExploreItem {
  id: number;
  type: 'event' | 'restaurant' | 'activity';
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  category: string;
  rating?: number;
  price?: string;
  startDate?: string;
  endDate?: string;
}

export const useExplore = (initialFilters: ExploreFilters = {}) => {
  const [items, setItems] = useState<ExploreItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ExploreFilters>(initialFilters);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { toast } = useToast();
  const { categories, setCategories } = useCategories();
  const { locations, setLocations } = useLocations();

  const fetchCategories = useCallback(async () => {
    try {
      const data = await exploreService.getCategories();
      setCategories(data.map(cat => cat.name));
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  }, [setCategories]);

  const fetchLocations = useCallback(async () => {
    try {
      const data = await exploreService.getLocations();
      setLocations(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    }
  }, [setLocations]);

  const fetchData = useCallback(async (newSearch = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const currentPage = newSearch ? 1 : page;
      const { items: newItems, total } = await exploreService.getEvents({
        ...filters,
        page: currentPage,
        limit: 20
      });

      if (newSearch) {
        setItems(newItems);
        setPage(1);
      } else {
        setItems(prev => [...prev, ...newItems]);
      }
      
      setHasMore(items.length < total);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch explore data');
      toast({
        title: 'Error',
        description: 'Failed to load explore data. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [filters, page, toast]);

  useEffect(() => {
    if (categories.length === 0) {
      fetchCategories();
    }
    if (locations.length === 0) {
      fetchLocations();
    }
  }, [categories.length, locations.length, fetchCategories, fetchLocations]);

  useEffect(() => {
    fetchData(true);
  }, [fetchData]);

  const updateFilters = useCallback((newFilters: Partial<ExploreFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  return {
    items,
    isLoading,
    error,
    filters,
    hasMore,
    categories,
    locations,
    updateFilters,
    loadMore,
    refreshData: () => fetchData(true)
  };
};
