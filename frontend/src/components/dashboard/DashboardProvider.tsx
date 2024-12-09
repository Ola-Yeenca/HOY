'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';
import { Loader } from '../ui/loader';

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, checkAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated && !isLoading) {
        try {
          const isAuthed = await checkAuth();
          if (!isAuthed) {
            router.replace('/login');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          router.replace('/login');
        }
      }
    };

    init();
  }, [isAuthenticated, isLoading, checkAuth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-bean to-jet-black">
        <Loader className="w-12 h-12 text-gold" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
