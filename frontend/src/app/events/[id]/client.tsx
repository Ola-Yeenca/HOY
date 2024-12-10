'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/loader';
import EventDetail from '@/components/events/EventDetail';
import { Event } from '@/types/events';

interface Props {
  eventId: string;
  initialEvent: Event | null;
}

export default function EventClientPage({ eventId, initialEvent }: Props) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated && !isLoading) {
      router.replace('/login?from=' + window.location.pathname);
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loader while checking auth
  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader className="w-12 h-12 text-gold" />
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  if (!eventId || !initialEvent) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-xl text-white-plum">Event not found</div>
      </div>
    );
  }

  return <EventDetail id={eventId} initialEvent={initialEvent} />;
}
