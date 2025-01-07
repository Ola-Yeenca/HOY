'use client';

import { ReactNode } from 'react';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AppProvider>
      {children}
      <Toaster />
    </AppProvider>
  );
}
