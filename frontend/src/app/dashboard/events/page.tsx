import EventsCalendar from '@/components/dashboard/events/EventsCalendar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events Calendar | HOY',
  description: 'View and manage your upcoming luxury events',
};

export default function EventsPage() {
  return <EventsCalendar />;
}
