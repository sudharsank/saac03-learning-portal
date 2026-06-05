import Link from 'next/link';
import { ClipboardCheck, Timer, Layers, CreditCard, BarChart3, RotateCcw } from 'lucide-react';
import { DOMAINS, DOMAIN_LABELS, DOMAIN_SLUGS } from '@/lib/content-types';

const DOMAIN_COLORS = [
  'border-sky-700/60 bg-sky-950/20',
  'border-violet-700/60 bg-violet-950/20',
  'border-emerald-700/60 bg-emerald-950/20',
  'border-amber-700/60 bg-amber-950/20',
  'border-rose-700/60 bg-rose-950/20',
  'border-fuchsia-700/60 bg-fuchsia-950/20',
];

export default function PracticePage() {
  const drillItems = DOMAINS.map((d, i) => ({
    href: `/practice/drill/${DOMAIN_SLUGS[d]}`,
    title: `Domain ${d} Drill`,
    desc: DOMAIN_LABELS[d],
    color: DOMAIN_COLORS[i % DOMAIN_COLORS.length],
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Practice</h1>
        <p className="mt-2 text-slate-300">Drill by domain, run timed mocks, or work through scenario questions.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {drillItems.map(({ href, title, desc, color }) => (
          <Link key={href} href={href} className={`flex items-start gap-4 rounded-xl border p-5 transition hover:border-sky-500 ${color}`}>
            <Layers className="mt-1 h-6 w-6 shrink-0 text-slate-300" />
            <div>
              <p className="font-semibold">{title}</p>
              <p className="mt-0.5 text-sm text-slate-400">{desc}</p>
            </div>
          </Link>
        ))}
        <Link href="/practice/mock" className="flex items-start gap-4 rounded-xl border p-5 transition hover:border-sky-500 border-orange-700/60 bg-orange-950/20">
          <Timer className="mt-1 h-6 w-6 shrink-0 text-slate-300" />
          <div>
            <p className="font-semibold">Mock Exams</p>
            <p className="mt-0.5 text-sm text-slate-400">Full-length timed mocks</p>
          </div>
        </Link>
        <Link href="/samples" className="flex items-start gap-4 rounded-xl border p-5 transition hover:border-sky-500 border-rose-700/60 bg-rose-950/20">
          <ClipboardCheck className="mt-1 h-6 w-6 shrink-0 text-slate-300" />
          <div>
            <p className="font-semibold">Scenario Questions</p>
            <p className="mt-0.5 text-sm text-slate-400">Real-world scenarios with service decision rationale</p>
          </div>
        </Link>
        <Link href="/practice/flashcards" className="flex items-start gap-4 rounded-xl border p-5 transition hover:border-sky-500 border-slate-700 bg-slate-900/40">
          <CreditCard className="mt-1 h-6 w-6 shrink-0 text-slate-300" />
          <div>
            <p className="font-semibold">Flashcards</p>
            <p className="mt-0.5 text-sm text-slate-400">Spaced repetition for key terms</p>
          </div>
        </Link>
      </div>
      <Link href="/practice/review" className="card p-5 border border-rose-800/50 hover:border-rose-600/60 transition block group">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-rose-900/40 p-2">
            <RotateCcw className="h-5 w-5 text-rose-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-100 group-hover:text-rose-300 transition">Review Missed Questions</p>
            <p className="text-xs text-slate-400 mt-0.5">Drill the questions you got wrong — automatically pulled from your history</p>
          </div>
        </div>
      </Link>

      <div className="card flex items-center gap-4 p-5">
        <BarChart3 className="h-6 w-6 text-sky-300" />
        <div>
          <p className="font-semibold">Track your progress</p>
          <p className="text-sm text-slate-400">View weak objectives, quiz history, and exam readiness.</p>
        </div>
        <Link href="/progress" className="ml-auto text-sm text-sky-400 hover:underline">View Progress →</Link>
      </div>
    </div>
  );
}
