'use client';

import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      {children}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#343434',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#FFD700',
              secondary: '#343434',
            },
          },
        }}
      />
    </ThemeProvider>
  );
}
