import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedSurveyCard from '@/components/feedback/EnhancedSurveyCard';
import { Survey } from '@/types/feedback';
import { SurveyResponse } from '@/components/feedback/SurveyResponseForm';

const FeedbackPage: React.FC = () => {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchSurveys = async () => {
      try {
        // Simulated API response
        const mockSurveys: Survey[] = [
          {
            id: '1',
            title: 'Monthly Satisfaction Survey',
            description: 'Help us understand your experience with our services this month.',
            survey_type: 'satisfaction',
            start_date: '2024-01-01',
            end_date: '2024-01-31',
            is_active: true,
            created_at: '2024-01-01T00:00:00Z',
            updated_at: '2024-01-01T00:00:00Z',
            questions: [
              {
                id: '1',
                type: 'rating',
                question: 'How satisfied are you with our service?',
                options: ['1', '2', '3', '4', '5']
              },
              {
                id: '2',
                type: 'text',
                question: 'What improvements would you suggest?'
              }
            ]
          },
          {
            id: '2',
            title: 'Feature Request Survey',
            description: 'Help us prioritize our upcoming features.',
            survey_type: 'feature',
            start_date: '2024-02-01',
            end_date: '2024-02-28',
            is_active: true,
            created_at: '2024-02-01T00:00:00Z',
            updated_at: '2024-02-01T00:00:00Z',
            questions: [
              {
                id: '1',
                type: 'multiple_choice',
                question: 'Which feature would you like to see next?',
                options: ['Dark mode', 'Mobile app', 'Integration with other tools', 'Custom themes']
              },
              {
                id: '2',
                type: 'text',
                question: 'Any other feature suggestions?'
              }
            ]
          }
        ];

        setSurveys(mockSurveys);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching surveys:', error);
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  const handleSurveyResponse = async (response: SurveyResponse) => {
    try {
      // TODO: Replace with actual API call
      console.log('Survey response submitted:', response);
      // Simulated API success
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting survey response:', error);
      alert('Failed to submit survey response. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Feedback</h1>
          <p className="text-white-plum">Share your thoughts and help us improve your experience.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {surveys.map((survey, index) => (
            <EnhancedSurveyCard
              key={survey.id}
              survey={survey}
              index={index}
              onSubmitResponse={handleSurveyResponse}
            />
          ))}
        </div>

        {surveys.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white-plum">No active surveys at the moment.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default FeedbackPage;
