import axios from 'axios';
import { Survey, Question, SurveyResponse } from '../types/survey';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_DOCKER_URL || process.env.NEXT_PUBLIC_API_URL;
if (!API_BASE_URL) {
  throw new Error("API base URL is not defined in environment variables");
}

const feedbackApi = axios.create({
  baseURL: `${API_BASE_URL}/api/feedback`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor to handle authentication
feedbackApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

feedbackApi.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const surveyApi = {
  // Get all surveys
  getSurveys: async () => {
    const response = await feedbackApi.get('/surveys/');
    return response.data;
  },

  // Get a specific survey
  getSurvey: async (id: string) => {
    const response = await feedbackApi.get(`/surveys/${id}/`);
    return response.data;
  },

  // Get survey analytics
  getSurveyAnalytics: async (id: string) => {
    const response = await feedbackApi.get(`/surveys/${id}/analytics/`);
    return response.data;
  },

  // Submit a survey response
  submitResponse: async (surveyId: string, responseData: SurveyResponse) => {
    const { survey, ...rest } = responseData; // Destructure to remove survey field if it exists
    const response = await feedbackApi.post('/survey-responses/', {
      survey: surveyId,
      ...rest,
    });
    return response.data;
  },
};

export const feedbackService = {
  // Get all feedback
  getFeedback: async () => {
    const response = await feedbackApi.get('/feedback/');
    return response.data;
  },

  // Get feedback statistics
  getFeedbackStats: async () => {
    const response = await feedbackApi.get('/feedback/statistics/');
    return response.data;
  },

  // Submit new feedback
  submitFeedback: async (feedback: any) => {
    const response = await feedbackApi.post('/feedback/', feedback);
    return response.data;
  },

  // Update feedback status
  updateFeedbackStatus: async (id: string, status: string) => {
    const response = await feedbackApi.patch(`/feedback/${id}/update_status/`, { status });
    return response.data;
  },

  // Respond to feedback
  respondToFeedback: async (id: string, responseText: string) => {
    const response = await feedbackApi.post(`/feedback/${id}/respond/`, {
      response: responseText
    });
    return response.data;
  },
};
