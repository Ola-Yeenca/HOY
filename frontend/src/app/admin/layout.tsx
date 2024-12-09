'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUsers, FaImages, FaChartBar, FaCog, FaPoll } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { icon: FaChartBar, label: 'Dashboard', path: '/admin' },
  { icon: FaCalendarAlt, label: 'Events', path: '/admin/events' },
  { icon: FaUsers, label: 'Users', path: '/admin/users' },
  { icon: FaImages, label: 'Media', path: '/admin/media' },
  { icon: FaPoll, label: 'Surveys', path: '/admin/surveys' },
  { icon: FaCog, label: 'Settings', path: '/admin/settings' },
];

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-jet-black">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="w-64 bg-coffee-bean border-r border-gold/20"
      >
        <div className="p-6">
          <h1 className="text-2xl font-serif font-bold text-gold">HOY Admin</h1>
        </div>
        <nav className="mt-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-gold bg-gold/10'
                    : 'text-white-plum hover:text-gold hover:bg-gold/5'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 bg-coffee-bean border-b border-gold/20">
          <div className="flex items-center justify-between px-6 h-full">
            <div className="flex items-center space-x-4">
              <button className="text-white-plum hover:text-gold">
                <FaCalendarAlt className="w-5 h-5" />
              </button>
              <button className="text-white-plum hover:text-gold">
                <FaUsers className="w-5 h-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-white-plum hover:text-gold">
                <FaCog className="w-5 h-5" />
              </button>
              <div className="w-8 h-8 rounded-full bg-gold/20" />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-gradient-to-b from-jet-black to-coffee-bean p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
