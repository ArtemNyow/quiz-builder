import type { Metadata } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import { Header } from '@/components/Header';
import './globals.css';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
});

const serif = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'Quiz Builder',
  description:
    'Build quizzes from true/false, short answer and multiple choice questions.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen font-sans">
        <Header />
        <main className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6">
          {children}
        </main>
      </body>
    </html>
  );
}
