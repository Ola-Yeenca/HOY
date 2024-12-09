import { motion } from 'framer-motion';
import { FaClock, FaClipboardList, FaChartBar } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';

interface SurveyCardProps {
  survey: {
    id: string;
    title: string;
    description: string;
    survey_type: 'event' | 'music' | 'general' | 'experience';
    start_date: string;
    end_date: string;
    is_active: boolean;
    questions: Array<{
      id: string;
      type: string;
      question: string;
      options?: string[];
    }>;
  };
}

const surveyTypeIcons = {
  event: '🎉',
  music: '🎵',
  general: '📝',
  experience: '⭐',
};

const surveyTypeColors = {
  event: 'from-purple-500/20 to-purple-900/20',
  music: 'from-blue-500/20 to-blue-900/20',
  general: 'from-green-500/20 to-green-900/20',
  experience: 'from-amber-500/20 to-amber-900/20',
};

export const SurveyCard = ({ survey }: SurveyCardProps) => {
  const timeLeft = new Date(survey.end_date).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${surveyTypeColors[survey.survey_type]} border border-white/10 backdrop-blur-sm`}
    >
      {/* Status Badge */}
      {survey.is_active ? (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/50 text-green-400 text-xs font-medium">
          Active
        </div>
      ) : (
        <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50 text-red-400 text-xs font-medium">
          Inactive
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{surveyTypeIcons[survey.survey_type]}</span>
            <div>
              <h3 className="text-xl font-bold text-white">{survey.title}</h3>
              <p className="text-sm text-gray-400">{survey.survey_type.charAt(0).toUpperCase() + survey.survey_type.slice(1)} Survey</p>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 mb-6 line-clamp-2">{survey.description}</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 rounded-lg bg-black/30">
            <FaClipboardList className="text-gold mb-1" />
            <span className="text-sm text-gray-400">Questions</span>
            <span className="text-lg font-bold text-white">{survey.questions.length}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-black/30">
            <FaClock className="text-gold mb-1" />
            <span className="text-sm text-gray-400">Days Left</span>
            <span className="text-lg font-bold text-white">{daysLeft}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-lg bg-black/30">
            <FaChartBar className="text-gold mb-1" />
            <span className="text-sm text-gray-400">Completion</span>
            <span className="text-lg font-bold text-white">0%</span>
          </div>
        </div>

        {/* Dates */}
        <div className="flex justify-between text-sm text-gray-400 mb-6">
          <div>
            <p>Start: {format(new Date(survey.start_date), 'MMM d, yyyy')}</p>
          </div>
          <div>
            <p>End: {format(new Date(survey.end_date), 'MMM d, yyyy')}</p>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/feedback/surveys/${survey.id}`}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-3 px-4 bg-gold text-black rounded-lg font-semibold hover:bg-yellow-500 transition-colors duration-300"
          >
            Take Survey
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
};
