import SavedEvents from '@/components/dashboard/saved/SavedEvents';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Saved Events | HOY',
  description: 'View and manage your saved luxury events',
};

export default function SavedEventsPage() {
  return <SavedEvents />;
}
