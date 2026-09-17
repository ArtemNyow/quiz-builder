'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { QuestionFields } from '@/components/QuestionFields';
import {
  createEmptyQuestion,
  quizFormSchema,
  toCreateQuizPayload,
  type QuizFormValues,
} from '@/lib/quiz-form';
import { quizzesApi } from '@/services/api';

export function QuizForm() {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<QuizFormValues>({
    resolver: zodResolver(quizFormSchema),
    defaultValues: {
      title: '',
      questions: [createEmptyQuestion('BOOLEAN')],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'questions' });
  const questions = watch('questions');

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);

    try {
      const quiz = await quizzesApi.create(toCreateQuizPayload(values));
      router.push(`/quizzes/${quiz.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'Something went wrong. Try again.',
      );
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      <div className="panel p-4 sm:p-5">
        <label className="mb-1 block text-sm text-muted" htmlFor="quiz-title">
          Quiz title
        </label>
        <input
          id="quiz-title"
          type="text"
          className="field"
          placeholder="e.g. JavaScript basics"
          {...register('title')}
        />
        {errors.title ? <p className="error-text">{errors.title.message}</p> : null}
      </div>

      <ul className="space-y-4">
        {fields.map((field, index) => (
          <QuestionFields
            key={field.id}
            index={index}
            type={questions?.[index]?.type ?? 'BOOLEAN'}
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            onRemove={() => remove(index)}
            canRemove={fields.length > 1}
          />
        ))}
      </ul>

      {errors.questions?.root ? (
        <p className="error-text">{errors.questions.root.message}</p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => append(createEmptyQuestion('BOOLEAN'))}
          className="btn-secondary"
        >
          <Plus size={16} aria-hidden />
          Add question
        </button>

        <button type="submit" disabled={isSubmitting} className="btn-primary">
          {isSubmitting ? 'Saving…' : 'Save quiz'}
        </button>
      </div>

      {submitError ? (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {submitError}
        </p>
      ) : null}
    </form>
  );
}
