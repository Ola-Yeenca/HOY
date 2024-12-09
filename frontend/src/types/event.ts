export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  imageUrl?: string;
  attendees: number;
  djs?: string[];
}
