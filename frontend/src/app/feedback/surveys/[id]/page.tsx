'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Survey } from '@/types/survey';
import { surveyApi } from '@/services/feedbackApi';
import SurveyResponseForm from '@/components/feedback/SurveyResponseForm';

const SurveyPage = () => {
  const { id } = useParams();
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const data = await surveyApi.getSurvey(id as string);
        setSurvey(data);
      } catch (err) {
        setError('Failed to load survey. Please try again later.');
        console.error('Error fetching survey:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchSurvey();
    }
  }, [id]);

  const handleSubmitResponse = async (response: any) => {
    try {
      await surveyApi.submitResponse(id as string, response);
      // Show success message or redirect
    } catch (err) {
      setError('Failed to submit response. Please try again.');
      console.error('Error submitting response:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (error || !survey) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-white-plum text-center">
          <p className="text-xl mb-4">{error || 'Survey not found'}</p>
          <button
            onClick={() => window.history.back()}
            className="text-gold hover:text-gold/80 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-jet-black to-coffee-bean p-6">
      <div className="max-w-4xl mx-auto">
        <SurveyResponseForm
          survey={survey}
          onSubmit={handleSubmitResponse}
          onClose={() => window.history.back()}
        />
      </div>
    </div>
  );
};

export default SurveyPage;
