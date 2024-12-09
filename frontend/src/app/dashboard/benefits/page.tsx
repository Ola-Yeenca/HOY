import VIPBenefits from '@/components/dashboard/benefits/VIPBenefits';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'VIP Benefits | HOY',
  description: 'Explore your exclusive VIP benefits and privileges',
};

export default function BenefitsPage() {
  return <VIPBenefits />;
}
