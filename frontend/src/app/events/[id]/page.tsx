'use server';

import { Suspense } from 'react';
import { getEvent } from '@/services/events';
import { Loader } from '@/components/ui/loader';
import EventClientPage from './client';
import { Metadata } from 'next';

type Props = {
  params: {
    id: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
}

export const metadata: Metadata = {
  title: 'Event Details | HOY',
  description: 'View details about this event',
};

export async function generateStaticParams() {
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
  ];
}

export default async function EventPage({ params, searchParams }: Props) {
  const eventId = params?.id;
  const event = eventId ? await getEvent(eventId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
      <Suspense fallback={<Loader className="w-12 h-12 text-gold" />}>
        <EventClientPage eventId={eventId} initialEvent={event} />
      </Suspense>
    </div>
  );
}
