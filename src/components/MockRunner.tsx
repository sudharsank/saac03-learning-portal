'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { addQuizAttempt } from '@/lib/progress';
import type { Question } from '@/lib/question-schema';
import { Timer, CheckCircle, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

type Props = { questions: Question[]; mockId: string };
type Answers = Record<string, string>;

const DURATION_SEC = 60 * 60;

function formatTime(sec: number) {
  const m = Math.floor(sec / 60).toString().padStart(2, '0');
  const s = (sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function MockRunner({ questions, mockId }: Props) {
  const [phase, setPhase] = useState<'start' | 'running' | 'review'>('start');
  const [answers, setAnswers] = useState<Answers>({});
  const [current, setCurrent] = useState(0);
  const [remaining, setRemaining] = useState(DURATION_SEC);
  const [startedAt] = useState(new Date().toISOString());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase !== 'running') return;
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) { handleSubmit(true); return 0; }
        return r - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const handleSubmit = useCallback((timeUp = false) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    const items = questions.map((q) => ({
      qId: q.id,
      correct: q.correct.includes(answers[q.id] ?? ''),
      objective: q.objective,
      chosen: answers[q.id] ?? '',
    }));
    const score = items.filter((i) => i.correct).length / questions.length;
    addQuizAttempt({
      quizId: `${mockId}-${Date.now()}`,
      mode: 'mock',
      startedAt,
      finishedAt: new Date().toISOString(),
      durationSec: DURATION_SEC - remaining,
      items,
      score,
    });
    if (timeUp) alert('Time is up! Your answers have been submitted.');
    setPhase('review');
  }, [questions, answers, mockId, startedAt, remaining]);

  if (phase === 'start') {
    const d1 = questions.filter((q) => q.domain === 1).length;
    const d2 = questions.filter((q) => q.domain === 2).length;
    const d3 = questions.filter((q) => q.domain === 3).length;
    const d4 = questions.filter((q) => q.domain === 4).length;
    const d5 = questions.filter((q) => q.domain === 5).length;
    return (
      <div className="card p-8 space-y-6 max-w-lg mx-auto text-center">
        <Timer className="mx-auto h-12 w-12 text-amber-400" />
        <div>
          <h2 className="text-2xl font-bold">{`Mock Exam ${mockId.replace('mock-', '')}`}</h2>
          <p className="mt-1 text-slate-300">Timed exam — rationale revealed only after submission</p>
        </div>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="rounded-lg border border-slate-700 p-3">
            <p className="text-slate-400">Questions</p>
            <p className="text-xl font-bold">{questions.length}</p>
          </div>
          <div className="rounded-lg border border-slate-700 p-3">
            <p className="text-slate-400">Time</p>
            <p className="text-xl font-bold">60 min</p>
          </div>
          <div className="rounded-lg border border-slate-700 p-3">
            <p className="text-slate-400">Passing</p>
            <p className="text-xl font-bold">70%</p>
          </div>
        </div>
        <div className="text-xs text-slate-400 space-y-1">
          <p>D1: {d1} · D2: {d2} · D3: {d3} · D4: {d4} · D5: {d5}</p>
          <p>You can navigate between questions freely during the exam.</p>
        </div>
        <button
          onClick={() => setPhase('running')}
          className="w-full rounded-lg bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-500"
        >
          Start Exam
        </button>
      </div>
    );
  }

  if (phase === 'review') {
    return <ReviewPanel questions={questions} answers={answers} mockId={mockId} />;
  }

  // Running phase
  const q = questions[current];
  const answered = Object.keys(answers).length;
  const unanswered = questions.length - answered;
  const isLow = remaining < 300;

  return (
    <div className="space-y-4">
      {/* Timer bar */}
      <div className={`flex items-center justify-between rounded-xl border p-3 ${isLow ? 'border-rose-700/60 bg-rose-950/20' : 'border-slate-700 bg-slate-900/40'}`}>
        <div className="flex items-center gap-2">
          <Timer className={`h-4 w-4 ${isLow ? 'text-rose-400' : 'text-slate-400'}`} />
          <span className={`font-mono font-bold ${isLow ? 'text-rose-300' : 'text-slate-200'}`}>{formatTime(remaining)}</span>
        </div>
        <span className="text-xs text-slate-400">{answered}/{questions.length} answered</span>
        {unanswered > 0 && (
          <span className="flex items-center gap-1 text-xs text-amber-400">
            <AlertCircle className="h-3 w-3" />{unanswered} unanswered
          </span>
        )}
        <button
          onClick={() => handleSubmit()}
          className="rounded-lg bg-sky-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-500"
        >
          Submit
        </button>
      </div>

      {/* Question navigator */}
      <div className="flex flex-wrap gap-1.5">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-7 w-7 rounded text-xs font-medium transition ${
              i === current ? 'bg-sky-600 text-white' :
              answers[questions[i].id] ? 'bg-emerald-900/60 text-emerald-300' :
              'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Current question */}
      <div className="card p-6">
        <p className="mb-1 text-xs text-slate-500">Q{current + 1} · Obj {q.objective} · {q.difficulty}</p>
        <p className="font-medium text-slate-100">{q.stem}</p>
        <div className="mt-4 space-y-2">
          {q.options.map((opt) => {
            const isChosen = answers[q.id] === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                className={`w-full rounded-lg border p-3 text-left text-sm transition ${
                  isChosen ? 'border-sky-400 bg-sky-950/30 text-sky-100' : 'border-slate-700 hover:border-slate-500'
                }`}
              >
                <span className="font-semibold mr-2">{opt.id}.</span>{opt.text}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prev/Next */}
      <div className="flex gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-40"
        >
          ← Prev
        </button>
        <button
          onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          disabled={current === questions.length - 1}
          className="rounded-lg border border-slate-700 px-4 py-2 text-sm disabled:opacity-40"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

type ReviewFilter = 'all' | 'incorrect' | 'domain-1' | 'domain-2' | 'domain-3' | 'domain-4' | 'domain-5';

function ReviewPanel({ questions, answers, mockId }: { questions: Question[]; answers: Record<string, string>; mockId: string }) {
  const [filter, setFilter] = useState<ReviewFilter>('all');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const items = questions.map((q, i) => ({
    q,
    index: i,
    chosen: answers[q.id] ?? '',
    correct: q.correct.includes(answers[q.id] ?? ''),
  }));

  const score = items.filter((i) => i.correct).length;
  const pct = Math.round((score / questions.length) * 100);

  const byObjective: Record<string, { correct: number; total: number }> = {};
  for (const item of items) {
    byObjective[item.q.objective] ??= { correct: 0, total: 0 };
    byObjective[item.q.objective].total++;
    if (item.correct) byObjective[item.q.objective].correct++;
  }

  const filtered = items.filter((item) => {
    if (filter === 'incorrect') return !item.correct;
    if (filter === 'domain-1') return item.q.domain === 1;
    if (filter === 'domain-2') return item.q.domain === 2;
    if (filter === 'domain-3') return item.q.domain === 3;
    if (filter === 'domain-4') return item.q.domain === 4;
    if (filter === 'domain-5') return item.q.domain === 5;
    return true;
  });

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const expandAll = () => setExpanded(new Set(filtered.map((i) => i.q.id)));
  const collapseAll = () => setExpanded(new Set());

  const FILTERS: { key: ReviewFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: items.length },
    { key: 'incorrect', label: 'Incorrect', count: items.filter((i) => !i.correct).length },
    { key: 'domain-1', label: 'D1', count: items.filter((i) => i.q.domain === 1).length },
    { key: 'domain-2', label: 'D2', count: items.filter((i) => i.q.domain === 2).length },
    { key: 'domain-3', label: 'D3', count: items.filter((i) => i.q.domain === 3).length },
    { key: 'domain-4', label: 'D4', count: items.filter((i) => i.q.domain === 4).length },
    { key: 'domain-5', label: 'D5', count: items.filter((i) => i.q.domain === 5).length },
  ];

  return (
    <div className="space-y-6">
      {/* Score summary */}
      <div className="card p-6 text-center">
        <p className="text-slate-400 text-sm">{`Mock Exam ${mockId.replace('mock-', '')} — Results`}</p>
        <p className={`mt-2 text-6xl font-bold ${pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{pct}%</p>
        <p className="mt-1 text-slate-300">{score} / {questions.length} correct · {pct >= 70 ? '✓ Pass' : '✗ Below passing score (700/1000)'}</p>
      </div>

      {/* Objective breakdown */}
      <div className="card p-5">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">Objective Breakdown</p>
        <div className="space-y-2">
          {Object.entries(byObjective).sort().map(([obj, stat]) => {
            const p = Math.round((stat.correct / stat.total) * 100);
            return (
              <div key={obj} className="flex items-center gap-3 text-sm">
                <span className="w-8 font-mono text-slate-500">{obj}</span>
                <div className="flex-1 rounded-full bg-slate-800 h-2">
                  <div className={`h-2 rounded-full transition-all ${p >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${p}%` }} />
                </div>
                <span className="w-16 text-right text-slate-300">{stat.correct}/{stat.total}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick-scan grid */}
      <div className="card p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Quick Scan — click to jump</p>
        <div className="flex flex-wrap gap-1.5">
          {items.map((item) => (
            <button
              key={item.q.id}
              onClick={() => {
                setFilter('all');
                setExpanded((prev) => new Set([...prev, item.q.id]));
                setTimeout(() => {
                  document.getElementById(`q-${item.q.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 50);
              }}
              className={`h-7 w-7 rounded text-xs font-medium transition ${
                item.correct ? 'bg-emerald-900/60 text-emerald-300 hover:bg-emerald-800/60' : 'bg-rose-900/60 text-rose-300 hover:bg-rose-800/60'
              }`}
              title={`Q${item.index + 1} · Obj ${item.q.objective} · ${item.correct ? 'Correct' : 'Incorrect'}`}
            >
              {item.index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Filter tabs + expand controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                filter === f.key
                  ? f.key === 'incorrect' ? 'bg-rose-700 text-white' : 'bg-sky-700 text-white'
                  : 'border border-slate-700 text-slate-400 hover:border-slate-500'
              }`}
            >
              {f.label} <span className="ml-1 opacity-70">{f.count}</span>
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-xs text-slate-400">
          <button onClick={expandAll} className="hover:text-sky-400">Expand all</button>
          <span>·</span>
          <button onClick={collapseAll} className="hover:text-sky-400">Collapse all</button>
        </div>
      </div>

      {/* Question cards */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-6 text-center text-slate-400 text-sm">No questions match this filter.</div>
        )}
        {filtered.map((item) => {
          const isOpen = expanded.has(item.q.id);
          return (
            <div
              key={item.q.id}
              id={`q-${item.q.id}`}
              className={`rounded-xl border transition-all ${item.correct ? 'border-emerald-800/40' : 'border-rose-800/50 bg-rose-950/10'}`}
            >
              {/* Card header — always visible */}
              <button
                onClick={() => toggleExpand(item.q.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                {item.correct
                  ? <CheckCircle className="h-5 w-5 shrink-0 text-emerald-400" />
                  : <XCircle className="h-5 w-5 shrink-0 text-rose-400" />}
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">Q{item.index + 1} · Obj {item.q.objective} · {item.q.type} · {item.q.difficulty}</p>
                  <p className="text-sm font-medium text-slate-200 truncate">{item.q.stem.slice(0, 120)}{item.q.stem.length > 120 ? '…' : ''}</p>
                  {!isOpen && (
                    <p className="text-xs mt-1">
                      {item.correct
                        ? <span className="text-emerald-400">Your answer: {item.chosen} ✓</span>
                        : <span className="text-rose-400">Your answer: {item.chosen || '(skipped)'} · Correct: {item.q.correct.join(', ')}</span>}
                    </p>
                  )}
                </div>
                {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-slate-500" /> : <ChevronDown className="h-4 w-4 shrink-0 text-slate-500" />}
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="px-4 pb-4 space-y-3 border-t border-slate-800/60 pt-3">
                  <p className="text-sm text-slate-100">{item.q.stem}</p>

                  {/* Options side-by-side */}
                  <div className="grid sm:grid-cols-2 gap-1.5">
                    {item.q.options.map((opt) => {
                      const isCorrectOpt = item.q.correct.includes(opt.id);
                      const isChosen = item.chosen === opt.id || (item.q.type === 'multi' && item.chosen.split(',').includes(opt.id));
                      return (
                        <div
                          key={opt.id}
                          className={`rounded-lg px-3 py-2 text-xs flex items-start gap-2 ${
                            isCorrectOpt
                              ? 'bg-emerald-950/50 text-emerald-200 border border-emerald-800/60'
                              : isChosen
                              ? 'bg-rose-950/50 text-rose-300 border border-rose-800/60'
                              : 'bg-slate-800/40 text-slate-500'
                          }`}
                        >
                          <span className="font-bold shrink-0">{opt.id}.</span>
                          <span>{opt.text}</span>
                          {isCorrectOpt && <CheckCircle className="ml-auto h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                          {isChosen && !isCorrectOpt && <XCircle className="ml-auto h-3.5 w-3.5 shrink-0 text-rose-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Rationale */}
                  <div className="rounded-lg bg-slate-800/50 border border-slate-700/50 p-3">
                    <p className="text-xs font-semibold text-sky-300 mb-1">Explanation</p>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.q.rationale}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
