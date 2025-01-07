import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EventRecommendation, MusicRecommendation } from '@/services/recommendationService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface RecommendationInsightsProps {
  eventRecommendations: EventRecommendation[];
  musicRecommendations: MusicRecommendation[];
  className?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function RecommendationInsights({
  eventRecommendations,
  musicRecommendations,
  className
}: RecommendationInsightsProps) {
  // Prepare data for charts
  const eventScoreData = eventRecommendations.map(rec => ({
    name: `Event ${rec.event_id}`,
    score: rec.score * 100
  }));

  const genreDistributionData = musicRecommendations.map(rec => ({
    name: rec.genre,
    value: rec.score * 100
  }));

  const confidenceDistribution = musicRecommendations.reduce((acc, rec) => {
    acc[rec.confidence] = (acc[rec.confidence] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const confidenceData = Object.entries(confidenceDistribution).map(([confidence, count]) => ({
    name: confidence,
    value: count
  }));

  return (
    <div className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Event Match Scores */}
        <Card>
          <CardHeader>
            <CardTitle>Event Match Scores</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventScoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value: number) => `${value.toFixed(1)}%`}
                  labelStyle={{ color: 'black' }}
                />
                <Bar dataKey="score" fill="#8884d8">
                  {eventScoreData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Genre Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Genre Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={genreDistributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value.toFixed(1)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genreDistributionData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recommendation Confidence */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recommendation Confidence Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8">
                  {confidenceData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
