import type { Metadata } from 'next';
import Link from 'next/link';
import { QuizList } from '@/components/QuizList';

export const metadata: Metadata = {
  title: 'All quizzes — Quiz Builder',
};

export default function QuizzesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-semibold">All quizzes</h1>
          <p className="mt-1 text-[15px] text-muted">
            Open a quiz to see its questions, or delete one you no longer need.
          </p>
        </div>
        <Link href="/create" className="btn-primary">
          Build a quiz
        </Link>
      </div>

      <QuizList />
    </div>
  );
}
