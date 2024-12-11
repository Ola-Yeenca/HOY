import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Survey, Question } from '@/types/survey';

interface SurveyResponseFormProps {
  survey: Survey;
  onSubmit: (responses: SurveyResponse) => void;
  onClose: () => void;
}

export interface QuestionResponse {
  questionId: string;
  response: string | string[];
}

export interface SurveyResponse {
  surveyId: string;
  responses: QuestionResponse[];
}

const SurveyResponseForm: React.FC<SurveyResponseFormProps> = ({ survey, onSubmit, onClose }) => {
  const [responses, setResponses] = useState<QuestionResponse[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const handleResponse = (questionId: string, response: string | string[]) => {
    setResponses(prev => {
      const existingIndex = prev.findIndex(r => r.questionId === questionId);
      if (existingIndex >= 0) {
        const newResponses = [...prev];
        newResponses[existingIndex] = { questionId, response };
        return newResponses;
      }
      return [...prev, { questionId, response }];
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit({
      surveyId: survey.id,
      responses
    });
  };

  const renderQuestionInput = (question: Question) => {
    const response = responses.find(r => r.questionId === question.id);

    switch (question.type) {
      case 'rating':
        return (
          <div className="flex justify-center space-x-4">
            {question.options?.map((option) => (
              <button
                key={option}
                onClick={() => handleResponse(question.id, option)}
                className={`w-12 h-12 rounded-full ${
                  response?.response === option
                    ? 'bg-gold text-jet-black'
                    : 'bg-jet-black text-white-plum hover:bg-gold/20'
                } transition-colors`}
              >
                {option}
              </button>
            ))}
          </div>
        );

      case 'multiple_choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option) => {
              const isSelected = Array.isArray(response?.response) && response.response.includes(option);
              return (
                <button
                  key={option}
                  onClick={() => {
                    const currentResponses = (response?.response as string[]) || [];
                    const newResponses = isSelected
                      ? currentResponses.filter(r => r !== option)
                      : [...currentResponses, option];
                    handleResponse(question.id, newResponses);
                  }}
                  className={`w-full p-3 rounded-lg text-left ${
                    isSelected
                      ? 'bg-gold text-jet-black'
                      : 'bg-jet-black text-white-plum hover:bg-gold/20'
                  } transition-colors`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        );

      case 'text':
        return (
          <textarea
            value={response?.response as string || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
            className="w-full h-32 p-3 rounded-lg bg-jet-black text-white-plum border border-gold/20 focus:border-gold/50 focus:outline-none resize-none"
            placeholder="Type your answer here..."
          />
        );

      default:
        return null;
    }
  };

  const currentQuestion = survey.questions[currentQuestionIndex];
  const currentResponse = responses.find(r => r.questionId === currentQuestion.id);
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const isResponseValid = currentResponse && (
    typeof currentResponse.response === 'string' || 
    (Array.isArray(currentResponse.response) && currentResponse.response.length > 0)
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-coffee-bean rounded-xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white-plum hover:text-gold transition-colors"
        >
          ×
        </button>

        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">{survey.title}</h2>
          <p className="text-white-plum">{survey.description}</p>
        </div>

        <div className="space-y-6">
          <div className="text-center mb-4">
            <span className="text-white-plum">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </span>
          </div>

          <div className="bg-jet-black rounded-lg p-6">
            <h3 className="text-xl text-white mb-6">{currentQuestion.question}</h3>
            {renderQuestionInput(currentQuestion)}
          </div>

          <div className="flex justify-between pt-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg transition-colors ${
                currentQuestionIndex === 0
                  ? 'bg-jet-black text-white-plum/50 cursor-not-allowed'
                  : 'bg-jet-black text-white-plum hover:bg-gold/20'
              }`}
            >
              Previous
            </button>

            {isLastQuestion ? (
              <button
                onClick={handleSubmit}
                disabled={!isResponseValid}
                className={`px-6 py-2 rounded-lg ${
                  isResponseValid
                    ? 'bg-gold text-jet-black hover:bg-gold/90'
                    : 'bg-jet-black text-white-plum/50 cursor-not-allowed'
                } transition-colors`}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={handleNext}
                disabled={!isResponseValid}
                className={`px-6 py-2 rounded-lg ${
                  isResponseValid
                    ? 'bg-gold text-jet-black hover:bg-gold/90'
                    : 'bg-jet-black text-white-plum/50 cursor-not-allowed'
                } transition-colors`}
              >
                Next
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SurveyResponseForm;
