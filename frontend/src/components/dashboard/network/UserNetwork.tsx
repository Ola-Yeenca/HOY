'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FaSearch, FaUserPlus } from 'react-icons/fa';

interface NetworkUser {
  id: string;
  first_name: string;
  last_name: string;
  profile_image?: string;
  title: string;
  mutual_connections: number;
  is_connected: boolean;
}

export default function UserNetwork() {
  const [searchQuery, setSearchQuery] = useState('');
  const [users] = useState<NetworkUser[]>([
    {
      id: '1',
      first_name: 'James',
      last_name: 'Anderson',
      profile_image: '/images/profiles/james.jpg',
      title: 'Luxury Event Organizer',
      mutual_connections: 12,
      is_connected: false
    },
    {
      id: '2',
      first_name: 'Sarah',
      last_name: 'Mitchell',
      profile_image: '/images/profiles/sarah.jpg',
      title: 'Fashion Influencer',
      mutual_connections: 8,
      is_connected: true
    },
  ]);

  const [suggestedUsers] = useState<NetworkUser[]>([
    {
      id: '3',
      first_name: 'Michael',
      last_name: 'Roberts',
      profile_image: '/images/profiles/michael.jpg',
      title: 'Luxury Real Estate Agent',
      mutual_connections: 15,
      is_connected: false
    },
  ]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gold mb-4">Your Network</h1>
        <p className="text-white/80">Connect with other luxury enthusiasts</p>
      </div>

      <div className="relative mb-8">
        <Input
          type="text"
          placeholder="Search your network..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 bg-black/40 border-gold/20 text-white"
        />
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-semibold text-gold mb-6">Your Connections</h2>
          <div className="space-y-6">
            {users.map((user) => (
              <Card
                key={user.id}
                className="p-6 bg-black/40 backdrop-blur-xl border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-xl">
                        {user.first_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-white/80 mb-2">{user.title}</p>
                    <p className="text-sm text-white/60">
                      {user.mutual_connections} mutual connections
                    </p>
                  </div>
                  <button
                    className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                      user.is_connected
                        ? 'bg-gold/20 text-gold'
                        : 'bg-gold text-black hover:bg-gold/90'
                    } transition-colors`}
                  >
                    {user.is_connected ? (
                      'Connected'
                    ) : (
                      <>
                        <FaUserPlus />
                        Connect
                      </>
                    )}
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gold mb-6">Suggested Connections</h2>
          <div className="space-y-6">
            {suggestedUsers.map((user) => (
              <Card
                key={user.id}
                className="p-6 bg-black/40 backdrop-blur-xl border border-gold/20 hover:border-gold/40 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    {user.profile_image ? (
                      <img
                        src={user.profile_image}
                        alt={`${user.first_name} ${user.last_name}`}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full bg-gold/20 flex items-center justify-center text-gold text-xl">
                        {user.first_name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gold">
                      {user.first_name} {user.last_name}
                    </h3>
                    <p className="text-sm text-white/80 mb-1">{user.title}</p>
                    <p className="text-xs text-white/60">
                      {user.mutual_connections} mutual connections
                    </p>
                  </div>
                </div>
                <button className="w-full mt-4 px-4 py-2 rounded-full bg-gold text-black hover:bg-gold/90 transition-colors flex items-center justify-center gap-2">
                  <FaUserPlus />
                  Connect
                </button>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
