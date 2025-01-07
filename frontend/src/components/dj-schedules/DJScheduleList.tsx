import { useDJSchedules } from '@/hooks/useDJSchedules';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Loader2 } from 'lucide-react';

const statusColors = {
  scheduled: 'bg-blue-500',
  performing: 'bg-green-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
};

export function DJScheduleList() {
  const { schedules, isLoading, error } = useDJSchedules();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {schedules.map((schedule) => (
        <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              <span>{schedule.dj_name}</span>
              <Badge className={statusColors[schedule.status]}>
                {schedule.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-medium">{schedule.event_name}</p>
              <div className="text-sm text-gray-500">
                <p>
                  Start: {format(new Date(schedule.start_time), 'PPp')}
                </p>
                <p>
                  End: {format(new Date(schedule.end_time), 'PPp')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
