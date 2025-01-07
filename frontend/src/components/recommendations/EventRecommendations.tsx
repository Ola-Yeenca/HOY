import React, { useEffect } from 'react';
import { useRecommendations } from '@/hooks/useRecommendations';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { UserPreferences } from '@/services/recommendationService';

interface EventRecommendationsProps {
  preferences: UserPreferences;
  className?: string;
}

export function EventRecommendations({ preferences, className }: EventRecommendationsProps) {
  const {
    eventRecommendations,
    isLoading,
    error,
    fetchEventRecommendations
  } = useRecommendations();

  useEffect(() => {
    fetchEventRecommendations(preferences);
  }, [fetchEventRecommendations, preferences]);

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
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      <h2 className="text-2xl font-bold mb-4">Recommended Events</h2>
      {eventRecommendations.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">No recommendations available yet.</p>
          </CardContent>
        </Card>
      ) : (
        eventRecommendations.map((recommendation) => (
          <Card key={recommendation.event_id} className="mb-4 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  Event #{recommendation.event_id}
                </CardTitle>
                <Badge variant={recommendation.score > 0.8 ? "default" : "secondary"}>
                  {(recommendation.score * 100).toFixed(0)}% Match
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm text-muted-foreground">
                {recommendation.explanation}
              </CardDescription>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
