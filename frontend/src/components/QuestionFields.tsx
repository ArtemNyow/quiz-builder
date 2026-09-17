'use client';

import { Trash2 } from 'lucide-react';
import type {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import { CheckboxOptions } from '@/components/CheckboxOptions';
import type { QuizFormValues } from '@/lib/quiz-form';
import { QUESTION_TYPES, QUESTION_TYPE_LABELS, type QuestionType } from '@/types/quiz';

interface QuestionFieldsProps {
  index: number;
  type: QuestionType;
  control: Control<QuizFormValues>;
  register: UseFormRegister<QuizFormValues>;
  setValue: UseFormSetValue<QuizFormValues>;
  errors: FieldErrors<QuizFormValues>;
  onRemove: () => void;
  canRemove: boolean;
}

export function QuestionFields({
  index,
  type,
  control,
  register,
  setValue,
  errors,
  onRemove,
  canRemove,
}: QuestionFieldsProps) {
  const questionErrors = errors.questions?.[index];

  const handleTypeChange = (nextType: QuestionType) => {
    setValue(`questions.${index}.type`, nextType, { shouldValidate: false });

    if (nextType === 'CHECKBOX') {
      setValue(`questions.${index}.options`, [
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ]);
    } else {
      setValue(`questions.${index}.options`, []);
    }
  };

  return (
    <li className="panel p-4 sm:p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="font-serif text-base font-semibold">Question {index + 1}</h3>
        <button
          type="button"
          onClick={onRemove}
          disabled={!canRemove}
          className="rounded-md p-2 text-muted transition-colors hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
          title={canRemove ? 'Remove question' : 'A quiz keeps at least one question'}
        >
          <Trash2 size={17} aria-hidden />
          <span className="sr-only">Remove question {index + 1}</span>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label
            className="mb-1 block text-sm text-muted"
            htmlFor={`question-${index}-type`}
          >
            Answer format
          </label>
          <select
            id={`question-${index}-type`}
            className="field"
            value={type}
            onChange={(event) => handleTypeChange(event.target.value as QuestionType)}
          >
            {QUESTION_TYPES.map((questionType) => (
              <option key={questionType} value={questionType}>
                {QUESTION_TYPE_LABELS[questionType]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="mb-1 block text-sm text-muted"
            htmlFor={`question-${index}-text`}
          >
            Question
          </label>
          <input
            id={`question-${index}-text`}
            type="text"
            className="field"
            placeholder="What do you want to ask?"
            {...register(`questions.${index}.text`)}
          />
          {questionErrors?.text ? (
            <p className="error-text">{questionErrors.text.message}</p>
          ) : null}
        </div>

        {type === 'BOOLEAN' ? (
          <fieldset>
            <legend className="mb-2 text-sm text-muted">Expected answer</legend>
            <div className="flex gap-4">
              {(['true', 'false'] as const).map((value) => (
                <label key={value} className="flex items-center gap-2 text-[15px]">
                  <input
                    type="radio"
                    value={value}
                    className="h-4 w-4 accent-accent"
                    {...register(`questions.${index}.correctBoolean`)}
                  />
                  {value === 'true' ? 'True' : 'False'}
                </label>
              ))}
            </div>
            {questionErrors?.correctBoolean ? (
              <p className="error-text">{questionErrors.correctBoolean.message}</p>
            ) : null}
          </fieldset>
        ) : null}

        {type === 'INPUT' ? (
          <div>
            <label
              className="mb-1 block text-sm text-muted"
              htmlFor={`question-${index}-answer`}
            >
              Expected answer
            </label>
            <input
              id={`question-${index}-answer`}
              type="text"
              className="field"
              placeholder="Short text answer"
              {...register(`questions.${index}.correctText`)}
            />
            {questionErrors?.correctText ? (
              <p className="error-text">{questionErrors.correctText.message}</p>
            ) : null}
          </div>
        ) : null}

        {type === 'CHECKBOX' ? (
          <CheckboxOptions
            control={control}
            register={register}
            questionIndex={index}
            error={
              questionErrors?.options?.message ??
              (questionErrors?.options as { root?: { message?: string } } | undefined)
                ?.root?.message
            }
            optionErrors={
              Array.isArray(questionErrors?.options)
                ? questionErrors.options.map((optionError) => optionError?.text?.message)
                : undefined
            }
          />
        ) : null}
      </div>
    </li>
  );
}
