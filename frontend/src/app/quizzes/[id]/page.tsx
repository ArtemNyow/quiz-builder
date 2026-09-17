import type { Metadata } from 'next';
import { QuizDetail } from '@/components/QuizDetail';

export const metadata: Metadata = {
  title: 'Quiz — Quiz Builder',
};

export default async function QuizDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <QuizDetail quizId={id} />;
}
