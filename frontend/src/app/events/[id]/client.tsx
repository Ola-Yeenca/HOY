'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/loader';
import EventDetail from '@/components/events/EventDetail';
import { Event } from '@/types/events';

interface Props {
  eventId: string;
  initialEvent: Event;
}

export default function EventClientPage({ eventId, initialEvent }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace('/login?from=' + window.location.pathname);
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-12 h-12 text-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <EventDetail id={eventId} initialEvent={initialEvent} />;
}
