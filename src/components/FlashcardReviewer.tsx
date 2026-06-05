'use client';

import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw, Check, X } from 'lucide-react';

export type Flashcard = {
  id: string;
  domain: number;
  objective: string;
  front: string;
  back: string;
  tags: string[];
};

type CardState = 'front' | 'back';
type Rating = 'easy' | 'hard';

const domainBadge: Record<number, string> = {
  1: 'bg-blue-900/60 text-blue-300 border border-blue-700/50',
  2: 'bg-purple-900/60 text-purple-300 border border-purple-700/50',
  3: 'bg-amber-900/60 text-amber-300 border border-amber-700/50',
};

export default function FlashcardReviewer({ cards }: { cards: Flashcard[] }) {
  const [queue, setQueue] = useState<Flashcard[]>(() => [...cards]);
  const [index, setIndex] = useState(0);
  const [side, setSide] = useState<CardState>('front');
  const [ratings, setRatings] = useState<Record<string, Rating>>({});
  const [done, setDone] = useState(false);

  const current = queue[index];
  const totalCards = cards.length;
  const ratedCount = Object.keys(ratings).length;

  const flip = useCallback(() => setSide((s) => (s === 'front' ? 'back' : 'front')), []);

  const rate = useCallback(
    (rating: Rating) => {
      if (!current) return;
      setRatings((prev) => ({ ...prev, [current.id]: rating }));

      if (index + 1 >= queue.length) {
        // End of queue — check if any hard cards to re-queue
        const hardCards = queue.filter((c, i) => i <= index && ratings[c.id] === 'hard' || (i === index && rating === 'hard'));
        if (hardCards.length > 0 && rating === 'hard') {
          // Already counted above, use updated ratings
        }
        setDone(true);
      } else {
        setIndex((i) => i + 1);
        setSide('front');
      }
    },
    [current, index, queue, ratings]
  );

  const restart = useCallback(() => {
    const hardIds = new Set(
      Object.entries({ ...ratings }).filter(([, r]) => r === 'hard').map(([id]) => id)
    );
    const hardCards = cards.filter((c) => hardIds.has(c.id));
    const newQueue = hardCards.length > 0 ? hardCards : [...cards];
    setQueue(newQueue);
    setIndex(0);
    setSide('front');
    setRatings({});
    setDone(false);
  }, [cards, ratings]);

  const restartAll = useCallback(() => {
    setQueue([...cards]);
    setIndex(0);
    setSide('front');
    setRatings({});
    setDone(false);
  }, [cards]);

  if (done) {
    const hardCount = Object.values({ ...ratings, [current?.id ?? '']: ratings[current?.id ?? ''] }).filter((r) => r === 'hard').length;
    const easyCount = totalCards - hardCount;
    return (
      <div className="card p-8 text-center space-y-4">
        <p className="text-2xl font-bold text-white">Session Complete</p>
        <p className="text-slate-300">{totalCards} cards reviewed</p>
        <div className="flex justify-center gap-6">
          <div className="text-center">
            <p className="text-3xl font-bold text-emerald-400">{easyCount}</p>
            <p className="text-sm text-slate-400">Easy</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-rose-400">{totalCards - easyCount}</p>
            <p className="text-sm text-slate-400">Hard</p>
          </div>
        </div>
        <div className="flex justify-center gap-3 pt-2">
          {totalCards - easyCount > 0 && (
            <button
              onClick={restart}
              className="flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-500"
            >
              <RotateCcw className="h-4 w-4" />
              Review Hard Cards ({totalCards - easyCount})
            </button>
          )}
          <button
            onClick={restartAll}
            className="flex items-center gap-2 rounded-lg bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4" />
            Restart All
          </button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center justify-between text-sm text-slate-400">
        <span>{index + 1} / {queue.length}</span>
        <div className="flex gap-3">
          <span className="text-emerald-400">{ratedCount - Object.values(ratings).filter((r) => r === 'hard').length} easy</span>
          <span className="text-rose-400">{Object.values(ratings).filter((r) => r === 'hard').length} hard</span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-sky-500 transition-all"
          style={{ width: `${((index) / queue.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        onClick={flip}
        className="card min-h-56 cursor-pointer p-6 transition hover:border-slate-600 select-none"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${domainBadge[current.domain]}`}>
              Domain {current.domain}
            </span>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs text-slate-400">
              Obj {current.objective}
            </span>
          </div>
          <span className="shrink-0 text-xs text-slate-500">
            {side === 'front' ? 'Question (tap to reveal)' : 'Answer'}
          </span>
        </div>

        {side === 'front' ? (
          <p className="text-lg font-medium text-white leading-relaxed">{current.front}</p>
        ) : (
          <div className="space-y-3">
            <p className="text-base text-slate-200 leading-relaxed">{current.back}</p>
            {current.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {current.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {side === 'back' ? (
        <div className="flex gap-3">
          <button
            onClick={() => rate('hard')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-rose-700/50 bg-rose-900/30 py-3 font-semibold text-rose-300 hover:bg-rose-900/50 transition"
          >
            <X className="h-5 w-5" />
            Hard — Review Again
          </button>
          <button
            onClick={() => rate('easy')}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-emerald-700/50 bg-emerald-900/30 py-3 font-semibold text-emerald-300 hover:bg-emerald-900/50 transition"
          >
            <Check className="h-5 w-5" />
            Easy — Got It
          </button>
        </div>
      ) : (
        <button
          onClick={flip}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 py-3 font-semibold text-slate-200 hover:bg-slate-700 transition"
        >
          Reveal Answer
        </button>
      )}

      {/* Navigation hint */}
      <div className="flex justify-between text-xs text-slate-600">
        <span className="flex items-center gap-1"><ChevronLeft className="h-3 w-3" /> Previous</span>
        <span>Click card to flip</span>
        <span className="flex items-center gap-1">Next <ChevronRight className="h-3 w-3" /></span>
      </div>
    </div>
  );
}
