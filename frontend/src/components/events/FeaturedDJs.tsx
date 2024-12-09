import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { FaInstagram, FaSoundcloud, FaSpotify } from 'react-icons/fa';

const featuredDJs = [
  {
    id: '1',
    name: 'DJ Cascade',
    image: '/images/dj-1.jpg',
    genre: 'House / Tech House',
    followers: '245K',
    instagram: '@djcascade',
    soundcloud: 'djcascade',
    spotify: 'djcascade',
    upcoming: 3,
  },
  {
    id: '2',
    name: 'Luna Beat',
    image: '/images/dj-2.jpg',
    genre: 'Deep House / Melodic Techno',
    followers: '180K',
    instagram: '@lunabeat',
    soundcloud: 'lunabeat',
    spotify: 'lunabeat',
    upcoming: 2,
  },
  {
    id: '3',
    name: 'Rhythm X',
    image: '/images/dj-3.jpg',
    genre: 'Progressive House',
    followers: '320K',
    instagram: '@rhythmx',
    soundcloud: 'rhythmx',
    spotify: 'rhythmx',
    upcoming: 4,
  },
];

export function FeaturedDJs() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {featuredDJs.map((dj, index) => (
        <motion.div
          key={dj.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-jet-black/50 rounded-3xl p-6 backdrop-blur-sm hover:bg-jet-black/60 transition-all duration-300 group"
        >
          <div className="relative mb-6">
            <div className="aspect-square rounded-2xl overflow-hidden">
              <Image
                width={0}
                height={0}
                src={dj.image}
                alt={dj.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="absolute bottom-4 right-4 flex gap-2">
              <Link
                href={`https://instagram.com/${dj.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-jet-black/70 p-2 rounded-full backdrop-blur-sm hover:bg-gold/90 transition-colors group"
              >
                <FaInstagram className="text-gold group-hover:text-jet-black transition-colors" />
              </Link>
              <Link
                href={`https://soundcloud.com/${dj.soundcloud}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-jet-black/70 p-2 rounded-full backdrop-blur-sm hover:bg-gold/90 transition-colors group"
              >
                <FaSoundcloud className="text-gold group-hover:text-jet-black transition-colors" />
              </Link>
              <Link
                href={`https://open.spotify.com/artist/${dj.spotify}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-jet-black/70 p-2 rounded-full backdrop-blur-sm hover:bg-gold/90 transition-colors group"
              >
                <FaSpotify className="text-gold group-hover:text-jet-black transition-colors" />
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-gold">{dj.name}</h3>
              <p className="text-chalk/80">{dj.genre}</p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-chalk/60">Followers</p>
                <p className="text-gold font-semibold">{dj.followers}</p>
              </div>
              <div>
                <p className="text-sm text-chalk/60">Upcoming</p>
                <p className="text-gold font-semibold">{dj.upcoming} events</p>
              </div>
            </div>

            <Link
              href={`/dj/${dj.id}`}
              className="block text-center bg-jet-black/70 hover:bg-gold/90 text-gold hover:text-jet-black px-6 py-3 rounded-full font-semibold backdrop-blur-sm transition-colors"
            >
              View Profile
            </Link>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
