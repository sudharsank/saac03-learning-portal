'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { loadProgress, addQuizAttempt } from '@/lib/progress';
import type { Question } from '@/lib/question-schema';
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

type Props = { allQuestions: Question[] };

type ItemResult = { qId: string; correct: boolean; objective: string; chosen: string };

export function ReviewRunner({ allQuestions }: Props) {
  const [missedQuestions, setMissedQuestions] = useState<Question[] | null>(null);
  const [domainCounts, setDomainCounts] = useState<Record<number, number>>({});

  // Q&A state
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  useEffect(() => {
    const progress = loadProgress();

    // Build a map of qId -> most recent correct/incorrect
    const latestByQ = new Map<string, boolean>();
    const sorted = [...progress.quizzes].sort((a, b) =>
      a.finishedAt.localeCompare(b.finishedAt)
    );
    for (const attempt of sorted) {
      for (const item of attempt.items) {
        latestByQ.set(item.qId, item.correct);
      }
    }

    // Missed = where latest result is false
    const missedIds = new Set(
      [...latestByQ.entries()]
        .filter(([, correct]) => !correct)
        .map(([id]) => id)
    );

    const filtered = allQuestions.filter((q) => missedIds.has(q.id));

    // Count by domain
    const counts: Record<number, number> = {};
    for (const q of filtered) {
      counts[q.domain] = (counts[q.domain] ?? 0) + 1;
    }

    setMissedQuestions(filtered);
    setDomainCounts(counts);
  }, [allQuestions]);

  const handleRestart = () => {
    setIndex(0);
    setChosen(null);
    setRevealed(false);
    setResults([]);
    setDone(false);
    setStarted(false);
  };

  // Loading state
  if (missedQuestions === null) {
    return (
      <div className="card p-8 text-center text-slate-400 text-sm">
        Loading your history…
      </div>
    );
  }

  // Empty state
  if (missedQuestions.length === 0) {
    return (
      <div className="card p-8 text-center space-y-3">
        <CheckCircle className="mx-auto h-12 w-12 text-emerald-400" />
        <p className="font-semibold">No missed questions yet</p>
        <p className="text-slate-400 text-sm">
          Complete a mock exam or domain drill first — your incorrect answers will appear here for targeted review.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            href="/practice/mock"
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
          >
            Take a Mock Exam
          </Link>
          <Link
            href="/practice"
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-slate-500"
          >
            All Practice Modes
          </Link>
        </div>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      <div className="card p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm uppercase tracking-wider">Targeted Review</p>
        <h2 className="text-2xl font-bold">{missedQuestions.length} Missed Questions</h2>
        <div className="flex justify-center gap-4 text-sm text-slate-300">
          {([1, 2, 3, 4, 5] as const).map((d) =>
            domainCounts[d] ? (
              <span key={d} className="rounded-full bg-slate-800 px-3 py-1">
                D{d}: {domainCounts[d]}
              </span>
            ) : null
          )}
        </div>
        <p className="text-slate-400 text-sm">Rationale shown after each answer</p>
        <button
          onClick={() => setStarted(true)}
          className="rounded-lg bg-rose-600 px-6 py-3 font-semibold text-white hover:bg-rose-500"
        >
          Start Review
        </button>
      </div>
    );
  }

  // Done screen
  if (done) {
    const correctCount = results.filter((r) => r.correct).length;
    const total = missedQuestions.length;
    const stillMissed = total - correctCount;
    const pct = Math.round((correctCount / total) * 100);

    return (
      <div className="space-y-6">
        <div className="card p-6 text-center space-y-2">
          <p className="text-slate-400 text-sm">Session Complete</p>
          <p className={`text-5xl font-bold ${pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {pct}%
          </p>
          <p className="text-slate-300">
            {correctCount}/{total} answered correctly this session.
          </p>
          {stillMissed > 0 && (
            <p className="text-rose-400 text-sm">{stillMissed} still need more practice.</p>
          )}
          {stillMissed === 0 && (
            <p className="text-emerald-400 text-sm">You answered all missed questions correctly!</p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleRestart}
            className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500"
          >
            <RotateCcw className="h-4 w-4" /> Review Again
          </button>
          <Link
            href="/practice"
            className="flex items-center gap-2 rounded-lg border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:border-slate-500"
          >
            All Practice Modes
          </Link>
        </div>
      </div>
    );
  }

  // Running — Q&A interface
  const q = missedQuestions[index];
  const isCorrect = chosen ? q.correct.includes(chosen) : false;
  const sessionCorrect = results.filter((r) => r.correct).length;

  const handleSelect = (optId: string) => {
    if (revealed) return;
    setChosen(optId);
    setRevealed(true);
    setResults((r) => [
      ...r,
      { qId: q.id, correct: q.correct.includes(optId), objective: q.objective, chosen: optId },
    ]);
  };

  const handleNext = () => {
    if (index < missedQuestions.length - 1) {
      setIndex((i) => i + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      const finalResults = [
        ...results,
      ];
      const score = finalResults.filter((r) => r.correct).length / missedQuestions.length;
      addQuizAttempt({
        quizId: `review-${Date.now()}`,
        mode: 'drill',
        startedAt,
        finishedAt: new Date().toISOString(),
        durationSec: Math.round((Date.now() - new Date(startedAt).getTime()) / 1000),
        items: finalResults,
        score,
      });
      setDone(true);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>
          Question {index + 1} of {missedQuestions.length}
          {results.length > 0 && (
            <span className="ml-3 text-emerald-400 font-medium">
              ✓ {sessionCorrect} correct
            </span>
          )}
        </span>
        <span className="font-mono text-xs">Obj {q.objective} · {q.difficulty}</span>
      </div>

      <div className="w-full rounded-full bg-slate-800 h-1.5">
        <div
          className="h-1.5 rounded-full bg-rose-500 transition-all"
          style={{ width: `${(index / missedQuestions.length) * 100}%` }}
        />
      </div>

      <div className="card p-6">
        <p className="font-medium text-slate-100">{q.stem}</p>
        <div className="mt-4 space-y-2">
          {q.options.map((opt) => {
            const isChosen = chosen === opt.id;
            const isCorrectOpt = q.correct.includes(opt.id);
            const cls = revealed
              ? isCorrectOpt
                ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100'
                : isChosen
                ? 'border-rose-500 bg-rose-950/40 text-rose-200'
                : 'border-slate-700 text-slate-400'
              : isChosen
              ? 'border-sky-400 bg-sky-950/30'
              : 'border-slate-700 hover:border-slate-500';

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt.id)}
                disabled={revealed}
                className={`w-full rounded-lg border p-3 text-left text-sm transition disabled:cursor-default ${cls}`}
              >
                <span className="font-semibold mr-2">{opt.id}.</span>{opt.text}
                {revealed && isCorrectOpt && (
                  <CheckCircle className="inline ml-2 h-4 w-4 text-emerald-400" />
                )}
                {revealed && isChosen && !isCorrectOpt && (
                  <XCircle className="inline ml-2 h-4 w-4 text-rose-400" />
                )}
              </button>
            );
          })}
        </div>

        {revealed && (
          <div className="mt-4 rounded-lg bg-slate-800/60 p-4 text-sm text-slate-300">
            <p className="mb-1 font-semibold text-sky-300">
              {isCorrect ? '✓ Correct' : '✗ Incorrect'} — Rationale
            </p>
            {q.rationale}
          </div>
        )}
      </div>

      {revealed && (
        <button
          onClick={handleNext}
          className="flex items-center gap-2 rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500"
        >
          {index < missedQuestions.length - 1 ? 'Next Question' : 'See Results'}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
