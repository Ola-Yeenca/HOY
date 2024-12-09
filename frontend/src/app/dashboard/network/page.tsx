import UserNetwork from '@/components/dashboard/network/UserNetwork';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Network | HOY',
  description: 'Connect with other luxury enthusiasts in your network',
};

export default function NetworkPage() {
  return <UserNetwork />;
}
