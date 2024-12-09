'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaChartLine, FaUsers, FaStar, FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const mockData = {
  stats: {
    activeEvents: 12,
    totalUsers: 2547,
    averageRating: 4.8,
    pendingIssues: 3
  },
  chartData: [
    { name: 'Jan', events: 4, attendees: 450 },
    { name: 'Feb', events: 6, attendees: 680 },
    { name: 'Mar', events: 8, attendees: 890 },
    { name: 'Apr', events: 12, attendees: 1200 }
  ]
};

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            <Typewriter
              options={{
                strings: ['Welcome back, Admin', 'Dashboard Overview'],
                autoStart: true,
                loop: true,
                delay: 50
              }}
            />
          </h1>
          <p className="text-white-plum">Here's what's happening with your events today.</p>
        </div>
        <Link
          href="/admin/events/new"
          className="flex items-center px-4 py-2 bg-gold text-jet-black rounded-lg hover:bg-gold/90 transition-colors"
        >
          <FaCalendarPlus className="w-5 h-5 mr-2" />
          New Event
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: 'Active Events',
            value: mockData.stats.activeEvents,
            icon: FaCalendarPlus,
            color: 'bg-emerald-500/10 text-emerald-500'
          },
          {
            label: 'Total Users',
            value: mockData.stats.totalUsers.toLocaleString(),
            icon: FaUsers,
            color: 'bg-blue-500/10 text-blue-500'
          },
          {
            label: 'Average Rating',
            value: mockData.stats.averageRating,
            icon: FaStar,
            color: 'bg-yellow-500/10 text-yellow-500'
          },
          {
            label: 'Pending Issues',
            value: mockData.stats.pendingIssues,
            icon: FaExclamationTriangle,
            color: 'bg-red-500/10 text-red-500'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-coffee-bean rounded-xl p-6 border border-gold/20"
          >
            <div className={`inline-flex p-3 rounded-lg ${stat.color} mb-4`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-white-plum">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-coffee-bean rounded-xl p-6 border border-gold/20"
      >
        <h2 className="text-xl font-serif font-bold text-white mb-6">Events Overview</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData.chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff60" />
              <YAxis stroke="#ffffff60" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  borderRadius: '8px'
                }}
              />
              <Line
                type="monotone"
                dataKey="events"
                stroke="#FFD700"
                strokeWidth={2}
                dot={{ fill: '#FFD700' }}
              />
              <Line
                type="monotone"
                dataKey="attendees"
                stroke="#4FD1C5"
                strokeWidth={2}
                dot={{ fill: '#4FD1C5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-coffee-bean rounded-xl p-6 border border-gold/20"
      >
        <h2 className="text-xl font-serif font-bold text-white mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            'New event "Summer Vibes 2024" created',
            'User feedback received for "Night Groove"',
            'Image gallery updated for "Beach Party"',
            '15 new users registered today'
          ].map((activity, index) => (
            <div
              key={index}
              className="flex items-center space-x-4 p-4 bg-jet-black rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-gold" />
              <p className="text-white-plum">{activity}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
