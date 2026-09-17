import { z } from 'zod';
import type { CreateQuizPayload, QuestionType } from '@/types/quiz';

/**
 * Form-level schema. Radio inputs hand back strings, so the boolean answer is
 * kept as `'true' | 'false'` here and converted when the payload is built.
 */
const optionSchema = z.object({
  text: z.string().trim().min(1, 'Add some text or remove this option'),
  isCorrect: z.boolean(),
});

const questionSchema = z
  .object({
    type: z.enum(['BOOLEAN', 'INPUT', 'CHECKBOX']),
    text: z.string().trim().min(1, 'Write the question'),
    correctBoolean: z.union([z.literal('true'), z.literal('false'), z.literal('')]),
    correctText: z.string(),
    options: z.array(optionSchema),
  })
  .superRefine((question, ctx) => {
    if (question.type === 'BOOLEAN' && question.correctBoolean === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctBoolean'],
        message: 'Pick true or false',
      });
    }

    if (question.type === 'INPUT' && question.correctText.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['correctText'],
        message: 'Write the expected answer',
      });
    }

    if (question.type === 'CHECKBOX') {
      if (question.options.length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Add at least two options',
        });
      }

      if (!question.options.some((option) => option.isCorrect)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['options'],
          message: 'Tick at least one correct option',
        });
      }
    }
  });

export const quizFormSchema = z.object({
  title: z.string().trim().min(1, 'Name the quiz'),
  questions: z.array(questionSchema).min(1, 'Add at least one question'),
});

export type QuizFormValues = z.infer<typeof quizFormSchema>;
export type QuestionFormValues = QuizFormValues['questions'][number];

export function createEmptyQuestion(type: QuestionType = 'BOOLEAN'): QuestionFormValues {
  return {
    type,
    text: '',
    correctBoolean: '',
    correctText: '',
    options:
      type === 'CHECKBOX'
        ? [
            { text: '', isCorrect: false },
            { text: '', isCorrect: false },
          ]
        : [],
  };
}

/** Strips the fields that don't belong to the chosen question type. */
export function toCreateQuizPayload(values: QuizFormValues): CreateQuizPayload {
  return {
    title: values.title.trim(),
    questions: values.questions.map((question) => {
      const text = question.text.trim();

      if (question.type === 'BOOLEAN') {
        return {
          type: 'BOOLEAN',
          text,
          correctAnswer: question.correctBoolean === 'true',
        };
      }

      if (question.type === 'INPUT') {
        return { type: 'INPUT', text, correctAnswer: question.correctText.trim() };
      }

      return {
        type: 'CHECKBOX',
        text,
        options: question.options.map((option) => ({
          text: option.text.trim(),
          isCorrect: option.isCorrect,
        })),
      };
    }),
  };
}
