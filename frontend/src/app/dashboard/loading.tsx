import { Loader } from '@/components/ui/loader';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-coffee-bean to-jet-black">
      <Loader className="w-12 h-12 text-gold" />
    </div>
  );
}
