export interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  survey_type: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  questions: Question[];
}

export interface SurveyResponse {
  id: string;
  survey: string;
  user: string;
  answers: {
    question: string;
    answer: string;
  }[];
  submitted_at: string;
}

export interface SurveyStats {
  total_responses: number;
  completion_rate: number;
  average_rating: number;
  response_distribution: {
    [key: string]: number;
  };
}
