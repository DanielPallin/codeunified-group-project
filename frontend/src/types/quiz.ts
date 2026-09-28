type QuizOption = {
  quiz_option_id: string;
  option_text: string;
};

type QuizQuestion = {
  quiz_question_id: string;
  question_text: string;
  question_type: string;
  sequence_order: number;
  options: QuizOption[];
};

export type Quiz = {
  quiz_id: string;
  quiz_title: string;
  passing_score_percentage: number;
  access_level: number;
  question_count: number;
  questions: QuizQuestion[];
};