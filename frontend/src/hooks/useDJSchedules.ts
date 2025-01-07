import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface DJSchedule {
  id: number;
  dj: number;
  dj_name: string;
  event: number;
  event_name: string;
  start_time: string;
  end_time: string;
  status: 'scheduled' | 'performing' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export const useDJSchedules = () => {
  const [schedules, setSchedules] = useState<DJSchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  // Fetch initial schedules
  const fetchSchedules = useCallback(async () => {
    try {
      const response = await fetch('/api/dj-schedules/schedules/');
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      setSchedules(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch schedules');
      toast({
        title: 'Error',
        description: 'Failed to fetch DJ schedules',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  // Connect to WebSocket
  const connectWebSocket = useCallback(() => {
    const ws = new WebSocket('ws://localhost:8000/ws/dj-schedules/');

    ws.onopen = () => {
      console.log('WebSocket connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'schedule_update') {
        const updatedSchedule = data.schedule;
        
        if (updatedSchedule.deleted) {
          setSchedules(prev => prev.filter(schedule => schedule.id !== updatedSchedule.id));
          toast({
            title: 'Schedule Deleted',
            description: 'A DJ schedule has been removed',
          });
        } else {
          setSchedules(prev => {
            const index = prev.findIndex(schedule => schedule.id === updatedSchedule.id);
            if (index === -1) {
              toast({
                title: 'New Schedule',
                description: `New schedule added for ${updatedSchedule.dj_name}`,
              });
              return [...prev, updatedSchedule];
            } else {
              toast({
                title: 'Schedule Updated',
                description: `Schedule updated for ${updatedSchedule.dj_name}`,
              });
              const newSchedules = [...prev];
              newSchedules[index] = updatedSchedule;
              return newSchedules;
            }
          });
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after 5 seconds
      setTimeout(connectWebSocket, 5000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: 'Connection Error',
        description: 'Failed to connect to real-time updates',
        variant: 'destructive',
      });
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [toast]);

  useEffect(() => {
    fetchSchedules();
    const cleanup = connectWebSocket();

    return () => {
      cleanup();
      if (socket) {
        socket.close();
      }
    };
  }, [fetchSchedules, connectWebSocket, socket]);

  return {
    schedules,
    isLoading,
    error,
  };
};
