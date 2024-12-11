'use client';

import { LuxuryAnimation } from '@/components/about/LuxuryAnimation';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaGem, FaUserFriends, FaCalendarAlt, FaStar, FaAward, FaHeart } from 'react-icons/fa';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

const statsList = [
  { number: '10K+', label: 'Active Members', icon: FaUserFriends },
  { number: '500+', label: 'Events Hosted', icon: FaCalendarAlt },
  { number: '4.9', label: 'User Rating', icon: FaStar },
  { number: '50+', label: 'Partner Venues', icon: FaGem }
];

const achievements = [
  { year: '2023', title: 'Best Luxury Event Platform', award: 'Digital Innovation Awards' },
  { year: '2022', title: 'Excellence in Customer Service', award: 'Hospitality Awards' },
  { year: '2021', title: 'Most Innovative Startup', award: 'Tech Pioneers' }
];

const teamMembers = [
  {
    name: 'Ese Young',
    role: 'CEO & Founder',
    image: '/images/team/Ese-young.jpg',
    bio: 'Visionary entrepreneur and creative director with a passion for redefining luxury experiences.',
    socials: {
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    },
    expertise: ['Creative Direction', 'Brand Strategy', 'Event Innovation']
  },
  {
    name: 'Coming Soon',
    role: 'CTO - Lead Tech',
    image: '/images/team/coming-soon.jpg',
    bio: 'Position opening soon.',
    socials: {
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    },
    expertise: ['Brand Design', 'Visual Arts', 'Creative Strategy']
  },
  {
    name: 'Coming Soon',
    role: 'Head of Operations',
    image: '/images/team/coming-soon.jpg',
    bio: 'Position opening soon.',
    socials: {
      linkedin: '#',
      twitter: '#',
      instagram: '#'
    },
    expertise: ['Event Operations', 'Venue Relations', 'Quality Control']
  }
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-coffee-bean to-jet-black text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="mb-16">
          <LuxuryAnimation />
        </div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          {statsList.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="p-6 rounded-lg bg-black/30 border border-gold/20 text-center group hover:border-gold/40 transition-all duration-300"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <stat.icon className="w-8 h-8 text-gold mb-4 mx-auto group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-3xl font-serif text-gold mb-2">{stat.number}</h3>
              <p className="text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-gold">Our Story</h2>
            <p className="text-gray-300 leading-relaxed">
              HOY was born from a vision to revolutionize the way people experience events. 
              We believe that every moment should be extraordinary, and every event should 
              tell a story that resonates with its audience.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaGem className="text-gold" />
                <span>Curated luxury experiences</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaHeart className="text-gold" />
                <span>Passionate about perfection</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaAward className="text-gold" />
                <span>Award-winning service</span>
              </li>
            </ul>
          </motion.div>
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-serif text-gold">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              To create unforgettable experiences that blend luxury with innovation. 
              We strive to set new standards in event planning and execution, ensuring 
              that each occasion becomes a cherished memory.
            </p>
            <div className="bg-black/20 p-6 rounded-lg border border-gold/20">
              <h3 className="text-xl font-serif text-gold mb-4">Why Choose HOY?</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Exclusive access to premium venues</li>
                <li>• Personalized event curation</li>
                <li>• Dedicated concierge service</li>
                <li>• Luxury partner network</li>
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Achievements Section */}
        <motion.div 
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif text-gold text-center mb-10">Our Achievements</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.year}
                className="p-6 rounded-lg bg-black/30 border border-gold/20 hover:border-gold/40 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="text-gold text-xl mb-2">{achievement.year}</div>
                <h3 className="text-xl font-serif mb-2">{achievement.title}</h3>
                <p className="text-gray-400">{achievement.award}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Meet the Team Section */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-serif text-gold text-center mb-4">Meet Our Team</h2>
          <p className="text-gray-400 text-center max-w-2xl mx-auto mb-12">
            Our team of industry experts brings together decades of experience in luxury events,
            creative design, and exceptional service delivery.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.name}
                className="group relative"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="relative h-[400px] rounded-lg overflow-hidden mb-6">
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent 
                    opacity-60 group-hover:opacity-80 transition-opacity duration-300 z-10" />
                  
                  {/* Image */}
                  <Image
                    loading="lazy"
                    sizes="100vw"
                    style={{ width: '100%', height: '100%' }}
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Hover Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 z-20">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <h3 className="text-2xl font-serif text-gold mb-1">{member.name}</h3>
                      <p className="text-white-plum/80 mb-2">{member.role}</p>
                      <p className="text-white-plum/80 text-sm mb-4 line-clamp-2 group-hover:line-clamp-none transition-all duration-300">
                        {member.bio}
                      </p>
                      
                      {/* Expertise Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {member.expertise.map((skill) => (
                          <span
                            key={skill}
                            className="text-xs px-2 py-1 rounded-full bg-gold/20 text-gold/90"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                      
                      {/* Social Links */}
                      <div className="flex space-x-4">
                        <a href={member.socials.linkedin} className="text-gold/80 hover:text-gold transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                        <a href={member.socials.twitter} className="text-gold/80 hover:text-gold transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                          </svg>
                        </a>
                        <a href={member.socials.instagram} className="text-gold/80 hover:text-gold transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                          </svg>
                        </a>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {[
            {
              title: "Exclusive Events",
              description: "Access to high-profile and intimate gatherings that define luxury.",
              icon: FaGem
            },
            {
              title: "Personalized Experience",
              description: "Tailored recommendations based on your preferences and style.",
              icon: FaUserFriends
            },
            {
              title: "Premium Service",
              description: "Dedicated support to ensure your event experience is flawless.",
              icon: FaAward
            }
          ].map((feature, index) => (
            <motion.div 
              key={index}
              className="p-6 rounded-lg bg-black/30 border border-gold/20 hover:border-gold/40 transition-all duration-300 group"
              variants={fadeInUp}
              transition={{ delay: index * 0.1 }}
            >
              <feature.icon className="w-8 h-8 text-gold mb-4 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-xl font-serif text-gold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
