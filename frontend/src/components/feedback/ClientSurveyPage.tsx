'use client';

import { motion } from 'framer-motion';
import { SurveyForm } from './SurveyForm';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { LoadingSpinner } from '../shared/LoadingSpinner';

interface Question {
  id: string;
  type: 'rating' | 'text' | 'choice' | 'emoji' | 'thumbs';
  question: string;
  options?: string[];
  required?: boolean;
}

interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface ClientSurveyPageProps {
  survey: Survey;
}

export function ClientSurveyPage({ survey }: ClientSurveyPageProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (responses: Record<string, any>) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      console.log('Survey responses:', responses);
      
      // Show success message and redirect
      router.push('/feedback/thank-you');
    } catch (error) {
      console.error('Failed to submit survey:', error);
      setError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-coffee-bean text-white-plum py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-gold">{survey.title}</h1>
          <p className="text-white-plum/80">{survey.description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-coffee-bean/50 rounded-lg border border-dark-gray hover:border-gold transition-all duration-300 backdrop-blur-sm p-8"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400">
              {error}
            </div>
          )}
          
          {isSubmitting ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="large" />
            </div>
          ) : (
            <SurveyForm
              questions={survey.questions}
              onSubmit={handleSubmit}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
