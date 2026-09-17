'use client';

import { Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { quizzesApi } from '@/services/api';
import type { QuizSummary } from '@/types/quiz';

export function QuizList() {
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      setQuizzes(await quizzesApi.list());
      setStatus('ready');
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : 'Could not load quizzes.',
      );
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const handleDelete = async (quiz: QuizSummary) => {
    const confirmed = window.confirm(`Delete "${quiz.title}"? This can't be undone.`);
    if (!confirmed) return;

    setDeletingId(quiz.id);
    setError(null);

    try {
      await quizzesApi.remove(quiz.id);
      setQuizzes((current) => current.filter((item) => item.id !== quiz.id));
    } catch (deleteError) {
      setError(
        deleteError instanceof Error ? deleteError.message : 'Could not delete the quiz.',
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (status === 'loading') {
    return (
      <p className="flex items-center gap-2 text-sm text-muted">
        <Loader2 size={16} className="animate-spin" aria-hidden />
        Loading quizzes…
      </p>
    );
  }

  if (status === 'error') {
    return (
      <div className="panel p-5">
        <p className="text-[15px] text-danger">{error}</p>
        <button type="button" onClick={() => void load()} className="btn-secondary mt-3">
          Try again
        </button>
      </div>
    );
  }

  if (quizzes.length === 0) {
    return (
      <div className="panel p-6 text-center">
        <p className="font-serif text-lg">No quizzes yet</p>
        <p className="mx-auto mt-1 max-w-[46ch] text-[15px] text-muted">
          Build your first one and it will show up here.
        </p>
        <Link href="/create" className="btn-primary mt-4">
          Build a quiz
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error ? (
        <p role="alert" className="rounded-md bg-danger/10 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      ) : null}

      <ul className="space-y-2">
        {quizzes.map((quiz) => (
          <li key={quiz.id} className="panel flex items-center gap-2 p-1 pr-2">
            <Link
              href={`/quizzes/${quiz.id}`}
              className="flex-1 rounded-md px-3 py-3 transition-colors hover:bg-accent-soft/60"
            >
              <span className="block font-medium">{quiz.title}</span>
              <span className="mt-0.5 block text-sm text-muted">
                {quiz.questionCount} {quiz.questionCount === 1 ? 'question' : 'questions'}
              </span>
            </Link>

            <button
              type="button"
              onClick={() => void handleDelete(quiz)}
              disabled={deletingId === quiz.id}
              className="rounded-md p-2 text-muted transition-colors hover:text-danger disabled:opacity-50"
              title={`Delete ${quiz.title}`}
            >
              {deletingId === quiz.id ? (
                <Loader2 size={18} className="animate-spin" aria-hidden />
              ) : (
                <Trash2 size={18} aria-hidden />
              )}
              <span className="sr-only">Delete {quiz.title}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
