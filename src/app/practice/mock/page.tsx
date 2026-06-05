import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

const MOCKS = [
  {
    id: 'mock-1',
    title: 'Mock Exam 1',
    badge: 'Medium',
    badgeClass: 'bg-sky-900/60 text-sky-300',
    desc: 'Balanced coverage across all domains',
  },
  {
    id: 'mock-2',
    title: 'Mock Exam 2',
    badge: 'Medium',
    badgeClass: 'bg-sky-900/60 text-sky-300',
    desc: 'Emphasis on core service knowledge',
  },
  {
    id: 'mock-3',
    title: 'Mock Exam 3',
    badge: 'Hard',
    badgeClass: 'bg-amber-900/60 text-amber-300',
    desc: 'Scenario-heavy with tricky distractors',
    accent: true,
  },
];

export default function MockListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mock Exams</h1>
        <p className="mt-2 text-slate-300">
          Full-length timed mocks modelled on SAA-C03 format.
          Each mock draws proportionally from all domains.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {MOCKS.map((m) => (
          <Link
            key={m.id}
            href={`/practice/mock/${m.id}`}
            className={`card group flex items-center gap-4 p-5 transition hover:border-slate-500 ${
              m.accent ? 'border-rose-800/60 hover:border-rose-600' : ''
            }`}
          >
            <div className="flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-100">{m.title}</p>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${m.badgeClass}`}>
                  {m.badge}
                </span>
              </div>
              <p className="text-sm text-slate-400">{m.desc}</p>
            </div>
            <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 transition group-hover:text-slate-300" />
          </Link>
        ))}
      </div>

      <Link href="/practice" className="text-sm text-sky-400 hover:underline">← Back to Practice</Link>
    </div>
  );
}
