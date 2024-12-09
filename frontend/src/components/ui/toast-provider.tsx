'use client';

import dynamic from 'next/dynamic';

const Toaster = dynamic(() => import('react-hot-toast').then(mod => mod.Toaster), {
  ssr: false
});

export function ToastProvider() {
  return (
    <Toaster 
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
          border: '1px solid rgba(234, 179, 8, 0.2)',
        },
      }}
    />
  );
}
