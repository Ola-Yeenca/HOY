'use client';

import { useEffect, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import authService from '@/services/authService';
import { usePathname } from 'next/navigation';
import { Loader } from '@/components/ui/loader';

const publicRoutes = ['/', '/login', '/register'];
const protectedRoutes = ['/admin', '/events', '/dashboard', '/gallery', '/profile', '/feedback'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { checkAuth, isAuthenticated } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();

  // Function to handle navigation
  const handleNavigation = () => {
    console.log('Handling navigation:', { pathname, isAuthenticated });
    
    const isLoginPage = pathname === '/login';
    const isPublicRoute = publicRoutes.includes(pathname);
    const isProtectedRoute = protectedRoutes.some(route => 
      pathname === route || pathname.startsWith(`${route}/`)
    );

    if (isAuthenticated) {
      console.log('User is authenticated');
      if (isLoginPage) {
        console.log('Redirecting to dashboard from login page');
        window.location.replace('/dashboard');
      }
    } else {
      console.log('User is not authenticated');
      if (isProtectedRoute) {
        console.log('Redirecting to login from protected route');
        const returnUrl = encodeURIComponent(pathname);
        window.location.replace(`/login?returnUrl=${returnUrl}`);
      }
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      console.log('Initializing auth...', { pathname });
      try {
        const tokens = authService.getTokens();
        if (tokens) {
          await checkAuth();
        }
      } catch (error) {
        console.error('Failed to restore auth session:', error);
        authService.clearAuth();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading) {
      console.log('Auth state changed, handling navigation...', { 
        isAuthenticated, 
        pathname,
        isLoading 
      });
      handleNavigation();
    }
  }, [isAuthenticated, pathname, isLoading]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 text-gold" />
      </div>
    );
  }

  return <>{children}</>;
}
