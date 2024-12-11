export interface Question {
  id: string;
  type: 'text' | 'rating' | 'multiple_choice';
  question: string;
  options?: string[];
  required?: boolean;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  created_at: string;
  updated_at: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  survey_type: string;
}

export interface Response {
  id: string;
  survey: string;
  answers: {
    question: string;
    answer: string;
  }[];
  created_at: string;
  updated_at: string;
  user?: string;
}
