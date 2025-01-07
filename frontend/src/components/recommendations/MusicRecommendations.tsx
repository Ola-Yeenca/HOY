import React, { useEffect } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserPreferences } from '@/services/recommendationService';

interface MusicRecommendationsProps {
  preferences: UserPreferences;
  className?: string;
}

export function MusicRecommendations({ preferences, className }: MusicRecommendationsProps) {
  const {
    musicRecommendations,
    isLoading,
    error,
    fetchMusicRecommendations
  } = useRecommendations();

  useEffect(() => {
    fetchMusicRecommendations(preferences);
  }, [fetchMusicRecommendations, preferences]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence.toLowerCase()) {
      case 'very high':
        return 'bg-green-500';
      case 'high':
        return 'bg-emerald-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className={className}>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className={className}>
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="mb-4">
            <CardHeader>
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-2 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Music Recommendations</h2>
      {musicRecommendations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No recommendations available yet.</p>
          </CardContent>
        </Card>
      ) : (
        musicRecommendations.map((recommendation) => (
          <Card key={recommendation.genre} className="mb-4 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  {recommendation.genre}
                </CardTitle>
                <Badge
                  variant="outline"
                  className={`${getConfidenceColor(recommendation.confidence)} text-white`}
                >
                  {recommendation.confidence}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Match Score</span>
                  <span>{(recommendation.score * 100).toFixed(0)}%</span>
                </div>
                <Progress
                  value={recommendation.score * 100}
                  className="h-2"
                  indicatorClassName={getConfidenceColor(recommendation.confidence)}
                />
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
