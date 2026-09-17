import type { Option, Question, Quiz } from '@prisma/client';
import type { QuestionType } from './quiz.schema.js';

type QuestionWithOptions = Question & { options: Option[] };
type QuizWithQuestions = Quiz & { questions: QuestionWithOptions[] };

export interface QuizSummaryDto {
  id: string;
  title: string;
  questionCount: number;
  createdAt: string;
}

export interface QuestionDto {
  id: string;
  type: QuestionType;
  text: string;
  position: number;
  correctAnswer?: boolean | string;
  options?: { id: string; text: string; isCorrect: boolean }[];
}

export interface QuizDto {
  id: string;
  title: string;
  createdAt: string;
  questions: QuestionDto[];
}

function toQuestionDto(question: QuestionWithOptions): QuestionDto {
  const base = {
    id: question.id,
    type: question.type as QuestionType,
    text: question.text,
    position: question.position,
  };

  if (question.type === 'BOOLEAN') {
    return { ...base, correctAnswer: question.correctBoolean ?? false };
  }

  if (question.type === 'INPUT') {
    return { ...base, correctAnswer: question.correctText ?? '' };
  }

  return {
    ...base,
    options: [...question.options]
      .sort((a, b) => a.position - b.position)
      .map((option) => ({
        id: option.id,
        text: option.text,
        isCorrect: option.isCorrect,
      })),
  };
}

export function toQuizDto(quiz: QuizWithQuestions): QuizDto {
  return {
    id: quiz.id,
    title: quiz.title,
    createdAt: quiz.createdAt.toISOString(),
    questions: [...quiz.questions]
      .sort((a, b) => a.position - b.position)
      .map(toQuestionDto),
  };
}

export function toQuizSummaryDto(
  quiz: Quiz & { _count: { questions: number } },
): QuizSummaryDto {
  return {
    id: quiz.id,
    title: quiz.title,
    questionCount: quiz._count.questions,
    createdAt: quiz.createdAt.toISOString(),
  };
}
