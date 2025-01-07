import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Providers } from '@/components/providers/Providers';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Loader } from '@/components/ui/loader';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

// Dynamically import heavy components
const ClientLayout = dynamic(() => import('@/components/layout/ClientLayout'), {
  loading: () => (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-12 h-12 text-gold" />
    </div>
  ),
});

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
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <AuthProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <Loader className="w-12 h-12 text-gold" />
                </div>
              }
            >
              <ClientLayout>{children}</ClientLayout>
            </Suspense>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
