import Link from 'next/link';
import { BookOpen, ClipboardCheck, BarChart3, Library, ChevronRight } from 'lucide-react';
import { getAllLessons, DOMAIN_LABELS, DOMAIN_SLUGS, DOMAIN_WEIGHTS, DOMAINS } from '@/lib/content';
import { DashboardStats } from '@/components/DashboardStats';
import { ThiranCard } from '@/components/ThiranCard';
import { VisitorCount } from '@/components/VisitorCount';

const DOMAIN_COLOR_PALETTE = [
  'text-sky-300',
  'text-violet-300',
  'text-emerald-300',
  'text-amber-300',
  'text-rose-300',
  'text-pink-300',
  'text-teal-300',
];

function getDomainColor(domain: number): string {
  return DOMAIN_COLOR_PALETTE[(domain - 1) % DOMAIN_COLOR_PALETTE.length];
}

export default function DashboardPage() {
  const allLessons = getAllLessons();
  const totalMinutes = allLessons.reduce((sum, l) => sum + (l.estMinutes ?? 0), 0);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <section className="card p-6">
        <p className="text-sm uppercase tracking-wide text-sky-300">SAA-C03 Exam Prep</p>
        <h1 className="mt-2 text-3xl font-bold">AWS Certified Solutions Architect – Associate</h1>
        <p className="mt-2 max-w-3xl text-slate-300">
          Domain-first self-learning portal. Every lesson maps 1:1 to an exam objective with layered content —
          concept, Azure service mapping, hands-on walkthrough, and exam angle.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Total Lessons</p>
            <p className="text-2xl font-semibold">{allLessons.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Est. Study Time</p>
            <p className="text-2xl font-semibold">{Math.round(totalMinutes / 60)}h</p>
          </div>
          <div className="rounded-lg border border-slate-700 p-4">
            <p className="text-sm text-slate-400">Exam Domains</p>
            <p className="text-2xl font-semibold">5</p>
          </div>
        </div>
        <VisitorCount portalId="saa-c03" />
      </section>

      {/* Thiran */}
      <ThiranCard />

      {/* Live progress stats */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Your Progress</h2>
        <DashboardStats allLessons={allLessons} />
      </section>

      {/* Domain overview */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Exam Domains</h2>
        <div className="space-y-3">
          {DOMAINS.map((domain) => (
            <Link
              key={domain}
              href={`/learn/${DOMAIN_SLUGS[domain]}`}
              className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-900/40 px-5 py-4 hover:border-sky-500 transition"
            >
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${getDomainColor(domain)}`}>
                  Domain {domain} · {DOMAIN_WEIGHTS[domain]}
                </p>
                <p className="mt-0.5 font-medium">{DOMAIN_LABELS[domain]}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-slate-500" />
            </Link>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid gap-4 md:grid-cols-2">
        <Link href="/learn" className="card flex items-center gap-4 p-5 hover:border-sky-500 transition">
          <BookOpen className="h-8 w-8 text-sky-300" />
          <div>
            <p className="font-semibold">Start Studying</p>
            <p className="text-sm text-slate-400">Browse all {allLessons.length} lessons by domain</p>
          </div>
        </Link>
        <Link href="/practice" className="card flex items-center gap-4 p-5 hover:border-sky-500 transition">
          <ClipboardCheck className="h-8 w-8 text-emerald-300" />
          <div>
            <p className="font-semibold">Practice</p>
            <p className="text-sm text-slate-400">Drills, mocks, scenarios, and flashcards</p>
          </div>
        </Link>
        <Link href="/progress" className="card flex items-center gap-4 p-5 hover:border-sky-500 transition">
          <BarChart3 className="h-8 w-8 text-violet-300" />
          <div>
            <p className="font-semibold">Track Progress</p>
            <p className="text-sm text-slate-400">Weak areas, coverage, and exam readiness</p>
          </div>
        </Link>
        <Link href="/resources" className="card flex items-center gap-4 p-5 hover:border-sky-500 transition">
          <Library className="h-8 w-8 text-amber-300" />
          <div>
            <p className="font-semibold">Resources</p>
            <p className="text-sm text-slate-400">MS Learn, MVP blogs, and curated videos</p>
          </div>
        </Link>
      </section>
    </div>
  );
}
