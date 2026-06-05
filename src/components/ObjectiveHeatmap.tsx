'use client';

import Link from 'next/link';
import { loadProgress } from '@/lib/progress';
import { DOMAIN_LABELS, DOMAIN_SLUGS, DOMAINS, type Domain } from '@/lib/content-types';

type ObjStats = {
  attempted: number;
  correct: number;
  accuracy: number;
  domain: Domain;
};

function getBadgeClass(stats: ObjStats): string {
  if (stats.attempted === 0) return 'bg-slate-800 text-slate-500';
  const pct = stats.accuracy * 100;
  if (pct < 50) return 'bg-rose-900/60 text-rose-300';
  if (pct < 70) return 'bg-amber-900/60 text-amber-300';
  if (pct < 85) return 'bg-sky-900/60 text-sky-300';
  return 'bg-emerald-900/60 text-emerald-300';
}

function computeStats(): Record<string, ObjStats> {
  const progress = loadProgress();
  const stats: Record<string, ObjStats> = {};

  // Discover all objectives from quiz data and infer domain from objective prefix (e.g. "2.1" → domain 2)
  for (const quiz of progress.quizzes) {
    for (const item of quiz.items) {
      const obj = item.objective;
      if (!obj) continue;
      const domainNum = parseInt(obj.split('.')[0], 10) as Domain;
      if (!DOMAINS.includes(domainNum)) continue;
      if (!stats[obj]) {
        stats[obj] = { attempted: 0, correct: 0, accuracy: 0, domain: domainNum };
      }
      stats[obj].attempted += 1;
      if (item.correct) stats[obj].correct += 1;
    }
  }

  for (const s of Object.values(stats)) {
    s.accuracy = s.attempted > 0 ? s.correct / s.attempted : 0;
  }

  return stats;
}

export function ObjectiveHeatmap() {
  const stats = computeStats();
  const objectives = Object.keys(stats).sort();

  // Group objectives by domain
  const byDomain = new Map<Domain, string[]>();
  for (const d of DOMAINS) byDomain.set(d, []);
  for (const obj of objectives) {
    const d = stats[obj].domain;
    byDomain.get(d)?.push(obj);
  }

  // Weakest: objectives with ≥3 attempts, sorted by accuracy asc, take top 3
  const weakest = objectives
    .filter((obj) => stats[obj].attempted >= 3)
    .sort((a, b) => stats[a].accuracy - stats[b].accuracy)
    .slice(0, 3);

  const hasData = objectives.length > 0;

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Objective Coverage Heatmap</h2>
        <p className="mt-1 text-sm text-slate-400">
          Color shows your accuracy per objective. Hover a badge for details.
        </p>
      </div>

      {/* Grid by domain row */}
      {hasData ? (
        <div className="card p-5 space-y-5">
          {DOMAINS.map((domain) => {
            const objs = byDomain.get(domain) ?? [];
            if (objs.length === 0) return null;
            return (
              <div key={domain}>
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  D{domain} — {DOMAIN_LABELS[domain]}
                </p>
                <div className="flex flex-wrap gap-2">
                  {objs.map((obj) => {
                    const s = stats[obj];
                    const pct = s.attempted > 0 ? Math.round(s.accuracy * 100) : null;
                    const title =
                      s.attempted === 0
                        ? `Obj ${obj} · not attempted`
                        : `Obj ${obj} · ${s.attempted} attempted · ${s.correct} correct · ${pct}%`;
                    return (
                      <div
                        key={obj}
                        title={title}
                        className={`flex h-10 w-14 cursor-default flex-col items-center justify-center rounded-lg text-xs font-bold transition hover:scale-105 ${getBadgeClass(s)}`}
                      >
                        <span>{obj}</span>
                        {pct !== null && (
                          <span className="text-[10px] font-normal opacity-80">{pct}%</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-slate-500 card p-5">
          No quiz attempts yet. Complete practice questions to see your objective coverage.
        </p>
      )}

      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-slate-800 ring-1 ring-slate-700" />
          <span className="text-slate-400">Not attempted</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-900/60" />
          <span className="text-slate-400">0–49% (needs work)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-amber-900/60" />
          <span className="text-slate-400">50–69% (improving)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-sky-900/60" />
          <span className="text-slate-400">70–84% (good)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-900/60" />
          <span className="text-slate-400">85–100% (strong)</span>
        </div>
      </div>

      {/* Weakest objectives */}
      {weakest.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-300">Weakest Objectives</h3>
          <div className="space-y-2">
            {weakest.map((obj) => {
              const s = stats[obj];
              const pct = Math.round(s.accuracy * 100);
              const domain = s.domain;
              return (
                <div
                  key={obj}
                  className="card flex items-center justify-between px-4 py-3"
                >
                  <div>
                    <span className="font-mono font-semibold text-rose-300">Obj {obj}</span>
                    <span className="ml-3 text-sm text-slate-400">
                      {s.attempted} attempted · {s.correct} correct · {pct}%
                    </span>
                  </div>
                  <Link
                    href={`/practice/drill/${DOMAIN_SLUGS[domain]}`}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:border-sky-500 hover:text-sky-300 transition whitespace-nowrap"
                  >
                    Drill D{domain} →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {weakest.length === 0 && hasData && (
        <p className="text-sm text-slate-500">
          Complete at least 3 questions per objective to see your weakest areas.
        </p>
      )}
    </section>
  );
}
