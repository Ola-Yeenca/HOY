'use client';

import { useEffect } from 'react';
import useAuth from '@/hooks/useAuth';
import authService from '@/services/authService';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth } = useAuth();

  useEffect(() => {
    const initAuth = async () => {
      // Check if we have tokens in storage
      const tokens = authService.getTokens();
      if (tokens) {
        try {
          await checkAuth();
        } catch (error) {
          console.error('Failed to restore auth session:', error);
        }
      }
    };

    initAuth();
  }, [checkAuth]);

  return <>{children}</>;
}
