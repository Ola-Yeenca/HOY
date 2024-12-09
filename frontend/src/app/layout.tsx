import { Providers } from './providers';
import './globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Loader } from '@/components/ui/loader';
import { ToastProvider } from '@/components/ui/toast-provider';

// Dynamically import heavy components
const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout').then(mod => mod.ClientLayout), {
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <Loader className="w-12 h-12 text-gold" />
    </div>
  )
});

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'HOY - House Of Young',
  description: 'House Of Young - A Luxury Event Experience',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <Suspense fallback={
              <div className="min-h-screen flex items-center justify-center">
                <Loader className="w-12 h-12 text-gold" />
              </div>
            }>
              <ClientLayout>
                {children}
              </ClientLayout>
            </Suspense>
            <ToastProvider />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
