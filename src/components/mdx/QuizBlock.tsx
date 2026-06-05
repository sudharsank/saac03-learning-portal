'use client';

import { useState } from 'react';
import type { Question } from '@/lib/question-schema';

export function QuizBlock({ questions }: { questions: Question[] }) {
  const [selected, setSelected] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState(false);

  if (!questions || questions.length === 0) return null;

  const score = questions.filter((q) => selected[q.id] && q.correct.includes(selected[q.id])).length;

  return (
    <section className="my-6 rounded-xl border border-slate-700 bg-slate-900/40 p-6">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
        Quick Check — {questions.length} Question{questions.length > 1 ? 's' : ''}
      </p>
      <div className="space-y-6">
        {questions.map((q) => {
          const chosen = selected[q.id];
          return (
            <div key={q.id}>
              <p className="mb-3 text-sm font-medium text-slate-100">{q.stem}</p>
              <div className="space-y-2">
                {q.options.map((opt) => {
                  const isChosen = chosen === opt.id;
                  const isCorrect = q.correct.includes(opt.id);
                  const cls = revealed
                    ? isCorrect
                      ? 'border-emerald-500 bg-emerald-950/40'
                      : isChosen
                      ? 'border-rose-500 bg-rose-950/40'
                      : 'border-slate-700'
                    : isChosen
                    ? 'border-sky-400 bg-sky-950/30'
                    : 'border-slate-700';

                  return (
                    <button
                      key={opt.id}
                      disabled={revealed}
                      onClick={() => setSelected((s) => ({ ...s, [q.id]: opt.id }))}
                      className={`w-full rounded-lg border p-3 text-left text-sm transition ${cls} disabled:cursor-default`}
                    >
                      <span className="font-medium">{opt.id}.</span> {opt.text}
                    </button>
                  );
                })}
              </div>
              {revealed && (
                <p className="mt-2 text-xs text-slate-300">
                  <span className="font-medium text-sky-300">Rationale:</span> {q.rationale}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex items-center gap-4">
        <button
          onClick={() => setRevealed((r) => !r)}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-500"
        >
          {revealed ? 'Hide Answers' : 'Check Answers'}
        </button>
        {revealed && (
          <p className="text-sm text-slate-300">
            Score: <span className="font-semibold text-white">{score}/{questions.length}</span>
          </p>
        )}
      </div>
    </section>
  );
}
