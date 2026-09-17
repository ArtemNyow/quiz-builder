'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { QuestionPreview } from '@/components/QuestionPreview';
import { quizzesApi } from '@/services/api';
import type { Quiz } from '@/types/quiz';

export function QuizDetail({ quizId }: { quizId: string }) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setQuiz(await quizzesApi.detail(quizId));
      setStatus('ready');
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Could not load this quiz.',
      );
      setStatus('error');
    }
  }, [quizId]);

  useEffect(() => {
    void load();
  }, [load]);

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" aria-hidden />
        Loading quiz…
      </p>
    );
  }

  if (status === 'error' || !quiz) {
    return (
      <div className="panel p-5">
        <p className="text-[15px] text-danger">{error}</p>
        <div className="mt-3 flex gap-2">
          <button type="button" onClick={() => void load()} className="btn-secondary">
            Try again
          </button>
          <Link href="/quizzes" className="btn-secondary">
            Back to all quizzes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="space-y-6">
      <div>
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
        >
          <ArrowLeft size={15} aria-hidden />
          All quizzes
        </Link>
        <h1 className="mt-2 font-serif text-2xl font-semibold">{quiz.title}</h1>
        <p className="mt-1 text-[15px] text-muted">
          {quiz.questions.length} {quiz.questions.length === 1 ? 'question' : 'questions'}{' '}
          · added {new Date(quiz.createdAt).toLocaleDateString()}
        </p>
      </div>

      <ul className="space-y-3">
        {quiz.questions.map((question, index) => (
          <QuestionPreview key={question.id} question={question} index={index} />
        ))}
      </ul>
    </article>
  );
}
