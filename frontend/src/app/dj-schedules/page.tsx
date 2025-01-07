import { DJScheduleList } from '@/components/dj-schedules/DJScheduleList';

export default function DJSchedulesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">DJ Performance Schedules</h1>
      <DJScheduleList />
    </div>
  );
}
