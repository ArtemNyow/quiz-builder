export const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  BOOLEAN: 'True or false',
  INPUT: 'Short answer',
  CHECKBOX: 'Multiple choice',
};

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  position: number;
  correctAnswer?: boolean | string;
  options?: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  createdAt: string;
  questions: Question[];
}

export interface QuizSummary {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

/** Shape sent to `POST /quizzes`. */
export type CreateQuestionPayload =
  | { type: 'BOOLEAN'; text: string; correctAnswer: boolean }
  | { type: 'INPUT'; text: string; correctAnswer: string }
  | { type: 'CHECKBOX'; text: string; options: { text: string; isCorrect: boolean }[] };

export interface CreateQuizPayload {
  title: string;
  questions: CreateQuestionPayload[];
}
