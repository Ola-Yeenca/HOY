import { Event } from '@/types/events';

export const FEATURED_EVENTS: Event[] = [
  {
    id: "1",
    title: "New Year's Eve Gala",
    description: "Join us for an unforgettable night of luxury and celebration. Ring in the new year with an exclusive black-tie event featuring world-class entertainment, gourmet dining, and champagne toasts.",
    date: "2024-12-31",
    slug: "new-years-eve-gala",
    start_time: "20:00",
    location: {
      name: "HOY Grand Ballroom",
      address: "Valencia",
      city: "Valencia",
      latitude: 39.4699,
      longitude: -0.3763,
    },
    djs: [{
      id: '1',
      name: 'Special Guest DJ',
      artist_name: 'Special Guest DJ',
      bio: 'An amazing DJ with years of experience',
      profile_image: 'https://images.unsplash.com/photo-1516873240891-4bf014598ab4?q=80&w=2070&auto=format&fit=crop',
      genres: ['House', 'Electronic'],
      social_media: {
        instagram: 'https://instagram.com/specialguestdj'
      }
    }],
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2969&auto=format&fit=crop",
    featured_image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=2969&auto=format&fit=crop",
    capacity: 500,
    age_restriction: "21",
    ticket_types: [
      {
        name: "VIP",
        price: 250
      },
      {
        name: "Standard",
        price: 150
      }
    ],
    is_featured: true
  },
  {
    id: "2",
    title: "Neon Dreams",
    description: "An immersive electronic music experience featuring top international DJs",
    date: "2025-01-15",
    slug: "neon-dreams",
    start_time: "22:00",
    location: {
      name: "HOY Main Hall",
      address: "Valencia",
      city: "Valencia",
      latitude: 39.4699,
      longitude: -0.3763,
    },
    djs: [{
      id: "2",
      name: "DJ Shadow",
      artist_name: "DJ Shadow",
      bio: "Pioneering electronic music producer and DJ",
      profile_image: "/images/dj-2.jpg",
      genres: ["Electronic", "Trip Hop"],
      social_media: {
        instagram: "https://instagram.com/djshadow",
        twitter: "https://twitter.com/djshadow"
      }
    }],
    image: "/images/event-1.jpg",
    featured_image: "/images/event-1.jpg",
    capacity: 1000,
    age_restriction: "18",
    ticket_types: [
      {
        name: "Early Bird",
        price: 50
      },
      {
        name: "Regular",
        price: 75
      }
    ],
    is_featured: true
  },
  {
    id: "3",
    title: "Deep House Voyage",
    description: "Journey through the depths of house music with underground artists",
    date: "2024-02-07",
    slug: "deep-house-voyage",
    start_time: "22:00",
    location: {
      name: "HOY Underground",
      address: "Valencia",
      city: "Valencia",
      latitude: 39.4699,
      longitude: -0.3763,
    },
    djs: [{
      id: "3",
      name: "Maya Jane Coles",
      artist_name: "Maya Jane Coles",
      bio: "A world-renowned DJ bringing you the best beats",
      profile_image: "/images/dj-3.jpg",
      genres: ["House", "Techno"],
      social_media: {
        instagram: "https://instagram.com/mayajanecoles",
        twitter: "https://twitter.com/mayajanecoles"
      }
    }],
    image: "/images/event-2.jpg",
    featured_image: "/images/event-2.jpg",
    capacity: 300,
    age_restriction: "18",
    ticket_types: [
      {
        name: "Standard",
        price: 50
      }
    ],
    is_featured: true
  },
  {
    id: "4",
    title: "Techno Fusion",
    description: "Where traditional meets modern in an explosive night of techno",
    date: "2024-11-14",
    slug: "techno-fusion",
    start_time: "22:00",
    location: {
      name: "HOY Rooftop",
      address: "Valencia",
      city: "Valencia",
      latitude: 39.4699,
      longitude: -0.3763,
    },
    djs: [{
      id: "4",
      name: "Charlotte de Witte",
      artist_name: "Charlotte de Witte",
      bio: "A world-renowned DJ bringing you the best beats",
      profile_image: "/images/dj-4.jpg",
      genres: ["Techno", "House"],
      social_media: {
        instagram: "https://instagram.com/charlottedewitte",
        twitter: "https://twitter.com/charlottedewitte"
      }
    }],
    image: "/images/event-3.jpg",
    featured_image: "/images/event-3.jpg",
    capacity: 400,
    age_restriction: "18",
    ticket_types: [
      {
        name: "VIP",
        price: 75
      },
      {
        name: "Regular",
        price: 50
      }
    ],
    is_featured: true
  }
];
