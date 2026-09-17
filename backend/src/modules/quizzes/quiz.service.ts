import type { Prisma } from '@prisma/client';
import { prisma } from '../../prisma.js';
import { notFound } from '../../middleware/http-error.js';
import {
  toQuizDto,
  toQuizSummaryDto,
  type QuizDto,
  type QuizSummaryDto,
} from './quiz.mapper.js';
import type { CreateQuizInput, QuestionInput } from './quiz.schema.js';

function toQuestionCreateInput(
  question: QuestionInput,
  position: number,
): Prisma.QuestionCreateWithoutQuizInput {
  const base = { type: question.type, text: question.text, position };

  switch (question.type) {
    case 'BOOLEAN':
      return { ...base, correctBoolean: question.correctAnswer };
    case 'INPUT':
      return { ...base, correctText: question.correctAnswer };
    case 'CHECKBOX':
      return {
        ...base,
        options: {
          create: question.options.map((option, index) => ({
            text: option.text,
            isCorrect: option.isCorrect,
            position: index,
          })),
        },
      };
  }
}

export const quizService = {
  /** Creates a quiz together with its questions and options in a single transaction. */
  async create(input: CreateQuizInput): Promise<QuizDto> {
    const quiz = await prisma.quiz.create({
      data: {
        title: input.title,
        questions: {
          create: input.questions.map(toQuestionCreateInput),
        },
      },
      include: { questions: { include: { options: true } } },
    });

    return toQuizDto(quiz);
  },

  /** Lists every quiz with its question count, newest first. */
  async list(): Promise<QuizSummaryDto[]> {
    const quizzes = await prisma.quiz.findMany({
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { questions: true } } },
    });

    return quizzes.map(toQuizSummaryDto);
  },

  /** Returns a single quiz with all questions and options. */
  async findById(id: string): Promise<QuizDto> {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });

    if (!quiz) {
      throw notFound(`Quiz ${id} not found`);
    }

    return toQuizDto(quiz);
  },

  /** Deletes a quiz; questions and options are removed by cascade. */
  async remove(id: string): Promise<void> {
    const quiz = await prisma.quiz.findUnique({ where: { id }, select: { id: true } });

    if (!quiz) {
      throw notFound(`Quiz ${id} not found`);
    }

    await prisma.quiz.delete({ where: { id } });
  },
};
