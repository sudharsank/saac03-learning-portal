'use client';

import { useState, useMemo, useEffect } from 'react';
import { DOMAINS, DOMAIN_LABELS } from '@/lib/content-types';

type Sample = {
  id: string;
  domain: number;
  objective: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'single' | 'multi';
  stem: string;
  options: { id: string; text: string }[];
  correct: string[];
  rationale: string;
  sourceUrl?: string;
  tags?: string[];
};

const DIFFICULTY_COLORS: Record<string, string> = {
  easy:   'bg-green-900/40 text-green-300 border-green-700/50',
  medium: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
  hard:   'bg-red-900/40 text-red-300 border-red-700/50',
};

const PAGE_SIZE = 6;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

async function loadSamples(): Promise<Sample[]> {
  const all: Sample[] = [];
  for (const domain of DOMAINS) {
    try {
      const res = await fetch(
        `${BASE_PATH}/content/practice/samples/domain${domain}_samples.json`,
        { cache: 'no-cache' }
      );
      if (res.ok) {
        const raw = await res.json();
        const items: Sample[] = Array.isArray(raw) ? raw : (raw.questions ?? []);
        all.push(...items);
      }
    } catch {
      // domain file missing — skip
    }
  }
  return all;
}

function SampleCard({
  sample,
  answered,
  onAnswer,
}: {
  sample: Sample;
  answered: Record<string, string>;
  onAnswer: (id: string, chosen: string) => void;
}) {
  const isAnswered = sample.id in answered;
  const chosen = answered[sample.id];
  const isCorrect = isAnswered && sample.correct.includes(chosen);

  return (
    <div className="space-y-4 rounded-lg border border-slate-700 bg-slate-900/50 p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        <span className="text-sky-400 uppercase">
          D{sample.domain} · {DOMAIN_LABELS[sample.domain as keyof typeof DOMAIN_LABELS]}
        </span>
        <span className={`rounded border px-2 py-0.5 ${DIFFICULTY_COLORS[sample.difficulty]}`}>
          {sample.difficulty}
        </span>
        <span className="text-slate-500">Obj {sample.objective}</span>
      </div>

      <p className="text-sm font-medium text-white">{sample.stem}</p>

      <div className="space-y-2">
        {sample.options.map((opt) => {
          const isChosenOpt = chosen === opt.id;
          const isCorrectOpt = sample.correct.includes(opt.id);
          let cls = 'border-slate-700 bg-slate-900/40';
          if (isAnswered) {
            if (isCorrectOpt) cls = 'border-green-600 bg-green-950/30';
            else if (isChosenOpt) cls = 'border-red-600 bg-red-950/30';
          } else if (isChosenOpt) {
            cls = 'border-sky-600 bg-sky-950/20';
          }

          return (
            <button
              key={opt.id}
              onClick={() => !isAnswered && onAnswer(sample.id, opt.id)}
              disabled={isAnswered}
              className={`w-full rounded border p-3 text-left text-sm transition-colors ${cls} ${!isAnswered ? 'cursor-pointer hover:border-slate-500' : 'cursor-default'}`}
            >
              <span className="mr-2 font-semibold uppercase">{opt.id}.</span>{opt.text}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`rounded border p-3 text-sm ${isCorrect ? 'border-green-800 bg-green-950/40 text-green-200' : 'border-red-800 bg-red-950/40 text-red-200'}`}>
          <strong>{isCorrect ? '✓ Correct!' : '✗ Incorrect.'}</strong>{' '}
          {sample.rationale}
          {sample.sourceUrl && (
            <a
              href={sample.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sky-400 underline hover:text-sky-300 text-xs"
            >
              Learn more ↗
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function SamplesPage() {
  const [samples, setSamples] = useState<Sample[]>([]);
  const [loading, setLoading] = useState(true);
  const [answered, setAnswered] = useState<Record<string, string>>({});
  const [difficulty, setDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [domain, setDomain] = useState<'all' | number>('all');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadSamples().then((data) => { setSamples(data); setLoading(false); });
  }, []);

  const filtered = useMemo(() => samples.filter((s) => {
    if (difficulty !== 'all' && s.difficulty !== difficulty) return false;
    if (domain !== 'all' && s.domain !== domain) return false;
    return true;
  }), [samples, difficulty, domain]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const correctCount = Object.entries(answered).filter(([id, ans]) => {
    const s = samples.find((x) => x.id === id);
    return s?.correct.includes(ans);
  }).length;

  return (
    <div className="space-y-6">
      <section className="card p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Practice Mode</p>
        <h1 className="mt-1 text-2xl font-bold">Scenario Practice</h1>
        <p className="mt-1 text-slate-400 text-sm">
          Real-world AWS Architecture scenarios mapped to SAA-C03 objectives. Pick the best approach for each constraint.
        </p>
        {Object.keys(answered).length > 0 && (
          <p className="mt-2 text-sm">
            <span className="text-slate-400">Score: </span>
            <span className="font-semibold text-green-400">{correctCount} / {Object.keys(answered).length} correct</span>
          </p>
        )}
      </section>

      <div className="flex flex-wrap gap-3">
        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value as typeof difficulty); setPage(1); }}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
        >
          <option value="all">All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <select
          value={domain}
          onChange={(e) => { setDomain(e.target.value === 'all' ? 'all' : Number(e.target.value)); setPage(1); }}
          className="rounded border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200"
        >
          <option value="all">All Domains</option>
          {DOMAINS.map((d) => (
            <option key={d} value={d}>D{d} — {DOMAIN_LABELS[d]}</option>
          ))}
        </select>
        <span className="self-center text-sm text-slate-500">
          {loading ? 'Loading…' : `${filtered.length} scenarios`}
        </span>
      </div>

      {loading ? (
        <div className="py-20 text-center text-slate-500">Loading scenarios…</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-slate-500">No scenarios match your filters.</div>
      ) : (
        <>
          <div className="space-y-4">
            {paginated.map((s) => (
              <SampleCard key={s.id} sample={s} answered={answered} onAnswer={(id, ans) => setAnswered((prev) => ({ ...prev, [id]: ans }))} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} className="rounded border border-slate-700 px-3 py-1.5 text-sm disabled:opacity-40">← Prev</button>
              <span className="self-center text-sm text-slate-400">{safePage} / {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} className="rounded border border-slate-700 px-3 py-1.5 text-sm disabled:opacity-40">Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
