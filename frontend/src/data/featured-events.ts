export interface FeaturedEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  dj: string;
  tag: string;
  image: string;
}

export const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: '1',
    title: 'Summer Night Vibes',
    description: 'An unforgettable night of house music under the stars.',
    date: 'July 15, 2024',
    location: 'HOY Main Stage',
    dj: 'DJ Stellar',
    tag: 'Premium',
    image: '/images/events/summer-vibes.jpg'
  },
  {
    id: '2',
    title: 'Tech House Revolution',
    description: 'Experience the future of electronic music.',
    date: 'July 22, 2024',
    location: 'The Underground',
    dj: 'DJ Nova',
    tag: 'Exclusive',
    image: '/images/events/tech-house.jpg'
  },
  {
    id: '3',
    title: 'Deep House Journey',
    description: 'Dive into the soulful sounds of deep house.',
    date: 'July 29, 2024',
    location: 'Skyline Terrace',
    dj: 'DJ Luna',
    tag: 'VIP',
    image: '/images/events/deep-house.jpg'
  }
];
