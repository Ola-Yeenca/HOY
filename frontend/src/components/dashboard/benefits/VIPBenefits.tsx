'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { FaCrown, FaGem, FaGlassMartini, FaPlane } from 'react-icons/fa';

interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: 'active' | 'locked';
  level: 'gold' | 'platinum' | 'diamond';
}

export default function VIPBenefits() {
  const benefits: Benefit[] = [
    {
      id: '1',
      title: 'Priority Event Access',
      description: 'Get exclusive early access to all luxury events before general release',
      icon: <FaCrown className="w-6 h-6" />,
      status: 'active',
      level: 'gold'
    },
    {
      id: '2',
      title: 'Luxury Concierge Service',
      description: '24/7 personal concierge service for all your luxury needs',
      icon: <FaGem className="w-6 h-6" />,
      status: 'active',
      level: 'platinum'
    },
    {
      id: '3',
      title: 'Private Jet Access',
      description: 'Access to private jet services for event transportation',
      icon: <FaPlane className="w-6 h-6" />,
      status: 'locked',
      level: 'diamond'
    },
    {
      id: '4',
      title: 'VIP Lounge Access',
      description: 'Exclusive access to VIP lounges at all our events',
      icon: <FaGlassMartini className="w-6 h-6" />,
      status: 'active',
      level: 'gold'
    },
  ];

  const levelColors = {
    gold: 'from-gold to-amber-300',
    platinum: 'from-slate-300 to-slate-100',
    diamond: 'from-blue-300 to-purple-300'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-8"
    >
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gold mb-4">VIP Benefits</h1>
        <p className="text-white/80">Explore your exclusive privileges and benefits</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {benefits.map((benefit) => (
          <Card
            key={benefit.id}
            className={`relative p-6 bg-black/40 backdrop-blur-xl border ${
              benefit.status === 'active' ? 'border-gold/20' : 'border-gray-800'
            } overflow-hidden group`}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity" />
            
            <div className="relative flex items-start gap-4">
              <div className={`p-3 rounded-lg bg-gradient-to-br ${levelColors[benefit.level]} bg-opacity-20`}>
                {benefit.icon}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-gold">{benefit.title}</h3>
                  {benefit.status === 'locked' && (
                    <span className="px-2 py-1 rounded-full bg-gray-800 text-gray-400 text-xs">
                      Locked
                    </span>
                  )}
                </div>
                <p className="text-white/80">{benefit.description}</p>
                
                <div className="mt-4 flex items-center gap-2">
                  <span className={`text-sm capitalize ${
                    benefit.level === 'gold' ? 'text-gold' :
                    benefit.level === 'platinum' ? 'text-slate-300' :
                    'text-blue-300'
                  }`}>
                    {benefit.level} Level
                  </span>
                  {benefit.status === 'locked' && (
                    <button className="ml-auto px-4 py-1 rounded-full bg-gold/20 text-gold text-sm hover:bg-gold/30 transition-colors">
                      Upgrade to Unlock
                    </button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12"
      >
        <Card className="p-8 bg-gradient-to-br from-black to-gold/20 border border-gold/20">
          <h2 className="text-2xl font-bold text-gold mb-4">Upgrade Your Experience</h2>
          <p className="text-white/80 mb-6">
            Unlock all premium benefits and elevate your luxury lifestyle with our Diamond membership.
          </p>
          <button className="px-6 py-3 rounded-full bg-gold text-black font-semibold hover:bg-gold/90 transition-colors">
            Upgrade to Diamond
          </button>
        </Card>
      </motion.div>
    </motion.div>
  );
}
