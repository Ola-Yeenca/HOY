'use client';

import dynamic from 'next/dynamic';
import { Layout } from './Layout';
import { Suspense } from 'react';
import { Loader } from '../ui/loader';

// Dynamically import navigation and footer
const Navigation = dynamic(() => import('./Navigation').then(mod => mod.Navigation), {
  loading: () => <Loader className="w-8 h-8 text-gold" />
});

const Footer = dynamic(() => import('./Footer').then(mod => mod.Footer), {
  loading: () => <Loader className="w-8 h-8 text-gold" />
});

interface ClientLayoutProps {
  children: React.ReactNode;
}

const ClientLayout = ({ children }: ClientLayoutProps) => {
  return (
    <Layout>
      <Suspense fallback={<Loader className="w-8 h-8 text-gold" />}>
        <Navigation />
      </Suspense>
      <main className="flex-grow">{children}</main>
      <Suspense fallback={<Loader className="w-8 h-8 text-gold" />}>
        <Footer />
      </Suspense>
    </Layout>
  );
};

export default ClientLayout;
