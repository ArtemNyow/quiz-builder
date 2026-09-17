'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/quizzes', label: 'All quizzes' },
  { href: '/create', label: 'Build a quiz' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="border-b border-line bg-card">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link href="/quizzes" className="font-serif text-lg font-semibold text-ink">
          Quiz Builder
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          {links.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-md px-3 py-1.5 transition-colors ${
                  active
                    ? 'bg-accent-soft font-medium text-accent-strong'
                    : 'text-muted hover:text-ink'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
