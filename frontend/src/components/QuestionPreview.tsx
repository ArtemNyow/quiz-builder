import { Check } from 'lucide-react';
import type { Question } from '@/types/quiz';
import { QUESTION_TYPE_LABELS } from '@/types/quiz';

/** Read-only rendering of a question — structure only, nothing is answerable. */
export function QuestionPreview({
  question,
  index,
}: {
  question: Question;
  index: number;
}) {
  return (
    <li className="panel p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-serif text-base font-semibold">
          {index + 1}. {question.text}
        </h2>
        <span className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs text-accent-strong">
          {QUESTION_TYPE_LABELS[question.type]}
        </span>
      </div>

      <div className="mt-3 text-[15px]">
        {question.type === 'BOOLEAN' ? (
          <ul className="space-y-1.5">
            {[true, false].map((value) => (
              <li key={String(value)} className="flex items-center gap-2">
                <input
                  type="radio"
                  disabled
                  checked={question.correctAnswer === value}
                  readOnly
                />
                <span
                  className={
                    question.correctAnswer === value
                      ? 'font-medium text-accent-strong'
                      : ''
                  }
                >
                  {value ? 'True' : 'False'}
                </span>
              </li>
            ))}
          </ul>
        ) : null}

        {question.type === 'INPUT' ? (
          <p className="text-muted">
            Expected answer:{' '}
            <span className="font-medium text-ink">
              {String(question.correctAnswer ?? '')}
            </span>
          </p>
        ) : null}

        {question.type === 'CHECKBOX' ? (
          <ul className="space-y-1.5">
            {question.options?.map((option) => (
              <li key={option.id} className="flex items-center gap-2">
                <input type="checkbox" disabled checked={option.isCorrect} readOnly />
                <span
                  className={option.isCorrect ? 'font-medium text-accent-strong' : ''}
                >
                  {option.text}
                </span>
                {option.isCorrect ? (
                  <Check size={14} className="text-accent" aria-label="Correct option" />
                ) : null}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </li>
  );
}
