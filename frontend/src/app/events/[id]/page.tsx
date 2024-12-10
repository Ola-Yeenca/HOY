import { Suspense } from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import eventService from '@/services/eventService';
import { Loader } from '@/components/ui/loader';
import EventClientPage from './client';

// Enable ISR with a 60-second revalidation period
export const revalidate = 60;

export async function generateMetadata(
  { params }: { params: { id: string } },
  _parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await eventService.getEventDetails(params.id);
  
  return {
    title: event ? `${event.title} | HOY` : 'Event | HOY',
    description: event?.description || 'View event details',
  };
}

export async function generateStaticParams() {
  const events = await eventService.getEvents();
  return events.map((event) => ({
    id: event.id.toString(),
  }));
}

export default async function EventPage({
  params,
}: {
  params: { id: string };
}) {
  const event = await eventService.getEventDetails(params.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<Loader />}>
        <EventClientPage eventId={params.id} initialEvent={event} />
      </Suspense>
    </div>
  );
}
