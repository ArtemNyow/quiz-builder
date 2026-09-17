'use client';

import { Plus, X } from 'lucide-react';
import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form';
import type { QuizFormValues } from '@/lib/quiz-form';

interface CheckboxOptionsProps {
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  questionIndex: number;
  error?: string;
  optionErrors?: (string | undefined)[];
}

export function CheckboxOptions({
  control,
  register,
  questionIndex,
  error,
  optionErrors,
}: CheckboxOptionsProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm text-muted">
        Options — tick every answer that counts as correct.
      </legend>

      {fields.map((field, optionIndex) => (
        <div key={field.id} className="space-y-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              aria-label={`Option ${optionIndex + 1} is correct`}
              className="h-4 w-4 shrink-0 accent-accent"
              {...register(`questions.${questionIndex}.options.${optionIndex}.isCorrect`)}
            />
            <input
              type="text"
              className="field"
              placeholder={`Option ${optionIndex + 1}`}
              aria-label={`Option ${optionIndex + 1} text`}
              {...register(`questions.${questionIndex}.options.${optionIndex}.text`)}
            />
            <button
              type="button"
              onClick={() => remove(optionIndex)}
              disabled={fields.length <= 2}
              title={
                fields.length <= 2
                  ? 'A question keeps at least two options'
                  : 'Remove option'
              }
              className="rounded-md p-2 text-muted transition-colors hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            >
              <X size={16} aria-hidden />
              <span className="sr-only">Remove option {optionIndex + 1}</span>
            </button>
          </div>
          {optionErrors?.[optionIndex] ? (
            <p className="error-text pl-6">{optionErrors[optionIndex]}</p>
          ) : null}
        </div>
      ))}

      {error ? <p className="error-text">{error}</p> : null}

      <button
        type="button"
        onClick={() => append({ text: '', isCorrect: false })}
        className="btn-secondary mt-1 px-3 py-1.5 text-sm"
      >
        <Plus size={15} aria-hidden />
        Add option
      </button>
    </fieldset>
  );
}
