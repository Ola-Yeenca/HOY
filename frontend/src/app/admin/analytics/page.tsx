'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { FaUsers, FaTicketAlt, FaHeart, FaDownload, FaShare } from 'react-icons/fa';

const COLORS = ['#FFD700', '#DAA520', '#B8860B', '#8B6914'];

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  
  const mockData = {
    eventAttendance: [
      { date: '2024-01', attendees: 150, tickets: 200 },
      { date: '2024-02', attendees: 280, tickets: 320 },
      { date: '2024-03', attendees: 450, tickets: 500 },
      { date: '2024-04', attendees: 380, tickets: 420 },
    ],
    engagementStats: [
      { name: 'Likes', value: 1234 },
      { name: 'Shares', value: 456 },
      { name: 'Downloads', value: 789 },
      { name: 'Comments', value: 321 },
    ],
    popularEvents: [
      { name: 'Summer Festival', tickets: 450 },
      { name: 'Jazz Night', tickets: 380 },
      { name: 'DJ Party', tickets: 320 },
      { name: 'Live Concert', tickets: 280 },
    ],
  };

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    { icon: FaUsers, label: 'Total Users', value: '5,234', change: '+12%' },
    { icon: FaTicketAlt, label: 'Tickets Sold', value: '1,890', change: '+8%' },
    { icon: FaHeart, label: 'Total Likes', value: '12.5K', change: '+15%' },
    { icon: FaShare, label: 'Total Shares', value: '3.2K', change: '+5%' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gold">Analytics Dashboard</h1>
          <p className="text-white-plum">Track your event performance and user engagement</p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-coffee-bean text-white-plum border border-gold/20 rounded-lg px-4 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="1y">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-coffee-bean p-6 rounded-xl border border-gold/20"
          >
            <div className="flex items-center justify-between">
              <stat.icon className="w-8 h-8 text-gold" />
              <span className={`text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mt-2">{stat.value}</h3>
            <p className="text-white-plum text-sm">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-coffee-bean p-6 rounded-xl border border-gold/20"
        >
          <h3 className="text-xl font-bold text-gold mb-4">Event Attendance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData.eventAttendance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="date" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="attendees"
                  stroke="#FFD700"
                  fill="#FFD70040"
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="#DAA520"
                  fill="#DAA52040"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Engagement Chart */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-coffee-bean p-6 rounded-xl border border-gold/20"
        >
          <h3 className="text-xl font-bold text-gold mb-4">User Engagement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockData.engagementStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {mockData.engagementStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Popular Events Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-coffee-bean p-6 rounded-xl border border-gold/20 lg:col-span-2"
        >
          <h3 className="text-xl font-bold text-gold mb-4">Popular Events</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockData.popularEvents}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis dataKey="name" stroke="#ffffff80" />
                <YAxis stroke="#ffffff80" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="tickets" fill="#FFD700" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPage;
