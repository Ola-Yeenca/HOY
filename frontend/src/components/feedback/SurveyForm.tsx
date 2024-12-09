'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import { HiOutlineEmojiHappy, HiOutlineEmojiSad } from 'react-icons/hi';

interface Question {
  id: string;
  type: 'rating' | 'text' | 'choice' | 'emoji' | 'thumbs';
  question: string;
  options?: string[];
  required?: boolean;
}

interface SurveyFormProps {
  questions: Question[];
  onSubmit: (responses: Record<string, any>) => void;
}

export const SurveyForm = ({ questions, onSubmit }: SurveyFormProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleResponse = (questionId: string, response: any) => {
    setResponses((prev) => ({ ...prev, [questionId]: response }));
    if (currentQuestion < questions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 500);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(responses);
    setIsSubmitting(false);
  };

  const questionVariants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case 'rating':
        return (
          <div className="flex flex-col items-center space-y-4">
            <motion.div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <motion.button
                  key={rating}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleResponse(question.id, rating)}
                  className={`p-2 rounded-full ${
                    responses[question.id] === rating
                      ? 'text-gold'
                      : 'text-gray-400 hover:text-gold'
                  }`}
                >
                  <FaStar className="w-8 h-8" />
                </motion.button>
              ))}
            </motion.div>
            <p className="text-sm text-gray-400">Click to rate</p>
          </div>
        );

      case 'emoji':
        return (
          <div className="flex justify-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleResponse(question.id, 'happy')}
              className={`p-4 rounded-full ${
                responses[question.id] === 'happy'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-black/20 text-gray-400 hover:text-green-400'
              }`}
            >
              <HiOutlineEmojiHappy className="w-12 h-12" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleResponse(question.id, 'sad')}
              className={`p-4 rounded-full ${
                responses[question.id] === 'sad'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-black/20 text-gray-400 hover:text-red-400'
              }`}
            >
              <HiOutlineEmojiSad className="w-12 h-12" />
            </motion.button>
          </div>
        );

      case 'thumbs':
        return (
          <div className="flex justify-center space-x-8">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleResponse(question.id, 'up')}
              className={`p-4 rounded-full ${
                responses[question.id] === 'up'
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-black/20 text-gray-400 hover:text-green-400'
              }`}
            >
              <FaThumbsUp className="w-8 h-8" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleResponse(question.id, 'down')}
              className={`p-4 rounded-full ${
                responses[question.id] === 'down'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-black/20 text-gray-400 hover:text-red-400'
              }`}
            >
              <FaThumbsDown className="w-8 h-8" />
            </motion.button>
          </div>
        );

      case 'text':
        return (
          <motion.textarea
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full p-4 bg-black/30 rounded-lg border border-white/10 text-white placeholder-gray-500 focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
            rows={4}
            placeholder="Share your thoughts..."
            value={responses[question.id] || ''}
            onChange={(e) => handleResponse(question.id, e.target.value)}
          />
        );

      case 'choice':
        return (
          <div className="grid grid-cols-1 gap-3 w-full max-w-md mx-auto">
            {question.options?.map((option, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleResponse(question.id, option)}
                className={`p-4 rounded-lg border ${
                  responses[question.id] === option
                    ? 'bg-gold/20 border-gold text-gold'
                    : 'bg-black/30 border-white/10 text-white hover:border-gold/50'
                } transition-colors duration-200`}
              >
                {option}
              </motion.button>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="h-2 flex-1 mx-4 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gold"
              initial={{ width: '0%' }}
              animate={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          variants={questionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {questions[currentQuestion].question}
          </h2>
          {renderQuestion(questions[currentQuestion])}
        </motion.div>
      </AnimatePresence>

      {currentQuestion === questions.length - 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-8 py-3 bg-gold text-black rounded-lg font-semibold disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};
