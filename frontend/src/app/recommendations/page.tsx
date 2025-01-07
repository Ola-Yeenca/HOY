import { Suspense } from 'react';
import { EventRecommendations } from '@/components/recommendations/EventRecommendations';
import { MusicRecommendations } from '@/components/recommendations/MusicRecommendations';
import { RecommendationInsights } from '@/components/recommendations/RecommendationInsights';
import { UserPreferencesForm } from '@/components/recommendations/UserPreferencesForm';
import { useRecommendations } from '@/hooks/useRecommendations';
import { UserPreferences } from '@/services/recommendationService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

export default function RecommendationsPage() {
  const {
    eventRecommendations,
    musicRecommendations,
    isLoading,
    error,
    updatePreferences,
    clearCache,
    fetchEventRecommendations,
    fetchMusicRecommendations
  } = useRecommendations();
  
  const handlePreferencesSubmit = async (preferences: UserPreferences) => {
    await updatePreferences(preferences);
  };

  const handleRefresh = async () => {
    clearCache();
    const preferences = {
      genres: [],
      location: '',
      activity_score: 0.5,
      diversity_score: 0.5
    };
    await Promise.all([
      fetchEventRecommendations(preferences),
      fetchMusicRecommendations(preferences)
    ]);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Your Recommendations</h1>
        <Button
          onClick={handleRefresh}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isLoading}
        >
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Preferences Form */}
        <div className="md:col-span-1">
          <Suspense fallback={<Skeleton className="h-[600px]" />}>
            <UserPreferencesForm
              onSubmit={handlePreferencesSubmit}
              className="sticky top-8"
            />
          </Suspense>
        </div>

        {/* Recommendations */}
        <div className="md:col-span-2">
          <Tabs defaultValue="events" className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="events" className="flex-1">Events</TabsTrigger>
              <TabsTrigger value="music" className="flex-1">Music</TabsTrigger>
              <TabsTrigger value="insights" className="flex-1">Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="events">
              <Suspense fallback={<Skeleton className="h-[400px]" />}>
                <EventRecommendations
                  preferences={{
                    genres: [],
                    location: '',
                    activity_score: 0.5
                  }}
                />
              </Suspense>
            </TabsContent>
            
            <TabsContent value="music">
              <Suspense fallback={<Skeleton className="h-[400px]" />}>
                <MusicRecommendations
                  preferences={{
                    genres: [],
                    diversity_score: 0.5
                  }}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="insights">
              <Suspense fallback={<Skeleton className="h-[600px]" />}>
                <RecommendationInsights
                  eventRecommendations={eventRecommendations}
                  musicRecommendations={musicRecommendations}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
