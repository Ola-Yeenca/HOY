import EventDetail from '@/components/events/EventDetail';

// Remove all type annotations and async
export default function Page(props) {
  return (
    <main className="min-h-screen">
      <EventDetail id={props.params.id} />
    </main>
  );
}
