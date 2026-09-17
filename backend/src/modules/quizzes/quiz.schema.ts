import { z } from 'zod';

export const QUESTION_TYPES = ['BOOLEAN', 'INPUT', 'CHECKBOX'] as const;
export type QuestionType = (typeof QUESTION_TYPES)[number];

const questionText = z.string().trim().min(1, 'Question text is required').max(500);

/** True/False question — the answer is a single boolean. */
const booleanQuestionSchema = z.object({
  type: z.literal('BOOLEAN'),
  text: questionText,
  correctAnswer: z.boolean({
    required_error: 'Pick True or False as the expected answer',
  }),
});

/** Short text question — the answer is a string. */
const inputQuestionSchema = z.object({
  type: z.literal('INPUT'),
  text: questionText,
  correctAnswer: z.string().trim().min(1, 'An expected answer is required').max(500),
});

/** Multiple choice — two or more options, at least one marked correct. */
const checkboxQuestionSchema = z.object({
  type: z.literal('CHECKBOX'),
  text: questionText,
  options: z
    .array(
      z.object({
        text: z.string().trim().min(1, 'Option text is required').max(300),
        isCorrect: z.boolean().default(false),
      }),
    )
    .min(2, 'Add at least two options')
    .max(10, 'A question can hold at most ten options')
    .refine((options) => options.some((option) => option.isCorrect), {
      message: 'Mark at least one option as correct',
    }),
});

export const questionSchema = z.discriminatedUnion('type', [
  booleanQuestionSchema,
  inputQuestionSchema,
  checkboxQuestionSchema,
]);

export const createQuizSchema = z.object({
  title: z.string().trim().min(1, 'Quiz title is required').max(200),
  questions: z
    .array(questionSchema)
    .min(1, 'A quiz needs at least one question')
    .max(50, 'A quiz can hold at most fifty questions'),
});

export const quizIdSchema = z.object({
  id: z.string().min(1, 'Quiz id is required'),
});

export type CreateQuizInput = z.infer<typeof createQuizSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
