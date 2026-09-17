import type { Metadata } from 'next';
import { QuizForm } from '@/components/QuizForm';

export const metadata: Metadata = {
  title: 'Build a quiz — Quiz Builder',
};

export default function CreateQuizPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Build a quiz</h1>
        <p className="mt-1 max-w-[62ch] text-[15px] text-muted">
          Name the quiz, then add as many questions as you need. Each question can be true
          or false, a short written answer, or multiple choice with several correct
          options.
        </p>
      </div>

      <QuizForm />
    </div>
  );
}
