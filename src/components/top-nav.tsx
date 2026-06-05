import Link from 'next/link';
import { ThiranLogo } from '@/components/ThiranLogo';
import { SignInButton } from '@/components/SignInButton';

const links = [
  ['/learn', 'Study Guide'],
  ['/practice', 'Practice'],
  ['/samples', 'Scenarios'],
  ['/progress', 'Progress'],
  ['/resources', 'Resources'],
  ['/roadmap', 'Cert Roadmap'],
  ['/cheatsheet', 'Cheat Sheet'],
  ['/exam-strategy', 'Exam Tips'],
];

export function TopNav() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-wide text-sky-300">
          SAA-C03 Learning Portal
        </Link>
        <nav className="flex flex-wrap gap-2 text-sm">
          {links.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded-full border border-slate-700 px-3 py-1 text-slate-300 hover:border-sky-500 hover:text-sky-200"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/lastminute"
            className="rounded-full border border-rose-800/50 px-3 py-1 text-rose-400 hover:border-rose-500 hover:text-rose-300"
          >
            Last Minute
          </Link>
          <Link
            href="https://thiran.cloud"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full border border-indigo-700 px-3 py-1 transition hover:border-indigo-500"
          >
            <ThiranLogo variant="mark" className="h-3.5 w-auto" />
            <span className="bg-gradient-to-r from-indigo-300 to-sky-300 bg-clip-text text-sm font-semibold text-transparent">
              Thiran
            </span>
          </Link>
          <SignInButton />
        </nav>
      </div>
    </header>
  );
}
