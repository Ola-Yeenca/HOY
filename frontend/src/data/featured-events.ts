import { Event } from '@/types/events';

export interface FeaturedEvent extends Event {
  // No additional properties needed
}

export const FEATURED_EVENTS: FeaturedEvent[] = [
  {
    id: '1',
    title: 'Summer Night Vibes',
    description: 'An unforgettable night of house music under the stars.',
    date: 'July 15, 2024',
    slug: 'summer-night-vibes',
    start_time: '22:00',
    location: {
      name: 'HOY Main Stage',
      address: 'Amsterdam',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041
    },
    image: '/images/events/summer-vibes.jpg',
    featured_image: '/images/events/summer-vibes.jpg',
    djs: [{
      id: '1',
      name: 'DJ Stellar',
      artist_name: 'DJ Stellar',
      bio: 'House music specialist',
      profile_image: '/images/djs/stellar.jpg',
      genres: ['House', 'Tech House'],
      social_media: {
        instagram: '@djstellar',
        twitter: '@djstellar'
      }
    }],
    capacity: 500,
    age_restriction: "18+",
    ticket_types: [
      {
        name: 'Early Bird',
        price: 25
      },
      {
        name: 'Regular',
        price: 35
      }
    ],
    is_featured: true
  },
  {
    id: '2',
    title: 'Tech House Revolution',
    description: 'Experience the future of electronic music.',
    date: 'July 22, 2024',
    slug: 'tech-house-revolution',
    start_time: '23:00',
    location: {
      name: 'The Underground',
      address: 'Amsterdam',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041
    },
    image: '/images/events/tech-house.jpg',
    featured_image: '/images/events/tech-house.jpg',
    djs: [{
      id: '2',
      name: 'DJ Nova',
      artist_name: 'DJ Nova',
      bio: 'Tech house pioneer',
      profile_image: '/images/djs/nova.jpg',
      genres: ['Tech House', 'Minimal'],
      social_media: {
        instagram: '@djnova',
        twitter: '@djnova'
      }
    }],
    capacity: 300,
    age_restriction: "21+",
    ticket_types: [
      {
        name: 'Early Bird',
        price: 30
      },
      {
        name: 'Regular',
        price: 40
      }
    ],
    is_featured: true
  },
  {
    id: '3',
    title: 'Deep House Journey',
    description: 'Dive into the soulful sounds of deep house.',
    date: 'July 29, 2024',
    slug: 'deep-house-journey',
    start_time: '21:00',
    location: {
      name: 'Skyline Terrace',
      address: 'Amsterdam',
      city: 'Amsterdam',
      latitude: 52.3676,
      longitude: 4.9041
    },
    image: '/images/events/deep-house.jpg',
    featured_image: '/images/events/deep-house.jpg',
    djs: [{
      id: '3',
      name: 'DJ Luna',
      artist_name: 'DJ Luna',
      bio: 'Deep house specialist',
      profile_image: '/images/djs/luna.jpg',
      genres: ['Deep House', 'Progressive House'],
      social_media: {
        instagram: '@djluna',
        twitter: '@djluna'
      }
    }],
    capacity: 200,
    age_restriction: "21+",
    ticket_types: [
      {
        name: 'Early Bird',
        price: 35
      },
      {
        name: 'Regular',
        price: 45
      }
    ],
    is_featured: true
  }
];
