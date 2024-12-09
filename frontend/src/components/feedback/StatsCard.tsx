import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatsCardProps {
  title: string;
  value: string;
  increase: string;
  icon: React.ReactNode;
  delay?: number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, increase, icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative overflow-hidden rounded-xl bg-jet-black backdrop-blur-lg border border-gold/20 hover:border-gold/50 transition-colors"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-30" />
      <div className="relative p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white-plum/70 text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-serif font-bold text-white mb-1">{value}</h3>
            <p className="text-gold text-sm">{increase}</p>
          </div>
          <div className="text-gold text-3xl">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;
