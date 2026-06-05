import Link from 'next/link';
import { getLessonsByDomain, DOMAIN_LABELS, DOMAIN_WEIGHTS, DOMAIN_SLUGS, DOMAINS } from '@/lib/content';
import { ChevronRight } from 'lucide-react';

const DOMAIN_COLORS: Record<number, string> = {
  1: 'border-sky-700/60 bg-sky-950/20',
  2: 'border-violet-700/60 bg-violet-950/20',
  3: 'border-emerald-700/60 bg-emerald-950/20',
  4: 'border-teal-700/60 bg-teal-950/20',
};

const WEIGHT_BADGE: Record<string, string> = {
  High:   'bg-rose-900/60 text-rose-300',
  Medium: 'bg-amber-900/60 text-amber-300',
  Low:    'bg-slate-800 text-slate-400',
};

export default function LearnPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">SAA-C03 Study Guide</h1>
        <p className="mt-2 text-slate-300">
          Lessons across all domains. Each lesson: Concepts → Exam Traps → Hands-On → Quiz.
        </p>
      </div>
      <div className="space-y-6">
        {DOMAINS.map((domain) => {
          const lessons = getLessonsByDomain(domain);
          const domainSlug = DOMAIN_SLUGS[domain];
          return (
            <div key={domain} className={`rounded-xl border p-6 ${DOMAIN_COLORS[domain]}`}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Domain {domain} · {DOMAIN_WEIGHTS[domain]}
                </span>
                <span className="text-xs text-slate-500">{lessons.length} lessons</span>
              </div>
              <h2 className="mb-4 text-xl font-bold">{DOMAIN_LABELS[domain]}</h2>
              <div className="space-y-2">
                {lessons.map((lesson) => (
                  <Link
                    key={lesson.slug}
                    href={`/learn/${domainSlug}/${lesson.slug}`}
                    className="flex items-center justify-between rounded-lg border border-slate-700/60 bg-slate-900/40 px-4 py-3 hover:border-sky-500 hover:bg-sky-950/20 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-sm font-medium truncate">{lesson.title}</span>
                      {lesson.weight && (
                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${WEIGHT_BADGE[lesson.weight] ?? WEIGHT_BADGE.Medium}`}>
                          {lesson.weight}
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-slate-500" />
                  </Link>
                ))}
              </div>
              <div className="mt-4">
                <Link
                  href={`/learn/${domainSlug}`}
                  className="text-sm text-sky-400 hover:text-sky-300 hover:underline"
                >
                  View domain overview →
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
