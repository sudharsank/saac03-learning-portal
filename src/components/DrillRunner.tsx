'use client';

import { useState, useCallback } from 'react';
import { addQuizAttempt } from '@/lib/progress';
import type { Question } from '@/lib/question-schema';
import { CheckCircle, XCircle, ChevronRight, RotateCcw } from 'lucide-react';

type Props = { questions: Question[]; domainLabel: string; domainNumber: 1 | 2 | 3 | 4 | 5 };

type ItemResult = { qId: string; correct: boolean; objective: string; chosen: string };

export function DrillRunner({ questions, domainLabel, domainNumber }: Props) {
  const [index, setIndex] = useState(0);
  const [chosen, setChosen] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [results, setResults] = useState<ItemResult[]>([]);
  const [started, setStarted] = useState(false);
  const [done, setDone] = useState(false);
  const [startedAt] = useState(new Date().toISOString());

  const q = questions[index];
  const isCorrect = chosen ? q.correct.includes(chosen) : false;

  const handleSelect = useCallback((optId: string) => {
    if (revealed) return;
    setChosen(optId);
    setRevealed(true);
    setResults((r) => [
      ...r,
      { qId: q.id, correct: q.correct.includes(optId), objective: q.objective, chosen: optId },
    ]);
  }, [revealed, q]);

  const handleNext = useCallback(() => {
    if (index < questions.length - 1) {
      setIndex((i) => i + 1);
      setChosen(null);
      setRevealed(false);
    } else {
      const score = results.filter((r) => r.correct).length / questions.length;
      addQuizAttempt({
        quizId: `drill-${domainNumber}-${Date.now()}`,
        domain: domainNumber,
        mode: 'drill',
        startedAt,
        finishedAt: new Date().toISOString(),
        durationSec: Math.round((Date.now() - new Date(startedAt).getTime()) / 1000),
        items: results,
        score,
      });
      setDone(true);
    }
  }, [index, questions.length, results, domainNumber, startedAt]);

  const handleRestart = () => {
    setIndex(0);
    setChosen(null);
    setRevealed(false);
    setResults([]);
    setDone(false);
  };

  if (!started) {
    return (
      <div className="card p-8 text-center space-y-4">
        <p className="text-slate-400 text-sm uppercase tracking-wider">Domain Drill</p>
        <h2 className="text-2xl font-bold">{domainLabel}</h2>
        <p className="text-slate-300">{questions.length} questions · Rationale shown after each answer</p>
        <button
          onClick={() => setStarted(true)}
          className="rounded-lg bg-sky-600 px-6 py-3 font-semibold text-white hover:bg-sky-500"
        >
          Start Drill
        </button>
      </div>
    );
  }

  if (done) {
    const score = results.filter((r) => r.correct).length;
    const pct = Math.round((score / questions.length) * 100);
    const byObjective: Record<string, { correct: number; total: number }> = {};
    for (const r of results) {
      byObjective[r.objective] ??= { correct: 0, total: 0 };
      byObjective[r.objective].total++;
      if (r.correct) byObjective[r.objective].correct++;
    }

    return (
      <div className="space-y-6">
        <div className="card p-6 text-center">
          <p className="text-slate-400 text-sm">Drill Complete</p>
          <p className={`mt-2 text-5xl font-bold ${pct >= 70 ? 'text-emerald-400' : 'text-rose-400'}`}>{pct}%</p>
          <p className="mt-1 text-slate-300">{score} / {questions.length} correct</p>
        </div>
        <div className="card p-5">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">By Objective</p>
          <div className="space-y-2">
            {Object.entries(byObjective).sort().map(([obj, stat]) => {
              const p = Math.round((stat.correct / stat.total) * 100);
              return (
                <div key={obj} className="flex items-center gap-3 text-sm">
                  <span className="w-8 font-mono text-slate-500">{obj}</span>
                  <div className="flex-1 rounded-full bg-slate-800 h-2">
                    <div className={`h-2 rounded-full ${p >= 70 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${p}%` }} />
                  </div>
                  <span className="w-12 text-right text-slate-300">{p}%</span>
                </div>
              );
            })}
          </div>
        </div>
        <button onClick={handleRestart} className="flex items-center gap-2 text-sm text-sky-400 hover:underline">
          <RotateCcw className="h-4 w-4" /> Restart Drill
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>Question {index + 1} of {questions.length}</span>
        <span className="font-mono text-xs">Obj {q.objective} · {q.difficulty}</span>
      </div>

      <div className="w-full rounded-full bg-slate-800 h-1.5">
        <div className="h-1.5 rounded-full bg-sky-500 transition-all" style={{ width: `${((index) / questions.length) * 100}%` }} />
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
                {revealed && isCorrectOpt && <CheckCircle className="inline ml-2 h-4 w-4 text-emerald-400" />}
                {revealed && isChosen && !isCorrectOpt && <XCircle className="inline ml-2 h-4 w-4 text-rose-400" />}
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
          className="flex items-center gap-2 rounded-lg bg-sky-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-sky-500"
        >
          {index < questions.length - 1 ? 'Next Question' : 'See Results'}
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
