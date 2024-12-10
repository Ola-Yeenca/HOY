export interface Question {
  id: string;
  type: 'rating' | 'text' | 'multiple_choice';
  text: string;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  survey_type: string;
  start_date: string;
  end_date: string;
  questions: Question[];
}

export interface SurveyResponse {
  survey_id: string;
  responses: {
    question_id: string;
    answer: string | number;  // Can be string for text/multiple choice or number for rating
  }[];
  submitted_at?: string;  // Optional timestamp
}
