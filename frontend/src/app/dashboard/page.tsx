'use client';

import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import UserDashboard from '@/components/dashboard/UserDashboard';
import EventsCalendar from '@/components/dashboard/events/EventsCalendar';
import { FEATURED_EVENTS } from '@/data/events';
import { parseISO, isAfter, compareAsc } from 'date-fns';

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  const upcomingEvents = useMemo(() => {
    const currentDate = new Date();
    return FEATURED_EVENTS
      .filter(event => isAfter(parseISO(event.date), currentDate))
      .sort((a, b) => compareAsc(parseISO(a.date), parseISO(b.date)));
  }, []);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black">
      <UserDashboard user={user} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Events Calendar */}
        <div className="lg:col-span-2">
          <EventsCalendar />
        </div>
      </div>
    </div>
  );
}
