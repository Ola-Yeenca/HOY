'use client';

import React from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { FaComments, FaStar, FaChartLine, FaArrowRight } from 'react-icons/fa';
import StatsCard from '@/components/feedback/StatsCard';
import EnhancedSurveyCard from '@/components/feedback/EnhancedSurveyCard';
import { motion } from 'framer-motion';

// Mock data - replace with actual API calls
const mockSurveys = [
  {
    id: '1',
    title: 'Event Experience Survey',
    description: 'Help us improve our events by sharing your experience',
    survey_type: 'event',
    start_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    end_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days from now
    is_active: true,
    questions: [
      {
        id: '1',
        type: 'rating',
        question: 'How would you rate the event overall?',
        options: ['1', '2', '3', '4', '5']
      },
      {
        id: '2',
        type: 'text',
        question: 'What did you enjoy most about the event?'
      }
    ]
  },
  {
    id: '2',
    title: 'Platform Feedback',
    description: 'Share your thoughts on our platform features',
    survey_type: 'general',
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    end_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    is_active: true,
    questions: [
      {
        id: '1',
        type: 'rating',
        question: 'How easy is it to navigate the platform?',
        options: ['1', '2', '3', '4', '5']
      },
      {
        id: '2',
        type: 'text',
        question: 'What features would you like to see added?'
      }
    ]
  },
  {
    id: '3',
    title: 'Music Preferences Survey',
    description: 'Tell us about your music taste to help us curate better events',
    survey_type: 'music',
    start_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    is_active: true,
    questions: [
      {
        id: '1',
        type: 'multiple',
        question: 'What genres do you enjoy?',
        options: ['Hip Hop', 'R&B', 'Jazz', 'Rock', 'Electronic']
      },
      {
        id: '2',
        type: 'text',
        question: 'Who are your favorite artists?'
      }
    ]
  }
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function FeedbackPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black via-coffee-bean to-jet-black py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="show"
        variants={container}
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <motion.div variants={item} className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-4 text-gradient">
            Feedback & Surveys
          </h1>
          <p className="text-white-plum/70">
            Help us improve by participating in our surveys. Your feedback shapes the future of our community!
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Total Responses"
            value="2,845"
            increase="+12.5% from last month"
            icon={<FaComments />}
            delay={0.1}
          />
          <StatsCard
            title="Average Rating"
            value="4.8"
            increase="+0.3 points"
            icon={<FaStar />}
            delay={0.2}
          />
          <StatsCard
            title="Completion Rate"
            value="92%"
            increase="+5% this week"
            icon={<FaChartLine />}
            delay={0.3}
          />
        </div>

        {/* Surveys Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {mockSurveys.map((survey, index) => (
            <motion.div
              key={survey.id}
              variants={item}
              whileHover={{ scale: 1.02 }}
              className="h-full"
            >
              <EnhancedSurveyCard survey={survey} index={index} />
            </motion.div>
          ))}
          
          {/* Action Card */}
          <motion.div
            variants={item}
            className="relative overflow-hidden rounded-xl bg-jet-black border border-gold/20 p-6 flex items-center justify-center group cursor-pointer hover:border-gold/50 transition-colors"
            whileHover={{ scale: 1.02 }}
          >
            <div className="text-center">
              <h3 className="text-xl font-serif font-semibold text-white mb-2">Create New Survey</h3>
              <p className="text-white-plum/70 mb-4">Start gathering feedback from your community</p>
              <motion.div
                className="inline-flex items-center text-gold group-hover:text-white transition-colors"
                whileHover={{ x: 5 }}
              >
                Get Started <FaArrowRight className="ml-2" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
