import { Metadata } from 'next';
import { DashboardProvider } from '@/components/dashboard/DashboardProvider';

export const metadata: Metadata = {
  title: 'Dashboard | HOY',
  description: 'Your luxury event dashboard',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardProvider>
      {children}
    </DashboardProvider>
  );
}
