import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

interface Question {
  id: string;
  type: 'rating' | 'text' | 'multiple';
  question: string;
  options?: string[];
}

interface Survey {
  id: string;
  title: string;
  description: string;
  survey_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  questions: Question[];
}

interface SurveyCardProps {
  survey: Survey;
}

const SurveyCard: React.FC<SurveyCardProps> = ({ survey }) => {
  const [daysLeft, setDaysLeft] = useState<number>(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const endDate = new Date(survey.end_date).getTime();
      const now = new Date().getTime();
      return Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    };
    setDaysLeft(calculateDaysLeft());
  }, [survey.end_date]);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        sx={{ 
          minWidth: 275, 
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          borderRadius: 2,
          '&:hover': {
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="overline" color="text.secondary">
              {survey.survey_type.toUpperCase()}
            </Typography>
            <Typography variant="h6" component="div" gutterBottom>
              {survey.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {survey.description}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Questions: {survey.questions.length}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              Start Date: {format(new Date(survey.start_date), 'MMM dd, yyyy')}
            </Typography>
            <Typography variant="body2" color="text.secondary" component="div">
              End Date: {format(new Date(survey.end_date), 'MMM dd, yyyy')}
            </Typography>
          </Box>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {daysLeft} days remaining
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={Math.max(0, Math.min(100, (daysLeft / 30) * 100))} 
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SurveyCard;
