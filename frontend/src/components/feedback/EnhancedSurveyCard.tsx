import React, { useState, useEffect } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { format } from 'date-fns';
import { Survey } from '@/types/survey';
import SurveyResponseForm, { SurveyResponse } from './SurveyResponseForm';

interface EnhancedSurveyCardProps {
  survey: Survey;
  index: number;
  onSubmitResponse?: (response: SurveyResponse) => void;
}

const EnhancedSurveyCard: React.FC<EnhancedSurveyCardProps> = ({ survey, index, onSubmitResponse }) => {
  const [daysLeft, setDaysLeft] = useState<number>(0);
  const [isResponseFormOpen, setIsResponseFormOpen] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  useEffect(() => {
    const calculateDaysLeft = () => {
      const endDate = new Date(survey.end_date).getTime();
      const now = new Date().getTime();
      return Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    };
    setDaysLeft(calculateDaysLeft());
  }, [survey.end_date]);

  function onMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    
    rotateX.set(((y - height / 2) / height) * 20);
    rotateY.set(((x - width / 2) / width) * 20);

    mouseX.set(x);
    mouseY.set(y);
  }

  function onMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
    rotateX.set(0);
    rotateY.set(0);
  }

  const handleSubmitResponse = (response: SurveyResponse) => {
    if (onSubmitResponse) {
      onSubmitResponse(response);
    }
    setIsResponseFormOpen(false);
  };

  const background = useMotionTemplate`radial-gradient(
    circle at ${mouseX}px ${mouseY}px,
    rgba(255, 215, 0, 0.1) 0%,
    rgba(255, 215, 0, 0) 50%
  )`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        onClick={() => setIsResponseFormOpen(true)}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full cursor-pointer"
      >
        <div className="relative h-full overflow-hidden rounded-xl bg-jet-black border border-gold/20 p-6 transition-colors hover:border-gold/50">
          <motion.div
            className="pointer-events-none absolute inset-0 transition duration-300"
            style={{ background }}
          />
          <div className="relative">
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-gold/20 text-gold mb-2">
                {survey.survey_type.toUpperCase()}
              </span>
              <h3 className="text-xl font-serif font-semibold text-white mb-2">{survey.title}</h3>
              <p className="text-white-plum">{survey.description}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white-plum/70">Questions</span>
                <span className="text-white">{survey.questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white-plum/70">Start Date</span>
                <span className="text-white">{format(new Date(survey.start_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white-plum/70">End Date</span>
                <span className="text-white">{format(new Date(survey.end_date), 'MMM dd, yyyy')}</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-white-plum/70">{daysLeft} days remaining</span>
                <span className="text-sm text-gold">{Math.min(100, Math.max(0, (daysLeft / 30) * 100)).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-jet-black rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, Math.max(0, (daysLeft / 30) * 100))}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {isResponseFormOpen && (
        <SurveyResponseForm
          survey={survey}
          onSubmit={handleSubmitResponse}
          onClose={() => setIsResponseFormOpen(false)}
        />
      )}
    </>
  );
};

export default EnhancedSurveyCard;
